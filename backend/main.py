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
    "https://cartaai.my.id",
    "https://www.cartaai.my.id",
    "https://api.cartaai.my.id",
    "http://localhost:3000",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers from the other files
app.include_router(auth.router)
app.include_router(payments.router)
app.include_router(invitations.router)

@app.get("/", tags=["Root"])
def read_root():
    """A simple health check endpoint."""
    return {"message": "Welcome to the CartaAI Backend!"}