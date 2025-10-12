import time
import requests
import numpy as np
import pandas as pd
from typing import List, Tuple, Optional

class LocationDataset:
    """
    Build an encoded places dataset (and activity matrix) around a given address
    using OpenTripMap + Nominatim.

    Example:
        builder = OpenTripLocationDataset(
            location_name="1401 Whippany, New Jersey, 07981, USA"
        )
        df, locations = builder.build(save_csv=True)
    """

    DEFAULT_ACTIVITY_TYPES = [
        "natural","museums","theatres_and_entertainments","urban_environment",
        "historic","religion","architecture","industrial_facilities",
        "amusements","sport","adult","shops","foods"
    ]

    def __init__(
        self,
        location_name: str,
        radius: int = 15000,
        limit: int = 100,
        api_key: str = "5ae2e3f221c38a28845f05b624b6a61c33932f14857a6a4721582e56",
        desired_rates: Tuple[str, ...] = ("2", "2h", "3", "3h"),
        activity_types: Optional[List[str]] = None,
        user_agent: str = "CodeFest/1.0 (sabbuprathik06@gmail.com)",
        polite_sleep: float = 0.4,
        csv_path: str = "places_near_location_encoded.csv"
    ):
        self.__location_name = location_name
        self.__radius = radius
        self.__limit = limit
        self.__api_key = api_key
        self.__desired_rates = desired_rates
        self.__activity_types = activity_types or self.DEFAULT_ACTIVITY_TYPES
        self.__user_agent = user_agent
        self.__polite_sleep = polite_sleep
        self.__csv_path = csv_path

        self._lat = None
        self._lon = None

    # ------------------------------ public API ------------------------------

    def build(self, save_csv: bool = True, include_rating_col: bool = True) -> Tuple[pd.DataFrame, np.ndarray]:
        """
        Returns:
            df_encoded: DataFrame with place metadata + one-hot activity columns (+ optional Rating column)
            locations:  numpy array with only the activity columns (for similarity/ML), shape (n_samples, n_activities)
        """
        self._lat, self._lon = self._get_coordinates(self.__location_name)
        print(f"Searching near: {self.__location_name} ({self._lat:.4f}, {self._lon:.4f})")

        raw_places = self._fetch_places_by_rates()
        df = self._to_dataframe(raw_places)

        if df.empty:
            print("No places found.")
            # return empty structures with the right columns
            empty_df = pd.DataFrame(columns=["xid","Name","Category","rate","Distance (m)","Latitude","Longitude"] + self.__activity_types + (["Rating"] if include_rating_col else []))
            return empty_df, np.empty((0, len(self.__activity_types)), dtype=float)

        df_encoded = self._encode_activity_columns(df)

        # (optional) drop unnamed
        df_encoded = df_encoded[df_encoded["Name"].str.strip() != ""]

        if include_rating_col and "Rating" not in df_encoded.columns:
            df_encoded["Rating"] = np.nan

        if save_csv:
            df_encoded.to_csv(self.__csv_path, index=False)
            print(f"Saved {len(df_encoded)} places to {self.__csv_path}")

        # build locations matrix from activity columns
        locations = np.array(df_encoded[self.__activity_types].to_numpy(dtype=float))
        return df_encoded, locations

    # --------------------------- internal helpers ---------------------------

    def _get_coordinates(self, name: str) -> Tuple[float, float]:
        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": name, "format": "json"}
        headers = {"User-Agent": self.__user_agent}
        r = requests.get(url, params=params, headers=headers, timeout=20)
        r.raise_for_status()
        data = r.json()
        if not data:
            raise ValueError(f"Could not find coordinates for: {name}")
        return float(data[0]["lat"]), float(data[0]["lon"])

    def _fetch_places_by_rates(self) -> List[dict]:
        base_url = "https://api.opentripmap.com/0.1/en/places/radius"
        seen = set()
        rows = []

        for rate in self.__desired_rates:
            params = {
                "radius": self.__radius,
                "lon": self._lon,
                "lat": self._lat,
                "rate": rate,
                "limit": self.__limit,
                "apikey": self.__api_key,
                "format": "json",
            }
            resp = requests.get(base_url, params=params, timeout=30)
            resp.raise_for_status()
            data = resp.json()

            if not isinstance(data, list):
                print(f"Unexpected API response for rate={rate}: {str(data)[:200]}")
                time.sleep(self.__polite_sleep)
                continue

            for p in data:
                xid = p.get("xid")
                name = (p.get("name") or "").strip()
                point = p.get("point") or {}
                latp, lonp = point.get("lat"), point.get("lon")
                kinds = p.get("kinds", "")

                if not xid or xid in seen or not name or latp is None or lonp is None:
                    continue

                seen.add(xid)
                rows.append({
                    "xid": xid,
                    "Name": name,
                    "Category": kinds,
                    "rate": p.get("rate", ""),
                    "Distance (m)": round(p.get("dist", 0) or 0, 2),
                    "Latitude": latp,
                    "Longitude": lonp
                })

            time.sleep(self.__polite_sleep)  # be polite to their API
        return rows

    def _to_dataframe(self, rows: List[dict]) -> pd.DataFrame:
        return pd.DataFrame(rows)

    def _encode_activity_columns(self, df: pd.DataFrame) -> pd.DataFrame:
        def encode_activities(kinds_str: str) -> List[int]:
            ks = (kinds_str or "").lower()
            return [1 if tag in ks else 0 for tag in self.__activity_types]

        activity_vectors = df["Category"].apply(encode_activities)
        activity_df = pd.DataFrame(activity_vectors.tolist(), columns=self.__activity_types)
        df_encoded = pd.concat([df.reset_index(drop=True), activity_df], axis=1)
        return df_encoded
