# This is the main application file.
# It initializes the FastAPI app and includes the modular routers.

from fastapi import FastAPI
from routers import auth, payments, invitations

# Initialize the main FastAPI application
app = FastAPI(
    title="CartaAI Backend",
    description="API for user authentication and payments.",
    version="1.0.0",
)

# Configure CORS (Cross-Origin Resource Sharing)
from fastapi.middleware.cors import CORSMiddleware

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(payments.router)
app.include_router(invitations.router)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the CartaAI Backend!"}

# ✅ Preflight OPTIONS handler (letakkan di paling bawah)
from fastapi import Response

@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str):
    return Response(status_code=200)