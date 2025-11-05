# This is the main application file.
# It initializes the FastAPI app and includes the modular routers.

from fastapi import FastAPI
from routers import auth, payments, invitations

print("--- SERVER BERJALAN DENGAN KODE VERSI BARU ---")


# Initialize the main FastAPI application
app = FastAPI(
    title="CartaAI Backend",
    description="API for user authentication and payments.",
    version="1.0.0",
)

# Configure CORS (Cross-Origin Resource Sharing)
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "https://cartaai.my.id",
    "http://localhost",
    "http://localhost:3000",
]

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