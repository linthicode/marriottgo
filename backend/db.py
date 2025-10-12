# db.py
import os
from typing import Any, Dict, List, Optional
from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = "https://uagirwoitavcfaujqoed.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhZ2lyd29pdGF2Y2ZhdWpxb2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTIwMjcsImV4cCI6MjA3NTc4ODAyN30.dU7lVh0u6ErhEWe1Ob4v_bZaM2amERl9G9mG3-j4z44"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- profiles ---
def get_profile_core(user_id: str) -> Optional[Dict[str, Any]]:
    res = (supabase.table("profiles")
           .select("id, embeddings, posts")
           .eq("id", user_id).single().execute())
    return res.data if res.data else None

def get_user_embedding(user_id: str) -> Optional[list]:
    prof = get_profile_core(user_id)
    return prof.get("embeddings") if prof else None

def set_user_embedding(user_id: str, embedding: list) -> dict:
    """Set or upsert the user's embeddings. Returns a dict with status_code, data, error for easier debugging."""
    try:
        # Try update first
        res = (supabase.table("profiles")
               .update({"embeddings": embedding})
               .eq("id", user_id)
               .execute())

        result = {
            "status_code": getattr(res, "status_code", None),
            "data": getattr(res, "data", None),
            "error": getattr(res, "error", None),
        }

        # If update returned no data, attempt upsert/insert
        no_data = result["data"] is None or (isinstance(result["data"], list) and len(result["data"]) == 0)
        if no_data:
            try:
                upsert_res = (supabase.table("profiles")
                               .upsert({"id": user_id, "embeddings": embedding})
                               .execute())
                upsert_result = {
                    "status_code": getattr(upsert_res, "status_code", None),
                    "data": getattr(upsert_res, "data", None),
                    "error": getattr(upsert_res, "error", None),
                }
                return {"update": result, "upsert": upsert_result}
            except Exception as ue:
                return {"update": result, "upsert": None, "error": str(ue)}

        return {"update": result}
    except Exception as e:
        return {"error": str(e)}

def get_user_posts_count(user_id: str) -> int:
    prof = get_profile_core(user_id)
    return int(prof.get("posts") or 0) if prof else 0

# --- posts ---
def get_post_core(post_id: str) -> Optional[Dict[str, Any]]:
    # Only the fields you said you need
    res = (supabase.table("posts")
           .select("id, user_id, hotel_address, activity_tags, rating, caption, experience_title")
           .eq("id", post_id).single().execute())
    return res.data if res.data else None