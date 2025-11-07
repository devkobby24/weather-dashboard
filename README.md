# Weather Dashboard

A full-stack weather application that provides real-time weather data and forecasts using the OpenWeather API.

## 📋 Project Structure

```
weather-dashboard/
├── backend/        # Express.js API server
├── frontend/       # Vue 3 + TypeScript UI
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v20.19.0+ or v22.12.0+
- OpenWeather API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Add your OPENWEATHER_API_KEY
npm run dev          # Runs on http://localhost:5000
```

**Available Scripts:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript
- `npm start` - Run production build
- `npm test` - Run tests with coverage

### Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

**Available Scripts:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint and fix code
- `npm run format` - Format code with Prettier

## 🏗️ Tech Stack

**Backend:**
- Express.js 5
- TypeScript
- Axios (HTTP requests)
- Jest (testing)

**Frontend:**
- Vue 3
- TypeScript
- Vite
- ESLint + Prettier

## 📡 API Endpoints

### Get Weather Data
```
GET /api/weather/:city
```

**Response:**
```json
{
  "city": "Accra",
  "temperature": 28.19,
  "weather": "few clouds",
  "forecast": [
    {
      "time": "2025-11-06 18:00:00",
      "temp": 28.19,
      "description": "few clouds"
    }
  ]
}
```

## ✨ Features

- 🔍 Search weather by city name
- 🌡️ Real-time temperature display
- 📊 5-item 3-hour forecast
- 📱 Responsive design
- ✅ Input validation (letters & spaces only)
- 🧪 Unit tests with coverage reporting

## 🔧 Environment Variables

**Backend (.env):**
```
OPENWEATHER_API_KEY=your_api_key_here
PORT=5000
```

## 🧪 Testing

```bash
cd backend
npm test
```

Generates coverage report in `coverage/lcov-report/index.html`

## 📝 Notes

- Frontend proxies requests through `BASE_URL` environment variable
- CORS is enabled for cross-origin requests
- API uses metric units (°C) by default
