import os
import uuid
import hashlib
import midtransclient
from fastapi import FastAPI, HTTPException, Depends, Header, Request
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel
from datetime import datetime, timedelta

# --- Model Data untuk Request Body ---
class UserCredentials(BaseModel):
    email: str
    password: str

class PaymentRequest(BaseModel):
    plan: str # e.g., 'premium_monthly'

class MidtransWebhookPayload(BaseModel):
    transaction_time: str
    transaction_status: str
    transaction_id: str
    status_message: str
    status_code: str
    signature_key: str
    order_id: str
    merchant_id: str
    gross_amount: str
    fraud_status: str
    currency: str

# --- Konfigurasi Awal ---
load_dotenv()
app = FastAPI()

# Ambil environment variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
MIDTRANS_SERVER_KEY = os.environ.get("MIDTRANS_SERVER_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, MIDTRANS_SERVER_KEY]):
    raise RuntimeError("Supabase and Midtrans environment variables must be set.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Inisialisasi Midtrans Snap client
snap = midtransclient.Snap(
    is_production=False,
    server_key=MIDTRANS_SERVER_KEY
)

# --- Dependency untuk otentikasi ---
async def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization scheme.")
    token = authorization.split(" ")[1]
    try:
        res = supabase.auth.get_user(token)
        return res.user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token or user not found.")

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Backend CartaAI aktif!"}

@app.post("/register")
def register_user(credentials: UserCredentials):
    try:
        res = supabase.auth.sign_up({"email": credentials.email, "password": credentials.password})
        return {"message": "Registration successful. Please check your email to confirm your account."}
    except Exception as e:
        if "User already registered" in str(e):
            raise HTTPException(status_code=400, detail="User with this email already exists.")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
def login_user(credentials: UserCredentials):
    try:
        res = supabase.auth.sign_in_with_password({"email": credentials.email, "password": credentials.password})
        return res
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid login credentials.")

@app.post("/api/payments/create-transaction")
def create_midtrans_transaction(payment: PaymentRequest, current_user: dict = Depends(get_current_user)):
    order_id = str(uuid.uuid4())
    user_id = current_user.id
    gross_amount = 99000

    try:
        subscription_data = {
            "id": order_id,
            "user_id": user_id,
            "tier": payment.plan,
            "status": "pending",
            "start_date": datetime.utcnow().isoformat(),
        }
        supabase.table("subscriptions").insert(subscription_data).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")

    # Buat parameter transaksi untuk library midtransclient
    param = {
        "transaction_details": {
            "order_id": order_id,
            "gross_amount": gross_amount
        },
        "customer_details": {
            "email": current_user.email
        }
    }

    try:
        transaction = snap.create_transaction(param)
        # Return the transaction token to the frontend for snap.js
        return {"token": transaction['token']}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Midtrans Library Error: {str(e)}")

@app.post("/api/payments/midtrans-notification")
async def handle_midtrans_notification(payload: MidtransWebhookPayload):
    signature_payload = f"{payload.order_id}{payload.status_code}{payload.gross_amount}{MIDTRANS_SERVER_KEY}".encode()
    expected_signature = hashlib.sha512(signature_payload).hexdigest()

    if payload.signature_key != expected_signature:
        raise HTTPException(status_code=403, detail="Invalid signature key.")

    order_id = payload.order_id
    transaction_status = payload.transaction_status
    fraud_status = payload.fraud_status

    if transaction_status == 'capture' or transaction_status == 'settlement':
        if fraud_status == 'accept':
            try:
                subscription, error = supabase.table("subscriptions").update({
                    "status": "active",
                    "end_date": (datetime.utcnow() + timedelta(days=30)).isoformat()
                }).eq("id", order_id).execute()
                
                if not subscription[1]:
                    raise HTTPException(status_code=404, detail="Subscription not found.")

                user_id = subscription[1][0]['user_id']
                supabase.table("users").update({"subscription_status": "premium"}).eq("id", user_id).execute()
                
                return {"message": "Payment successful, user upgraded."}
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Webhook DB Error: {str(e)}")

    return {"message": "Webhook received and processed."}
