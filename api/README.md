# News API Backend

FastAPI backend that provides REST endpoints and WebSocket connections for the UI.

### Prerequisites
- Python 3.8+
- Redis server with RediSearch module
- News data populated by the scraper component

### Installation
```bash
# Install dependencies
pip install -r requirements.txt
```

### Setup
Create `.env` file
```env
ALLOWED_ORIGINS=http://localhost:5173
REDIS_HOST=localhost
REDIS_PORT=6380
```

## How to Run

### Development
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

API will be available at `http://localhost:8000`

### API Endpoints

#### GET `/newsV2/counts_by_hour_country`
Get news activity counts by country and hour
- **Parameters**: 
  - `hours` (default: 48) - Time range in hours
  - `query` (optional) - Search query for semantic filtering
- **Returns**: Hourly country activity data for heatmap visualization

#### GET `/newsV2/country/{country_name}`
Get news articles for a specific country
- **Parameters**:
  - `country_name` - Country to filter by
  - `query` (optional) - Search query
  - `hours` (default: 48) - Time range
- **Returns**: List of articles with metadata, entities, and locations

#### GET `/newsV2/similar/{news_id}`
Find articles similar to a given article using vector similarity
- **Parameters**:
  - `news_id` - ID of the reference article
  - `limit` (default: 10) - Maximum number of results
  - `hours` (default: 48) - Time range
- **Returns**: Similar articles ranked by cosine similarity

#### WebSocket `/ws/news`
Real-time news updates via WebSocket connection
- **Sends**: New article notifications as they're processed

### Tech Stack
- **FastAPI** for high-performance async API
- **Redis/RediSearch** for vector search and data storage
- **SentenceTransformers** for semantic search embeddings
- **WebSockets** for real-time communication