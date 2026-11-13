import logging
from typing import Optional
from supabase import create_client, Client
from backend.core.config import settings

logger = logging.getLogger(__name__)

_supabase_client: Optional[Client] = None

def get_supabase_client() -> Optional[Client]:
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client
    
    try:
        if settings.SUPABASE_URL and "your-project" not in settings.SUPABASE_URL:
            _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            logger.info("Supabase client initialized successfully")
        else:
            logger.warning("Supabase URL is not configured or using default placeholder. Mock/local DB active.")
            _supabase_client = None
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        _supabase_client = None
        
    return _supabase_client
