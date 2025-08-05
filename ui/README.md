# News Heat Map UI

Interactive React frontend for visualizing global news activity on a world map with real-time updates.

## What You Need

### Prerequisites
- Node.js 16+ and npm
- API backend running (default: localhost:8000)
- Redis server with news data

### Installation
```bash
npm install
```

### Setup
Create `.env` file (optional - defaults work for local development):
```env
VITE_API_URL=http://127.0.0.1:8000
VITE_WS_URL=ws://127.0.0.1:8000
```

## How to Run

### Development
```bash
npm run dev
```
Opens at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

### User Interface
1. **Map View**: Color-coded countries based on news volume
2. **Search Bar**: Find articles by content or location
3. **Timeline**: Scrub through hours to see activity changes
4. **Sidebar**: Article details when you click a country
5. **Legend**: Activity level indicators
6. **Live Notifications**: Real-time news alerts

### Tech Stack
- **React 19** with Vite for fast development
- **Material-UI** for modern component design
- **Leaflet.js** for interactive maps
- **React-Leaflet** for React integration
- **Axios** for API communication
- **WebSockets** for real-time updates
- **Tailwind CSS** for styling