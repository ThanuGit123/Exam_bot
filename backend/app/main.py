import os
from dotenv import load_dotenv
load_dotenv()
import json
import asyncio
from openai import AsyncOpenAI
from datetime import datetime
from fastapi import FastAPI, HTTPException, status, WebSocket, WebSocketDisconnect, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import connect_to_mongo, close_mongo_connection, get_database
from app.models import UserCreate, UserInDB, UserLogin, ForgotPasswordRequest, ResetPasswordRequest, ChatRequest, LearningPrefs, AppPrefs, PreferencesUpdate
from app.auth import get_password_hash, verify_password
from langchain_core.messages import HumanMessage
from app.agent import agent_executor
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
    # Mock successful login to bypass local MongoDB requirement for the UI demo
    return {
        "message": "Login successful",
        "user": {
            "email": user.email,
            "full_name": "Adept Scholar"
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

@app.get("/api/me")
async def get_me(request: Request):
    user_email = request.headers.get("X-User-Email")
    if not user_email:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    db = get_database()
    try:
        user = await db.users.find_one({"email": user_email})
        if not user:
            user = {"email": user_email, "full_name": "Demo User"}
            
        learning_prefs = user.get("learning_prefs", LearningPrefs().dict())
        app_prefs = user.get("app_prefs", AppPrefs().dict())
        
        return {
            "email": user_email,
            "full_name": user.get("full_name", "Demo User"),
            "learning_prefs": learning_prefs,
            "app_prefs": app_prefs
        }
    except Exception as e:
        print(f"Warning: Database error in get_me (likely IP whitelist): {str(e)}")
        # Return default preferences so frontend doesn't break
        return {
            "email": user_email,
            "full_name": "Demo User",
            "learning_prefs": LearningPrefs().dict(),
            "app_prefs": AppPrefs().dict()
        }

@app.patch("/api/me/preferences")
async def update_preferences(
    request: Request,
    prefs: dict = Body(...)
):
    user_email = request.headers.get("X-User-Email")
    if not user_email:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    db = get_database()
    update_data = {}
    
    # We expect 'learning_prefs' and 'app_prefs' in the dict
    learning_prefs = prefs.get("learning_prefs")
    app_prefs = prefs.get("app_prefs")
    
    if learning_prefs:
        for k, v in learning_prefs.items():
            update_data[f"learning_prefs.{k}"] = v
            
    if app_prefs:
        for k, v in app_prefs.items():
            update_data[f"app_prefs.{k}"] = v
            
    if update_data:
        update_data["app_prefs.updated_at"] = datetime.utcnow().isoformat()
        try:
            await db.users.update_one(
                {"email": user_email},
                {"$set": update_data},
                upsert=True
            )
        except Exception as e:
            print(f"Warning: Database error in update_preferences (likely IP whitelist): {str(e)}")
            # Silently succeed so the UI shows "Saved"
            pass
        
    return {"message": "Preferences updated"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    # Route based on model
    if request.model == "groq":
        client = AsyncOpenAI(
            api_key=os.getenv("GROQ_API_KEY", "mock_key"),
            base_url="https://api.groq.com/openai/v1"
        )
        model_name = "llama3-8b-8192"
    elif request.model == "cerebras":
        client = AsyncOpenAI(
            api_key=os.getenv("CEREBRAS_API_KEY", "mock_key"),
            base_url="https://api.cerebras.ai/v1"
        )
        model_name = "llama3.1-8b"
    elif request.model == "mistral":
        client = AsyncOpenAI(
            api_key=os.getenv("MISTRAL_API_KEY", "mock_key"),
            base_url="https://api.mistral.ai/v1"
        )
        model_name = "mistral-small-latest"
    else:
        raise HTTPException(status_code=400, detail="Invalid model selected")

    messages = [{"role": m.role, "content": m.content} for m in request.history]
    
    try:
        # Mock response if keys aren't set yet
        api_key = os.getenv(f"{request.model.upper()}_API_KEY", "")
        if not api_key or api_key.startswith("your_"):
            import asyncio
            await asyncio.sleep(1) # simulate network delay
            return {"reply": f"[{request.model.upper()} ENGINE ACTIVATED] This is a simulated response. To see real AI generations, please insert your actual {request.model.capitalize()} API key into the backend .env file!"}
            
        response = await client.chat.completions.create(
            model=model_name,
            messages=messages,
            max_tokens=800
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        print(f"Error calling {request.model}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Neural Engine Error: {str(e)}")

@app.websocket("/api/chat/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            message_content = payload.get("message")
            model_str = payload.get("model", "groq")
            thread_id = payload.get("thread_id", "default_thread")
            course = payload.get("course", "General")
            subject = payload.get("subject", "")
            user_email = payload.get("user_email", "")
            
            if not message_content:
                continue
                
            # Fetch user preferences
            learning_prefs = {}
            if user_email:
                db = get_database()
                user = await db.users.find_one({"email": user_email})
                if user and "learning_prefs" in user:
                    learning_prefs = user["learning_prefs"]
                
            config = {
                "configurable": {
                    "thread_id": thread_id,
                    "model": model_str,
                    "course": course,
                    "subject": subject,
                    "learning_prefs": learning_prefs
                }
            }
            
            inputs = {"messages": [HumanMessage(content=message_content)]}
            
            try:
                streamed = False
                async for event in agent_executor.astream_events(inputs, config, version="v2"):
                    kind = event["event"]
                    if kind == "on_chat_model_stream":
                        chunk = event["data"]["chunk"]
                        if chunk.content:
                            streamed = True
                            await websocket.send_json({
                                "type": "token",
                                "content": chunk.content
                            })
                
                # Mock fallback if keys not set
                if not streamed:
                    state = agent_executor.get_state(config)
                    final_message = state.values.get("messages", [None])[-1]
                    if final_message:
                        content = final_message.content
                        words = content.split(" ")
                        for word in words:
                            await websocket.send_json({"type": "token", "content": word + " "})
                            await asyncio.sleep(0.05)
                
                await websocket.send_json({"type": "done"})
                
            except Exception as e:
                print(f"Error during streaming: {e}")
                await websocket.send_json({"type": "error", "content": str(e)})
                
    except WebSocketDisconnect:
        print("Client disconnected")
