# Telegram News Scraper

Real-time Telegram channel scraper that extracts named entities, geolocates them, and stores enriched news data in Redis.

## What You Need

### Prerequisites
- Python 3.8+
- Redis server running
- Telegram API credentials
- Telegram account with news channel subscriptions

### Installation
```bash
# Install dependencies
pip install -r requirements.txt

# Download AI model
python -m spacy download en_core_web_trf
```

### Setup
Create `.env` file:
```env
API_ID=your_telegram_api_id
API_HASH=your_telegram_api_hash
REDIS_HOST=localhost
REDIS_PORT=6379
```

## How to Run

```bash
python V2_NER_Telegram.py
```

First run will ask for phone number and verification code.


### Processing Flow
1. Monitors your subscribed Telegram channels
2. Extracts locations and organizations from messages using AI
3. Gets coordinates for locations
4. Generates text embeddings for similarity search
5. Stores everything in Redis

### Data Stored in Redis
- Message text and metadata
- Extracted entities (locations, organizations)
- Geographic coordinates
- Vector embeddings for semantic search
- Timeline indexing for chronological access