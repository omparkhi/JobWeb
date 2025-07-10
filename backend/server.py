from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import base64
from bson import ObjectId

# Helper function to convert MongoDB documents to JSON-serializable format
def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable format"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    if isinstance(doc, dict):
        # Remove MongoDB's _id field and convert any ObjectIds to strings
        result = {}
        for key, value in doc.items():
            if key == '_id':
                continue  # Skip MongoDB's _id field
            elif isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, dict):
                result[key] = serialize_doc(value)
            elif isinstance(value, list):
                result[key] = serialize_doc(value)
            else:
                result[key] = value
        return result
    return doc

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# User roles
class UserRole:
    CANDIDATE = "candidate"
    COMPANY = "company"
    ADMIN = "admin"

# Pydantic Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str  # candidate, company, admin

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    role: str
    name: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    role: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    hashed_password: str = ""

class CandidateProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    resume_url: Optional[str] = None
    skills: List[str] = []
    experience: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CompanyProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    company_name: str
    description: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    logo_url: Optional[str] = None
    is_approved: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Job(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    company_name: str
    title: str
    description: str
    requirements: str
    location: str
    experience_level: str
    salary_range: Optional[str] = None
    job_type: str  # full-time, part-time, contract
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Application(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    job_id: str
    candidate_id: str
    candidate_name: str
    candidate_email: str
    company_id: str
    job_title: str
    status: str = "pending"  # pending, shortlisted, rejected, accepted
    cover_letter: Optional[str] = None
    applied_at: datetime = Field(default_factory=datetime.utcnow)

# Request Models
class CandidateProfileUpdate(BaseModel):
    resume_url: Optional[str] = None
    skills: Optional[List[str]] = None
    experience: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None

class CompanyProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    logo_url: Optional[str] = None

class JobCreate(BaseModel):
    title: str
    description: str
    requirements: str
    location: str
    experience_level: str
    salary_range: Optional[str] = None
    job_type: str

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    location: Optional[str] = None
    experience_level: Optional[str] = None
    salary_range: Optional[str] = None
    job_type: Optional[str] = None
    is_active: Optional[bool] = None

class ApplicationCreate(BaseModel):
    job_id: str
    cover_letter: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: str

# Utility Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = await db.users.find_one({"id": user_id})
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return User(**user)
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_role(required_role: str):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker

# Authentication Routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        name=user_data.name,
        role=user_data.role,
        hashed_password=hashed_password
    )
    
    await db.users.insert_one(user.dict())
    
    # Create role-specific profile
    if user_data.role == UserRole.CANDIDATE:
        candidate_profile = CandidateProfile(user_id=user.id)
        await db.candidate_profiles.insert_one(candidate_profile.dict())
    elif user_data.role == UserRole.COMPANY:
        company_profile = CompanyProfile(user_id=user.id, company_name=user_data.name)
        await db.company_profiles.insert_one(company_profile.dict())
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role,
        "name": user.name
    }

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user["id"],
        "role": user["role"],
        "name": user["name"]
    }

