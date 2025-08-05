# Real-Time Global News Intelligence Platform

This project delivers a single, interactive, map-based view of political activity across the globe, dynamically updated from multiple real-time sources.

Each article is enriched with:
- Named Entity Recognition (NER)
- Geo-tagging
- Vector-based similarity search

---

## Project Objective

Provide a global view of news activity and updates into a searchable, interactive map. News is streamed from multiple sources from Telegram, enriched with NLP, and clustered using vector embeddings.

---

## Architecture Overview

### Phase 1: Proof of Concept
- Scheduled RSS feed ingestion
- Per-source normalization and parsing
- NER and geo-tagging using spaCy
- Embedding generation with all-MiniLM-L6-v2
- FastAPI backend
- React + Leaflet.js frontend
- Activity heatmap based on cumulative 24-hour article counts

### Phase 2: Real-Time Pipeline
- Switched to real-time ingestion via Telegram using Telethon
- Upgraded NLP to spacy/en_core_web_trf
- Redis used to store:
  - News articles (HSET)
  - Timelines (ZADD)
- Real-time frontend updates via Redis Pub/Sub and WebSockets

### Phase 3–5: Optimization and Feature Expansion
- Vector similarity search using Redis KNN
- Clustering of similar articles based on embeddings
- Time-weighted activity scoring
- Hourly article timelines
- Frontend performance and layout improvements

---

## Features

- Real-time map of political activity
- Semantic search using Redis FT.SEARCH
- Redis-powered vector similarity lookup
- Real-time frontend updates via WebSockets
- Lightweight, self-hostable architecture

---

## Tech Stack

- Redis, RedisSearch
- FastAPI + Uvicorn
- React + Vite
- Leaflet.js + Material UI
- spaCy (en_core_web_trf)
- HuggingFace Transformers (all-MiniLM-L6-v2)
- Telethon


---

## Demo

![Demo](./assets/RedisDemo_PoC.gif)

---

## Submission Info

Submitted for the [Redis AI Challenge 2025](https://dev.to/challenges/redis-2025-07-23)

---

## Getting Started

- [`scraper/README.md`](./scraper/README.md)
- [`api/README.md`](./api/README.md)
- [`ui/README.md`](./ui/README.md)

---

## License

MIT — feel free to build on top.