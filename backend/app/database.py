import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import logging

load_dotenv()

# Initialize logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("DATABASE_NAME", "rankforge_db")
    
    if not uri:
        logger.warning("MONGODB_URI not found in environment variables.")
        return

    logger.info("Connecting to MongoDB...")
    db_instance.client = AsyncIOMotorClient(uri)
    db_instance.db = db_instance.client[db_name]
    logger.info("Successfully connected to MongoDB.")

async def close_mongo_connection():
    if db_instance.client is not None:
        logger.info("Closing MongoDB connection...")
        db_instance.client.close()
        logger.info("MongoDB connection closed.")

def get_database():
    return db_instance.db
