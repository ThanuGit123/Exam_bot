from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str = Field(min_length=8)

class UserInDB(BaseModel):
    full_name: str
    email: str
    hashed_password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    model: str
    history: list[ChatMessage]

class LearningPrefs(BaseModel):
    target_exam: str = "JEE"
    default_subject: str = "Physics"
    default_difficulty: str = "exam-level"
    pace: str = "balanced"
    style: str = "example-first"
    level: str = "building"
    exam_date: str = "2027-05-01"
    default_model: str = "groq"
    onboarded: bool = False

class AppPrefs(BaseModel):
    dark_mode: bool = False
    large_text: bool = False
    daily_reminders: bool = True
    email_notifications: bool = True
    updated_at: str = ""

class PreferencesUpdate(BaseModel):
    learning_prefs: dict = None
    app_prefs: dict = None
