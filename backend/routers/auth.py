from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dependencies import supabase

router = APIRouter()

class UserCredentials(BaseModel):
    email: str
    password: str

@router.post("/register", tags=["Authentication"])
def register_user(credentials: UserCredentials):
    try:
        res = supabase.auth.sign_up({"email": credentials.email, "password": credentials.password})
        return {"message": "Registration successful. Please check your email to confirm your account."}
    except Exception as e:
        if "User already registered" in str(e):
            raise HTTPException(status_code=400, detail="User with this email already exists.")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", tags=["Authentication"])
def login_user(credentials: UserCredentials):
    try:
        res = supabase.auth.sign_in_with_password({"email": credentials.email, "password": credentials.password})
        return res
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid login credentials.")
