# This is the main application file.
# It initializes the FastAPI app and includes the modular routers.

from fastapi import FastAPI
from routers import auth, payments

# Initialize the main FastAPI application
app = FastAPI(
    title="CartaAI Backend",
    description="API for user authentication and payments.",
    version="1.0.0",
)

# Include the routers from the other files
app.include_router(auth.router)
app.include_router(payments.router)

@app.get("/", tags=["Root"])
def read_root():
    """A simple health check endpoint."""
    return {"message": "Welcome to the CartaAI Backend!"}