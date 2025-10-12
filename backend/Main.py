from flask import Flask, jsonify, request, send_from_directory
from location_data import LocationDataset
from get_recs import Recs
import numpy as np

app = Flask(__name__)

@app.post("/api/recs")
def recs():

    data = request.get_json(silent=True) or {}
    address = data.get("address", "").strip()
    if not address:
        return jsonify({"error": "location is required"}), 400
    user_embedding = data.get("user_embedding", np.array([]))
    posts = data.get("posts", 0)

    builder = LocationDataset(location_name=address)
    df, locations = builder.build(save_csv=True, include_rating_col=True)

    if not user_embedding:
        return jsonify({"error": "user_embedding is required"}), 400
    if not posts:
        posts = 0
    recommender = Recs(user_embedding, df, locations, posts)
    top_four = recommender.find_top_four()

    return jsonify(top_four["Name"])


@app.post("/api/post")
def update_weights():

    data = request.get_json(silent=True) or {}
    user_embedding = data.get("user_embedding", np.array([]))
    location_vector = data.get("location_vector", np.array([]))

    rating = data.get("rating", -1)

    recommender = Recs(user_embedding, init_full=False)

    if rating == -1:
        description = data.get("description", "").strip()
        if not description:
            description = data.get("title").strip()
        rating = recommender.sentiment_to_rating(description)

    if not user_embedding:
        return jsonify({"error": "username is required"}), 400

    new_user_embedding = recommender.update_user_embedding(location_vector, rating)

    return new_user_embedding

if __name__ == "__main__":
    app.run(debug=True)

