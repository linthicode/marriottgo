import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import RidgeCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import re

class Recs:
    def __init__(self, user_embedding=None, df=None, locations=None, location_vector=None, posts=None, init_full=True):

        self.__user_embedding = np.array(user_embedding) if user_embedding is not None else None

        if init_full:
            self.__df = df
            self.__locations = np.array(locations) if locations is not None else None
            self.__posts = posts
            self.__model_name = "cardiffnlp/twitter-roberta-base-sentiment"
            self.__tokenizer = AutoTokenizer.from_pretrained(self.__model_name)
            self.__model = AutoModelForSequenceClassification.from_pretrained(self.__model_name)
        else:
            # For lightweight mode, only initialize sentiment analysis
            self.__model_name = "cardiffnlp/twitter-roberta-base-sentiment"
            self.__tokenizer = AutoTokenizer.from_pretrained(self.__model_name)
            self.__model = AutoModelForSequenceClassification.from_pretrained(self.__model_name)

    def find_top_four(self):
        if self.__posts < 100:
            eps = 1e-12
            similarity_scores = []
            u = self.__user_embedding
            u_norm = np.linalg.norm(u) + eps

            for loc_vec in self.__locations:
                denom = u_norm * (np.linalg.norm(loc_vec) + eps)
                similarity = float(np.dot(u, loc_vec) / denom)
                similarity_scores.append(similarity)

            similarity_df = pd.DataFrame({
                "Name": self.__df["Name"],
                "Category": self.__df["Category"],
                "Distance (m)": self.__df["Distance (m)"],
                "Latitude": self.__df["Latitude"],
                "Longitude": self.__df["Longitude"],
                "Similarity Score": similarity_scores
            }).sort_values(by="Similarity Score", ascending=False)

            return similarity_df["Name"].head(4)  # names only

        else:
            df = self.generate_ratings(self.__df, self.__user_embedding)

            # 1) Build design matrix X
            rows = [np.hstack([self.__user_embedding, loc_vec]) for loc_vec in self.__locations]
            X = np.vstack(rows)

            # 2) Target y (needs an existing 'Rating' column)
            y = df["Rating"].to_numpy().astype(float)

            # 3) Train/val split (use self.df here)
            all_idx = np.arange(len(df))
            X_train, X_test, y_train, y_test, train_idx, test_idx = train_test_split(
                X, y, all_idx, test_size=0.2, random_state=42, shuffle=True
            )

            # 4) Ridge with scaling + CV
            alphas = np.logspace(-3, 3, 12)
            model = Pipeline([
                ("scaler", StandardScaler(with_mean=True, with_std=True)),
                ("ridge", RidgeCV(alphas=alphas, cv=5, scoring="neg_mean_absolute_error"))
            ])
            model.fit(X_train, y_train)
            predictions = np.round(model.predict(X_test), 2)

            # Top 4 within the test set
            top4_in_test = np.argsort(-predictions)[:4]
            top4_df_idx = test_idx[top4_in_test]

            top4_test = (
                df.iloc[top4_df_idx, :]
                .loc[:, ["Name", "Category", "Distance (m)", "Latitude", "Longitude"]]
                .assign(Predicted_Rating=predictions[top4_in_test])
            )

            return top4_test["Name"]  # names only

    def update_user_embedding(self, location_vector, rating):
        """
        Updates the user embedding based on their experience rating at a location.
        """
        # --- Coerce to float arrays ---
        u = np.asarray(self.__user_embedding, dtype=float)
        v = np.asarray(location_vector, dtype=float)

        if u.shape != v.shape:
            raise ValueError(f"location_vector length {v.shape[0]} must equal user_embedding length {u.shape[0]}")

        # Rating dictionary → sentiment scale
        diction = {5: 1.0, 4: 0.75, 3: 0.5, 2: -0.5, 1: -1.0, 0: 0.0}

        beta = 0.1
        sentiment_score = 0.1 + 0.9 * diction[int(rating)]  # ensure int

        # Exponential moving average update
        new_user_embedding = (1 - beta) * u + beta * sentiment_score * v

        # Keep values between 0 and 1
        new_user_embedding = np.clip(new_user_embedding, 0, 1)

        # Persist the update if you want the object to keep it
        self.__user_embedding = new_user_embedding

    def sentiment_to_rating(self, text):
        # Split text into sentences
        sentences = re.split(r'[.!?]', text)
        sentences = [s.strip() for s in sentences if s.strip()]

        all_scores = []

        for sentence in sentences:
            inputs = self.__tokenizer(sentence, return_tensors="pt", truncation=True, padding=True)
            outputs = self.__model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=1).detach().numpy()[0]

            sentiment_score = probs[2] * 1.0 + probs[1] * 0.5 + probs[0] * 0.0
            all_scores.append(sentiment_score)

        # Average over sentences
        avg_score = np.mean(all_scores)
        mapped_score = 1 + 4 * avg_score
        rating = int(round(mapped_score))
        rating = max(1, min(5, rating))

        return {
            'text': text,
            'avg_sentiment_score': float(avg_score),
            'rating': rating,
            'sentence_scores': [round(s, 3) for s in all_scores]
        }

    def generate_ratings(self, df, user_embedding):

        activity_types = [
            "natural", "museums", "theatres_and_entertainments", "urban_environment",
            "historic", "religion", "architecture", "industrial_facilities",
            "amusements", "sport", "adult", "shops", "foods"
        ]

        # Extract activity matrix
        location_matrix = df[activity_types].to_numpy(dtype=float)

        # Compute all similarities at once (vectorized)
        similarities = location_matrix @ user_embedding  # shape (num_places,)

        # Normalize across all values so max → 5.0
        similarities = (similarities - similarities.min()) / (similarities.max() - similarities.min() + 1e-6)
        ratings = np.clip((similarities ** 0.7) * 5, 0, 5)

        # Assign ratings to dataframe
        df = df.copy()
        df["Rating"] = ratings
        return df

    def get_userembeddings(self):
        return self.__user_embedding