# db.py
import os
from typing import Any, Dict, List, Optional
from supabase import create_client, Client

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]  # service role (server-side only)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ---------- PROFILES (embeddings + posts count) ----------
def get_profile_core(user_id: str) -> Optional[Dict[str, Any]]:
    # Only fetch what we need
    res = (
        supabase.table("profiles")
        .select("id, embeddings, posts")
        .eq("id", user_id)
        .single()
        .execute()
    )
    return res.data if res.data else None

def get_user_embedding(user_id: str) -> Optional[list]:
    prof = get_profile_core(user_id)
    return prof.get("embeddings") if prof else None

def set_user_embedding(user_id: str, embedding: List[float]) -> None:
    supabase.table("profiles").update({"embeddings": embedding}).eq("id", user_id).execute()

def get_user_posts_count(user_id: str) -> int:
    prof = get_profile_core(user_id)
    return int(prof.get("posts") or 0) if prof else 0

# ---------- POSTS (only the needed fields) ----------
def insert_post_minimal(
    *,
    user_id: str,
    hotel_address: Optional[str],
    activity_tags: Optional[List[str]],
    rating: Optional[int],
    caption: Optional[str],
    experience_title: Optional[str],
) -> Dict[str, Any]:
    payload: Dict[str, Any] = {
        "user_id": user_id,
        "hotel_address": hotel_address,
        "activity_tags": activity_tags or [],
        "rating": rating,
        "caption": caption,
        "experience_title": experience_title,
    }
    # drop None to avoid overwriting defaults
    payload = {k: v for k, v in payload.items() if v is not None}
    res = supabase.table("posts").insert(payload).execute()
    return (res.data or [{}])[0]
