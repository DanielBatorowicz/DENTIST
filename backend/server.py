from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


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


# Models
class AppointmentCreate(BaseModel):
    name: str
    email: str
    phone: str
    service: str
    preferred_date: str = ""
    preferred_time: str = ""
    message: str = ""


class ContactMessage(BaseModel):
    name: str
    email: str
    phone: str = ""
    service: str = ""
    message: str


# Routes
@api_router.get("/")
async def root():
    return {"message": "Bright Smile Dental Care API"}


@api_router.post("/appointments")
async def create_appointment(input: AppointmentCreate):
    doc = input.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['status'] = 'pending'
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    await db.appointments.insert_one(doc)
    # Remove MongoDB internal _id before returning
    doc.pop('_id', None)
    return {"message": "Appointment request received successfully", "id": doc['id']}


@api_router.get("/appointments")
async def get_appointments():
    appointments = await db.appointments.find({}, {"_id": 0}).to_list(1000)
    return appointments


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
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
