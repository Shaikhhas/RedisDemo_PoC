import os
import redis
import json
import time
import asyncio
import redis.asyncio as aioredis
from fastapi import FastAPI,WebSocket
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
from apiUtils import encode_vector, process_document_for_hourly_counts, countryCheck

load_dotenv()

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS")
REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = os.getenv("REDIS_PORT")
redis_clientV2 = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=False)
redis_asyncio = aioredis.from_url(f"redis://{REDIS_HOST}:{REDIS_PORT}", decode_responses=False)
modelEmbeddings = SentenceTransformer("all-MiniLM-L6-v2")

similarityParam = 0.4

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/news")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    pubsub = redis_asyncio.pubsub()
    await pubsub.subscribe("newsv2:events")

    try:
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
            if message:
                news_id = message["data"].decode()
                doc_data = redis_clientV2.hgetall(f"newsv2:{news_id}")
                if doc_data:
                    decoded_data = {}
                    for key, value in doc_data.items():
                        if isinstance(key, bytes):
                            key = key.decode('utf-8')
                        if key != 'embedding':
                            value = value.decode('utf-8')
                        decoded_data[key] = value
                    
                    response = {
                        "id": decoded_data.get("id", news_id),
                        "channel": decoded_data.get("channel", ""),
                        "timestamp": decoded_data.get("timestamp", ""),
                        "text": decoded_data.get("text", "")
                    }
                    await websocket.send_json(response)
                else:
                    await websocket.send_json({"new_news_id": news_id})
            await asyncio.sleep(0.1)
    except Exception as e:
        print("WebSocket closed:", e)
    finally:
        await pubsub.unsubscribe("newsv2:events")
        await pubsub.close()
        await websocket.close()


def fallback_search(past_ts, now_ts, hourly_data):
    
    news_ids = redis_clientV2.zrangebyscore("newsv2:timeline", past_ts, now_ts)
    
    for news_id in news_ids:
        if isinstance(news_id, bytes):
            news_id = news_id.decode('utf-8')
            
        doc_data = redis_clientV2.hgetall(f"newsv2:{news_id}")
        if not doc_data:
            continue
        
        decoded_data = {}
        for key, value in doc_data.items():
            if isinstance(key, bytes):
                key = key.decode('utf-8')
            if key != 'embedding':
                value = value.decode('utf-8')
            decoded_data[key] = value
        
        process_document_for_hourly_counts(decoded_data, hourly_data)

def fallback_search_by_country(past_ts, now_ts, country_name, matching_articles):
    
    news_ids = redis_clientV2.zrangebyscore("newsv2:timeline", past_ts, now_ts)
    
    for news_id in news_ids:
        news_id = news_id.decode('utf-8')
        doc_data = redis_clientV2.hgetall(f"newsv2:{news_id}")

        decoded_data = {}
        for key, value in doc_data.items():
            key = key.decode('utf-8')
            if key != 'embedding':
                value = value.decode('utf-8')
            decoded_data[key] = value
        
        
        if countryCheck(decoded_data, country_name):
            filtered_article = {
                "id": decoded_data.get("id", news_id),
                "channel": decoded_data.get("channel", ""),
                "timestamp": decoded_data.get("timestamp", ""),
                "text": decoded_data.get("text", "")
            }
            matching_articles.append(filtered_article)

@app.get("/newsV2/counts_by_hour_country")
def counts_by_hour_country(hours = 48, query = None):
    now_ts = int(time.time())
    past_ts = now_ts - hours * 3600
    
    hourly_data = {}
    if query:
        try:
            query_embedding = modelEmbeddings.encode(query, normalize_embeddings=True)
            query_bytes = encode_vector(query_embedding)
            
            search_query = f"@timestamp:[{past_ts} {now_ts}]=>[KNN 2000 @embedding $query_vec]"
            
            search_result = redis_clientV2.execute_command(
                "FT.SEARCH",
                "newsv2_index",
                search_query,
                "PARAMS", "2", "query_vec", query_bytes,
                "WITHSCORES",
                "RETURN", "2", "timestamp", "locations",
                "SORTBY", "__embedding_score", "ASC",
                "DIALECT", "2"
            )
            
            
            for i in range(1, len(search_result), 3):
                score = float(search_result[i + 1].decode('utf-8'))
                if score > similarityParam:
                    continue
                
                field_data = search_result[i + 2]
                parsed_data = {}
                
                for j in range(0, len(field_data), 2):
                    field_name = field_data[j].decode('utf-8')
                    field_value = field_data[j + 1]
                    if isinstance(field_value, bytes):
                        field_value = field_value.decode('utf-8')
                    parsed_data[field_name] = field_value
                
                process_document_for_hourly_counts(parsed_data, hourly_data)
                    
        except Exception as e:
            print(f"Vector search failed: {e}")
            
    else:
        fallback_search(past_ts, now_ts, hourly_data)

    result = [
        {"hour": hour, "countries": country_counts}
        for hour, country_counts in hourly_data.items()
    ]
    
    return result

