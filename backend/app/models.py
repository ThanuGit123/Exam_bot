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