# Candidate Routes
@api_router.get("/candidate/profile")
async def get_candidate_profile(current_user: User = Depends(require_role(UserRole.CANDIDATE))):
    profile = await db.candidate_profiles.find_one({"user_id": current_user.id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@api_router.put("/candidate/profile")
async def update_candidate_profile(
    profile_data: CandidateProfileUpdate,
    current_user: User = Depends(require_role(UserRole.CANDIDATE))
):
    update_data = {k: v for k, v in profile_data.dict().items() if v is not None}
    if update_data:
        await db.candidate_profiles.update_one(
            {"user_id": current_user.id},
            {"$set": update_data}
        )
    profile = await db.candidate_profiles.find_one({"user_id": current_user.id})
    return profile

@api_router.get("/candidate/jobs")
async def search_jobs(
    title: Optional[str] = None,
    location: Optional[str] = None,
    company: Optional[str] = None,
    experience: Optional[str] = None,
    current_user: User = Depends(require_role(UserRole.CANDIDATE))
):
    query = {"is_active": True}
    if title:
        query["title"] = {"$regex": title, "$options": "i"}
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if company:
        query["company_name"] = {"$regex": company, "$options": "i"}
    if experience:
        query["experience_level"] = {"$regex": experience, "$options": "i"}
    
    jobs = await db.jobs.find(query).to_list(100)
    return jobs

@api_router.post("/candidate/applications")
async def apply_for_job(
    application_data: ApplicationCreate,
    current_user: User = Depends(require_role(UserRole.CANDIDATE))
):
    # Check if job exists
    job = await db.jobs.find_one({"id": application_data.job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check if already applied
    existing_application = await db.applications.find_one({
        "job_id": application_data.job_id,
        "candidate_id": current_user.id
    })
    if existing_application:
        raise HTTPException(status_code=400, detail="Already applied for this job")
    
    # Create application
    application = Application(
        job_id=application_data.job_id,
        candidate_id=current_user.id,
        candidate_name=current_user.name,
        candidate_email=current_user.email,
        company_id=job["company_id"],
        job_title=job["title"],
        cover_letter=application_data.cover_letter
    )
    
    await db.applications.insert_one(application.dict())
    return application

@api_router.get("/candidate/applications")
async def get_my_applications(current_user: User = Depends(require_role(UserRole.CANDIDATE))):
    applications = await db.applications.find({"candidate_id": current_user.id}).to_list(100)
    return applications

# Company Routes
@api_router.get("/company/profile")
async def get_company_profile(current_user: User = Depends(require_role(UserRole.COMPANY))):
    profile = await db.company_profiles.find_one({"user_id": current_user.id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@api_router.put("/company/profile")
async def update_company_profile(
    profile_data: CompanyProfileUpdate,
    current_user: User = Depends(require_role(UserRole.COMPANY))
):
    update_data = {k: v for k, v in profile_data.dict().items() if v is not None}
    if update_data:
        await db.company_profiles.update_one(
            {"user_id": current_user.id},
            {"$set": update_data}
        )
    profile = await db.company_profiles.find_one({"user_id": current_user.id})
    return profile

@api_router.post("/company/jobs")
async def create_job(
    job_data: JobCreate,
    current_user: User = Depends(require_role(UserRole.COMPANY))
):
    # Get company profile
    company_profile = await db.company_profiles.find_one({"user_id": current_user.id})
    if not company_profile:
        raise HTTPException(status_code=404, detail="Company profile not found")
    
    job = Job(
        company_id=current_user.id,
        company_name=company_profile["company_name"],
        title=job_data.title,
        description=job_data.description,
        requirements=job_data.requirements,
        location=job_data.location,
        experience_level=job_data.experience_level,
        salary_range=job_data.salary_range,
        job_type=job_data.job_type
    )
    
    await db.jobs.insert_one(job.dict())
    return job

@api_router.get("/company/jobs")
async def get_company_jobs(current_user: User = Depends(require_role(UserRole.COMPANY))):
    jobs = await db.jobs.find({"company_id": current_user.id}).to_list(100)
    return jobs

@api_router.put("/company/jobs/{job_id}")
async def update_job(
    job_id: str,
    job_data: JobUpdate,
    current_user: User = Depends(require_role(UserRole.COMPANY))
):
    # Check if job belongs to company
    job = await db.jobs.find_one({"id": job_id, "company_id": current_user.id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    update_data = {k: v for k, v in job_data.dict().items() if v is not None}
    if update_data:
        await db.jobs.update_one(
            {"id": job_id},
            {"$set": update_data}
        )
    
    updated_job = await db.jobs.find_one({"id": job_id})
    return updated_job

@api_router.get("/company/jobs/{job_id}/applications")
async def get_job_applications(
    job_id: str,
    current_user: User = Depends(require_role(UserRole.COMPANY))
):
    # Check if job belongs to company
    job = await db.jobs.find_one({"id": job_id, "company_id": current_user.id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    applications = await db.applications.find({"job_id": job_id}).to_list(100)
    return applications

@api_router.put("/company/applications/{application_id}/status")
async def update_application_status(
    application_id: str,
    status_data: ApplicationStatusUpdate,
    current_user: User = Depends(require_role(UserRole.COMPANY))
):
    # Check if application belongs to company
    application = await db.applications.find_one({"id": application_id, "company_id": current_user.id})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    await db.applications.update_one(
        {"id": application_id},
        {"$set": {"status": status_data.status}}
    )
    
    updated_application = await db.applications.find_one({"id": application_id})
    return updated_application

# Admin Routes
@api_router.get("/admin/users")
async def get_all_users(current_user: User = Depends(require_role(UserRole.ADMIN))):
    users = await db.users.find({}).to_list(100)
    # Remove password hashes
    for user in users:
        user.pop("hashed_password", None)
    return users

@api_router.get("/admin/companies")
async def get_all_companies(current_user: User = Depends(require_role(UserRole.ADMIN))):
    companies = await db.company_profiles.find({}).to_list(100)
    return companies

@api_router.put("/admin/companies/{company_id}/approve")
async def approve_company(
    company_id: str,
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    await db.company_profiles.update_one(
        {"id": company_id},
        {"$set": {"is_approved": True}}
    )
    company = await db.company_profiles.find_one({"id": company_id})
    return company

@api_router.put("/admin/companies/{company_id}/reject")
async def reject_company(
    company_id: str,
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    await db.company_profiles.update_one(
        {"id": company_id},
        {"$set": {"is_approved": False}}
    )
    company = await db.company_profiles.find_one({"id": company_id})
    return company

@api_router.get("/admin/jobs")
async def get_all_jobs(current_user: User = Depends(require_role(UserRole.ADMIN))):
    jobs = await db.jobs.find({}).to_list(100)
    return jobs

@api_router.get("/admin/analytics")
async def get_analytics(current_user: User = Depends(require_role(UserRole.ADMIN))):
    total_users = await db.users.count_documents({})
    total_candidates = await db.users.count_documents({"role": UserRole.CANDIDATE})
    total_companies = await db.users.count_documents({"role": UserRole.COMPANY})
    total_jobs = await db.jobs.count_documents({})
    total_applications = await db.applications.count_documents({})
    approved_companies = await db.company_profiles.count_documents({"is_approved": True})
    pending_companies = await db.company_profiles.count_documents({"is_approved": False})
    
    return {
        "total_users": total_users,
        "total_candidates": total_candidates,
        "total_companies": total_companies,
        "total_jobs": total_jobs,
        "total_applications": total_applications,
        "approved_companies": approved_companies,
        "pending_companies": pending_companies
    }

@api_router.delete("/admin/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    # Delete user and related data
    await db.users.delete_one({"id": user_id})
    await db.candidate_profiles.delete_many({"user_id": user_id})
    await db.company_profiles.delete_many({"user_id": user_id})
    await db.jobs.delete_many({"company_id": user_id})
    await db.applications.delete_many({"candidate_id": user_id})
    
    return {"message": "User deleted successfully"}

# File upload route
@api_router.post("/upload/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Read file content and encode as base64
    file_content = await file.read()
    encoded_content = base64.b64encode(file_content).decode('utf-8')
    
    # Save to database or return URL
    resume_url = f"data:application/pdf;base64,{encoded_content}"
    
    return {"resume_url": resume_url}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()