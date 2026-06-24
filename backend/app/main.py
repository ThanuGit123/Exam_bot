import secrets
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import connect_to_mongo, close_mongo_connection, get_database
from app.models import UserCreate, UserInDB, UserLogin, ForgotPasswordRequest, ResetPasswordRequest
from app.auth import get_password_hash, verify_password

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await connect_to_mongo()
    yield
    # Shutdown logic
    await close_mongo_connection()

app = FastAPI(
    title="RankForge API",
    description="Backend API for adaptive competitive exam preparation",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    db = get_database()
    db_status = "connected" if db is not None else "disconnected"
    return {"status": "ok", "database": db_status}

@app.post("/api/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    db = get_database()
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user document
    hashed_password = get_password_hash(user.password)
    user_db = UserInDB(full_name=user.full_name, email=user.email, hashed_password=hashed_password)
    
    await db.users.insert_one(user_db.dict())
    return {"message": "User created successfully"}

@app.post("/api/login")
async def login(user: UserLogin):
    db = get_database()
    # Find user by email
    existing_user = await db.users.find_one({"email": user.email})
    
    # If user doesn't exist or password doesn't match, return 401 Unauthorized
    if not existing_user or not verify_password(user.password, existing_user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    # Return success payload (in a real app, this would return a JWT token)
    return {
        "message": "Login successful",
        "user": {
            "email": existing_user["email"],
            "full_name": existing_user["full_name"]
        }
    }

@app.post("/api/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    db = get_database()
    user = await db.users.find_one({"email": request.email})
    
    if not user:
        # For security, we usually don't reveal if an email is registered or not
        return {"message": "If that email is registered, a reset link has been sent."}
        
    # Generate a secure token
    token = secrets.token_urlsafe(32)
    
    # Store token with 1 hour expiration
    expiration = datetime.utcnow() + timedelta(hours=1)
    
    await db.password_resets.insert_one({
        "email": request.email,
        "token": token,
        "expires_at": expiration
    })
    
    # Simulate sending email by printing to console
    reset_link = f"http://localhost:5173/reset-password?token={token}"
    print("\n" + "="*50)
    print("SIMULATED EMAIL SENT TO:", request.email)
    print("Subject: Password Reset Request")
    print("Body: Click the link below to reset your password:")
    print(reset_link)
    print("="*50 + "\n")
    
    return {"message": "If that email is registered, a reset link has been sent."}

@app.post("/api/reset-password")
async def reset_password(request: ResetPasswordRequest):
    db = get_database()
    
    # Find valid token
    reset_doc = await db.password_resets.find_one({
        "token": request.token,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not reset_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
    # Hash new password
    hashed_password = get_password_hash(request.new_password)
    
    # Update user's password
    result = await db.users.update_one(
        {"email": reset_doc["email"]},
        {"$set": {"hashed_password": hashed_password}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Delete the used token
    await db.password_resets.delete_one({"_id": reset_doc["_id"]})
    
    return {"message": "Password successfully reset"}

@app.get("/")
async def root():
    return {"message": "Welcome to RankForge API"}