@app.get("/newsV2/country/{country_name}")
def get_newsv2_by_country(country_name, query = None, hours = 48):
    now_ts = int(time.time())
    past_ts = now_ts - hours * 3600
    
    matching_articles = []
    
    if query:
        try:
            query_embedding = modelEmbeddings.encode(query, normalize_embeddings=True)
            query_bytes = encode_vector(query_embedding)
            
            
            search_query = f"@timestamp:[{past_ts} {now_ts}]=>[KNN 2000 @embedding $query_vec]"
            
            search_result = redis_clientV2.execute_command(
                "FT.SEARCH",
                "newsv2_index",
                search_query,
                "PARAMS", "2", "query_vec", query_bytes,
                "WITHSCORES",
                "RETURN", "7", "timestamp", "locations", "channel", "text", "entities", "id", "country",
                "SORTBY", "__embedding_score", "ASC",
                "DIALECT", "2"
            )
            
            for i in range(1, len(search_result), 3):
                doc_key = search_result[i].decode('utf-8')
                score = float(search_result[i + 1].decode('utf-8'))
                
                if score > similarityParam:
                    continue
                
                field_data = search_result[i + 2]
                parsed_data = {}
                
                for j in range(0, len(field_data), 2):
                    field_name = field_data[j].decode('utf-8')
                    field_value = field_data[j + 1]
                    parsed_data[field_name] = field_value
                

                if not countryCheck(parsed_data,country_name):
                    continue
                    
                filtered_article = {
                    "id": parsed_data.get("id", doc_key.split(":")[-1] if ":" in doc_key else ""),
                    "channel": parsed_data.get("channel", ""),
                    "timestamp": parsed_data.get("timestamp", ""),
                    "text": parsed_data.get("text", ""),
                }
                matching_articles.append(filtered_article)
        except Exception as e:
            print(f"Vector search failed: {e}")
    else:
        
        fallback_search_by_country(past_ts, now_ts, country_name, matching_articles)
    return matching_articles

@app.get("/newsV2/similar/{news_id}")
def get_similar_news(news_id, limit = 10, hours = 48):
    try:
        
        doc_data = redis_clientV2.hgetall(f"newsv2:{news_id}")
            
        now_ts = int(time.time())
        past_ts = now_ts - hours * 3600
        
        search_query = f"@timestamp:[{past_ts} {now_ts}]=>[KNN {limit} @embedding $query_vec]"
        
        search_result = redis_clientV2.execute_command(
            "FT.SEARCH",
            "newsv2_index",
            search_query,
            "PARAMS", "2", "query_vec", doc_data[b'embedding'],
            "WITHSCORES",  
            "RETURN", "8", "timestamp", "locations", "channel", "text", "entities", "id", "country", "score",
            "SORTBY", "__embedding_score", "ASC",
            "DIALECT", "2"
        )
        
        similar_articles = []
        
        for i in range(1, len(search_result), 3):
            doc_key = search_result[i].decode('utf-8')
            
            if doc_key == f"newsv2:{news_id}":
                continue
            
            score = float(search_result[i + 1])
            if score > similarityParam:
                continue
            
            field_data = search_result[i + 2]
            parsed_data = {}
            
            for j in range(0, len(field_data), 2):
                field_name = field_data[j].decode('utf-8')
                field_value = field_data[j + 1]
                parsed_data[field_name] = field_value
            
            article = {
                "id": doc_key.split(":")[-1],
                "channel": parsed_data.get("channel", ""),
                "timestamp": parsed_data.get("timestamp", ""),
                "text": parsed_data.get("text", ""),
            }
            
            similar_articles.append(article)
        
        return similar_articles
        
    except Exception as e:
        return {"error": f"Failed to find similar articles: {str(e)}"}

