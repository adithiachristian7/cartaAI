import os
import midtransclient
from fastapi import Header, HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- Client Initializations ---
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
MIDTRANS_SERVER_KEY = os.environ.get("MIDTRANS_SERVER_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, MIDTRANS_SERVER_KEY]):
    raise RuntimeError("Supabase and Midtrans environment variables must be set.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
snap = midtransclient.Snap(is_production=False, server_key=MIDTRANS_SERVER_KEY)

# --- Shared Dependencies ---
async def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization scheme.")
    token = authorization.split(" ")[1]
    try:
        res = supabase.auth.get_user(token)
        return res.user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token or user not found.")
