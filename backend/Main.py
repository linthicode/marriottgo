# Main.py - Travel Recommendation API
from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import json
import traceback
from location_data import LocationDataset
from get_recs import Recs
from db import (
    get_user_embedding, set_user_embedding, get_user_posts_count, get_post_core
)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "service": "Travel Recommendation API"})

# Your activity space (must match how you built location vectors in model)
ACTIVITY_TYPES = [
    "natural","museums","theatres_and_entertainments","urban_environment",
    "historic","religion","architecture","industrial_facilities",
    "amusements","sport","adult","shops","foods"
]

def tags_to_vector(tags):
    """Convert post.activity_tags (list[str] or string) -> 13-dim binary vector.

    Accepts:
      - list/tuple of strings
      - a JSON string representation of a list
      - comma-separated string like "nature,shops"
      - None
    Returns a numpy float array length 13.
    """
    try:
        if not tags:
            tags_list = []
        elif isinstance(tags, (list, tuple)):
            tags_list = [str(t).lower() for t in tags if t]
        elif isinstance(tags, str):
            # try JSON decode first
            try:
                parsed = json.loads(tags)
                if isinstance(parsed, (list, tuple)):
                    tags_list = [str(t).lower() for t in parsed if t]
                else:
                    # fallback to comma-split
                    tags_list = [t.strip().lower() for t in tags.split(",") if t.strip()]
            except Exception:
                tags_list = [t.strip().lower() for t in tags.split(",") if t.strip()]
        else:
            tags_list = []
    except Exception:
        tags_list = []

    return np.array([1 if t in tags_list else 0 for t in ACTIVITY_TYPES], dtype=float)


# 1) Called after a post is created to update the user's embedding
# Use whichever trigger you prefer:
#  - Frontend calls this endpoint with {"post_id": "..."} right after insert
#  - OR Supabase → 'Database Webhook' → POST here with the new row
@app.route("/events/post-created", methods=["POST"])
def on_post_created():
    data = request.get_json(silent=True) or {}

    # Works with either a clean payload {"post_id": "..."} or a Supabase webhook {record: {...}}
    post_id = data.get("post_id")
    if not post_id and "record" in data:
        post_id = data["record"].get("id")

    if not post_id:
        return jsonify({"error": "post_id is required"}), 400

    # If the webhook provided a full record payload, prefer that over fetching again
    post = None
    if "record" in data and isinstance(data["record"], dict):
        post = data["record"]

    if post is None:
        post = get_post_core(post_id)
        if not post:
            return jsonify({"error": "post not found"}), 404

    user_id = post.get("user_id")
    if not user_id:
        return jsonify({"error": "post missing user_id"}), 400
    user_embedding = get_user_embedding(user_id)
    # Normalize and validate user embeddings; ensure a 13-dim float list
    def _validate_embedding(e):
        if e is None:
            return None
        try:
            # If it's a JSON string, parse it
            if isinstance(e, str):
                try:
                    e_parsed = json.loads(e)
                    e = e_parsed
                except Exception:
                    # try to strip brackets and split
                    cleaned = e.strip().lstrip("[").rstrip("]")
                    parts = [p.strip() for p in cleaned.split(",") if p.strip()]
                    e = parts

            arr = np.array(e, dtype=float)
            if arr.size != len(ACTIVITY_TYPES):
                return None
            return arr.tolist()
        except Exception:
            return None

    validated = _validate_embedding(user_embedding)
    if validated is None:
        # Create default embeddings for new users who haven't completed onboarding
        print(f"No valid embeddings found for user {user_id}, creating default embeddings")
        default_embedding = [0.5] * len(ACTIVITY_TYPES)  # Default neutral preferences
        set_user_embedding(user_id, default_embedding)
        user_embedding = default_embedding
    else:
        user_embedding = validated

    # Build location vector from the post's activity_tags (robust parsing)
    loc_vec = tags_to_vector(post.get("activity_tags"))

    # Normalize rating to an integer 0-5 if present
    rating = post.get("rating")  # may be None
    try:
        if rating is not None:
            # Handles strings like "5" or floats
            rating = int(float(rating))
            rating = max(0, min(5, rating))
    except Exception:
        rating = None

    # Initialize Recs with user embedding for updating preferences
    rec = Recs(user_embedding=user_embedding, init_full=False)

    # If rating not present, infer from text using sentiment analysis
    if rating is None:
        text = (post.get("caption") or post.get("experience_title") or "").strip()
        if text:
            try:
                sentiment_result = rec.sentiment_to_rating(text)
                rating = int(sentiment_result.get('rating', 3))  # Default to neutral if sentiment fails
            except Exception:
                print("Sentiment analysis failed:")
                traceback.print_exc()
                rating = 3
        else:
            rating = 3  # Default neutral rating

    # Safeguard rating bounds
    try:
        rating = int(rating)
    except Exception:
        rating = 3
    rating = max(0, min(5, rating))

    # Update user embedding based on this experience
    try:
        new_embedding = rec.update_user_embedding(loc_vec, rating)
        # Ensure we always persist a list of floats
        new_embedding_list = list(map(float, new_embedding))
        print(f"Computed new embedding for user {user_id}: {new_embedding_list}")
        resp = set_user_embedding(user_id, new_embedding_list)
        print(f"set_user_embedding response for user {user_id}: {resp}")
    except Exception:
        print(f"Failed to update embedding for user {user_id} on post {post_id}:")
        traceback.print_exc()
        return jsonify({"error": "failed to update embedding"}), 500

    return jsonify({
        "ok": True,
        "user_id": user_id,
        "post_id": post_id,
        "new_embedding": new_embedding_list,
        "supabase_response": resp
    })


# 2) When the user clicks "Book" on a specific post → recommend places near that post
@app.route("/api/recs/from-post/<post_id>", methods=["GET"])
def recs_from_post(post_id):
    post = get_post_core(post_id)
    if not post:
        return jsonify({"error": "post not found"}), 404

    user_id = post["user_id"]
    user_embedding = get_user_embedding(user_id)
    if user_embedding is None:
        # Create default embeddings for new users who haven't completed onboarding
        print(f"No embeddings found for user {user_id}, creating default embeddings")
        default_embedding = [0.5] * 13  # Default neutral preferences
        set_user_embedding(user_id, default_embedding)
        user_embedding = default_embedding

    posts_count = get_user_posts_count(user_id)

    # Build dataset around the post's hotel_address (fallback to caption/title if needed)
    location_query = (post.get("hotel_address") or post.get("caption") or post.get("experience_title") or "").strip()
    if not location_query:
        return jsonify({"error": "no location text (hotel_address/caption/experience_title) available"}), 400

    try:
        # Build location dataset around the post's location
        builder = LocationDataset(location_name=location_query)
        df, locations = builder.build(save_csv=False, include_rating_col=True)

        if df.empty:
            return jsonify({"error": "No places found near this location"}), 404

        # Initialize Recs with full dataset for recommendations
        rec = Recs(user_embedding=user_embedding, df=df, locations=locations, posts=posts_count, init_full=True)
        top_four = rec.find_top_four()  # Returns names or a DataFrame/Series

        # Convert to list format
        names = top_four.tolist() if hasattr(top_four, "tolist") else list(top_four)
        
        return jsonify({
            "top_four": names, 
            "near": location_query,
            "user_posts_count": posts_count,
            "total_places_found": len(df)
        })
    
    except Exception as e:
        return jsonify({"error": f"Failed to generate recommendations: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
