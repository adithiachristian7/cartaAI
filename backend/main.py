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

origins = [
    "http://localhost",
    "http://localhost:3000",  # Alamat default React frontend
    # Anda bisa menambahkan alamat frontend Anda yang sudah di-deploy di sini nanti
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Izinkan semua metode (GET, POST, etc)
    allow_headers=["*"],  # Izinkan semua header
)


# Include the routers from the other files
app.include_router(auth.router)
app.include_router(payments.router)
app.include_router(invitations.router)

@app.get("/", tags=["Root"])
def read_root():
    """A simple health check endpoint."""
    return {"message": "Welcome to the CartaAI Backend!"}