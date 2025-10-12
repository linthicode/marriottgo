from location_data import LocationDataset
from get_recs import Recs

user_embedding = [
  0.25,
  0,
  0.5,
  0,
  0,
  0,
  0.5,
  0,
  1,
  1,
  0,
  0.25,
  1
]
posts = 10
marriot_address = "1401 Whippany, New Jersey, 07981, USA"

builder = LocationDataset(location_name=marriot_address)

df, locations= builder.build(save_csv=True, include_rating_col=True)

rec = Recs(user_embedding=user_embedding, df=df, locations=locations, posts=posts, init_full=True)
top_four = rec.find_top_four()

print(top_four)

# When a post is created, update the user's embeddings
print(f"Before update: {rec.get_userembeddings()}")
rec = Recs(user_embedding=user_embedding, init_full=False)
rec.update_user_embedding(location_vector=[1,0,1,0,0,0,1,0,1,1,0,0,1], rating=5)


print(f"After update: {rec.get_userembeddings()}")
