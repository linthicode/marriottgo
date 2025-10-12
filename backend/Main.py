# Main.py - Travel Recommendation API
from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
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
    """Convert post.activity_tags (list[str]) -> 13-dim binary vector."""
    tags = [t.lower() for t in (tags or [])]
    return np.array([1 if t in tags else 0 for t in ACTIVITY_TYPES], dtype=float)


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

    post = get_post_core(post_id)
    if not post:
        return jsonify({"error": "post not found"}), 404

    user_id = post["user_id"]
    user_embedding = get_user_embedding(user_id)
    if user_embedding is None:
        return jsonify({"error": "no user embeddings found"}), 404

    # Build location vector from the post's activity_tags
    loc_vec = tags_to_vector(post.get("activity_tags"))
    rating = post.get("rating")  # may be None

    # Initialize Recs with user embedding for updating preferences
    rec = Recs(user_embedding=user_embedding, init_full=False)

    # If rating not present, infer from text using sentiment analysis
    if rating is None:
        text = (post.get("caption") or post.get("experience_title") or "").strip()
        if text:
            sentiment_result = rec.sentiment_to_rating(text)
            rating = sentiment_result.get('rating', 3)  # Default to neutral if sentiment fails
        else:
            rating = 3  # Default neutral rating

    # Update user embedding based on this experience
    new_embedding = rec.update_user_embedding(loc_vec, rating)
    set_user_embedding(user_id, list(map(float, new_embedding)))

    return jsonify({"ok": True, "user_id": user_id, "post_id": post_id})


# 2) When the user clicks "Book" on a specific post → recommend places near that post
@app.route("/api/recs/from-post/<post_id>", methods=["GET"])
def recs_from_post(post_id):
    post = get_post_core(post_id)
    if not post:
        return jsonify({"error": "post not found"}), 404

    user_id = post["user_id"]
    user_embedding = get_user_embedding(user_id)
    if user_embedding is None:
        return jsonify({"error": "no user embeddings found"}), 404

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
