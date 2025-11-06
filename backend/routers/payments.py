from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import uuid
import hashlib
from datetime import datetime, timedelta
from dependencies import supabase, snap, get_current_user, MIDTRANS_SERVER_KEY

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)

class PaymentRequest(BaseModel):
    plan: str

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

@router.post("/create-transaction", tags=["Payments"])
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
        return {"token": transaction['token']}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Midtrans Library Error: {str(e)}")

@router.post("/midtrans-notification", tags=["Payments"])
async def handle_midtrans_notification(payload: MidtransWebhookPayload):
    # 1. Verifikasi signature key dari Midtrans untuk keamanan
    signature_payload = f"{payload.order_id}{payload.status_code}{payload.gross_amount}{MIDTRANS_SERVER_KEY}".encode()
    expected_signature = hashlib.sha512(signature_payload).hexdigest()

    if payload.signature_key != expected_signature:
        raise HTTPException(status_code=403, detail="Invalid signature key.")

    order_id = payload.order_id
    transaction_status = payload.transaction_status
    fraud_status = payload.fraud_status

    # 2. Proses hanya jika transaksi berhasil dan tidak fraud
    if transaction_status in ['capture', 'settlement'] and fraud_status == 'accept':
        try:
            # Ambil data langganan terlebih dahulu untuk mendapatkan user_id
            subscription_response = supabase.table("subscriptions").select("user_id").eq("id", order_id).single().execute()
            
            if not subscription_response.data:
                raise HTTPException(status_code=404, detail=f"Subscription with order_id {order_id} not found.")

            user_id = subscription_response.data['user_id']

            # Update tabel subscriptions: set status ke active dan tanggal berakhir
            end_date = datetime.utcnow() + timedelta(days=30)
            supabase.table("subscriptions").update({
                "status": "active",
                "end_date": end_date.isoformat(),
                "payment_id": payload.transaction_id
            }).eq("id", order_id).execute()

            # Update tabel users: set subscription_status ke premium
            supabase.table("users").update({"subscription_status": "premium"}).eq("id", user_id).execute()
            
            return {"message": f"Payment for order {order_id} successful. User {user_id} upgraded to premium."}
        
        except Exception as e:
            # Catat error untuk debugging
            print(f"Webhook processing error for order {order_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Webhook DB Error: {str(e)}")

    elif transaction_status in ['cancel', 'deny', 'expire']:
        # Opsional: Tangani kasus pembayaran gagal
        supabase.table("subscriptions").update({"status": "failed"}).eq("id", order_id).execute()
        return {"message": f"Payment for order {order_id} failed or was cancelled."}

    return {"message": "Webhook received and acknowledged, but no action taken."}
