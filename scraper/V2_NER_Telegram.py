import os
import json
import redis
import json
import pycountry
import spacy
from uuid import uuid4
from dotenv import load_dotenv
from telethon import TelegramClient, events
from geopy.geocoders import Nominatim
from sentence_transformers import SentenceTransformer
import numpy as np


load_dotenv()

api_id = int(os.getenv("API_ID"))
api_hash = os.getenv("API_HASH")
session_name = "my_session"
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = int(os.getenv("REDIS_PORT", 6379))

redis_clientV2 = redis.Redis(host=redis_host, port=redis_port, decode_responses=False)
modelEmbeddings = SentenceTransformer("all-MiniLM-L6-v2")
nlp = spacy.load("en_core_web_trf")

geolocator = Nominatim(user_agent="geo_ner_mapper")

client = TelegramClient(session_name, api_id, api_hash)
        
def normalize_country(name):
    try:
        country = pycountry.countries.lookup(name)
        return country.name
    except LookupError:
        return name
    
def encode_vector(v):
    return v.astype(np.float32).tobytes()

@client.on(events.NewMessage)
async def handler(event):
    if event.is_channel and event.message.text:
        text = event.message.text
        channel = event.chat.title
        
        print(f"\n New message from: {channel}\n{text}\n")
        doc = nlp(text)

        entities = []
        for ent in doc.ents:
            if ent.label_ in ("GPE", "LOC", "ORG"):
                entities.append({
                    "text": ent.text,
                    "type": ent.label_
                })
        
        locations = []
        for ent in entities:
            if ent["type"] in ("GPE", "LOC"):
                try:
                    loc = geolocator.geocode(ent["text"], addressdetails=True, language='en')
                    if loc:
                        raw_country = loc.raw.get("address", {}).get("country", "Unknown")
                        country = normalize_country(raw_country)
                        locations.append({
                            "name": ent["text"],
                            "lat": loc.latitude,
                            "lon": loc.longitude,
                            "country": country
                        })
                except Exception as e:
                    print(f"{e}")

        unique_locations = {}
        for loc in locations:
            country = loc["country"]
            if country not in unique_locations:
                unique_locations[country] = loc

        locations = list(unique_locations.values())

        embedding_vector = modelEmbeddings.encode(text, normalize_embeddings=True)
        embedding_bytes = encode_vector(embedding_vector)

        news_id = str(uuid4())
        country = next((loc["country"] for loc in locations if "country" in loc), "Unknown")
        redis_clientV2.hset(f"newsv2:{news_id}", mapping={
            "channel": channel,
            "timestamp": int(event.message.date.timestamp()),
            "text": text,
            "entities": json.dumps(entities),
            "locations": json.dumps(locations),
            "country": country,
            "embedding": embedding_bytes
        })

        redis_clientV2.zadd("newsv2:timeline", {news_id: int(event.message.date.timestamp())})
        redis_clientV2.publish("newsv2:events", news_id)

async def main():
    print("🚀 Listening for new channel messages...")
    await client.run_until_disconnected()

client.start()
client.loop.run_until_complete(main())
