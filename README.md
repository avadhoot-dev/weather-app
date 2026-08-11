# 🌦️ SkyCast — Weather Application

<p align="center">
  <strong>A modern, responsive weather application built with Vanilla JavaScript, WeatherAPI, and Geoapify.</strong>
</p>

<p align="center">
  Search locations, view current weather conditions, explore hourly forecasts, check upcoming weather, and view the selected location on an interactive map.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/WeatherAPI-0096FF?style=for-the-badge" alt="WeatherAPI">
  <img src="https://img.shields.io/badge/Geoapify-1E88E5?style=for-the-badge" alt="Geoapify">
  <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
</p>

---

## 📸 Preview

<p align="center">
  <img src="assets/weather-app-preview.png" alt="SkyCast Weather Application Preview" width="100%">
</p>

---

## 🚀 Live Demo

**SkyCast:** https://skycast-by-avadhoot.vercel.app/

---

## 📌 Overview

SkyCast is a web-based weather application that combines weather information with location-based services to provide a detailed weather dashboard.

The application uses **WeatherAPI** for weather and forecast information and **Geoapify** for location/geocoding functionality. The interface presents current weather, detailed weather metrics, hourly forecasts, future forecasts, and an interactive map in one dashboard.

The project is built using **HTML, CSS, and Vanilla JavaScript (ES6+)**.

---

## ✨ Features

### 🌡️ Current Weather
- Current temperature
- Weather condition
- Dynamic weather icon
- Feels-like temperature
- Today's high and low temperature
- Current date and time
- Selected location

### 📊 Weather Metrics
- Wind speed
- Humidity
- UV Index
- Atmospheric pressure
- Visibility
- Rain probability
- Cloud cover
- Dew point

### 🕐 Hourly Forecast
- Current weather
- Upcoming hourly temperatures
- Weather conditions
- Dynamic weather icons
- Precipitation probability
- Horizontally scrollable forecast cards

### 📅 Future Forecast
- Multi-day forecast
- Daily temperature
- Weather condition
- Dynamic weather icons
- Precipitation information

### 🗺️ Location & Map
- Location search
- Location/geocoding support through Geoapify
- Selected location displayed on an interactive map
- Zoom controls
- Location marker
- Leaflet-based map rendering
- OpenStreetMap map tiles

### ⚙️ User Interface
- Responsive dashboard
- Dark weather-dashboard design
- Loading state during API requests
- Error handling
- Dynamic DOM updates
- Celsius temperature display

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Application structure |
| **CSS3** | Styling, layout, and responsive design |
| **JavaScript ES6+** | Application logic, API integration, and DOM manipulation |
| **WeatherAPI** | Weather and forecast data |
| **Geoapify** | Location and geocoding services |
| **Leaflet** | Interactive map |
| **OpenStreetMap** | Map data/tiles |
| **Git & GitHub** | Version control |
| **Vercel** | Deployment |

---

## 🔗 APIs, Libraries & External Services

### WeatherAPI

WeatherAPI provides the weather and forecast data used by SkyCast, including current weather and forecast information.

**Official website:** https://www.weatherapi.com/

### Geoapify

Geoapify provides location-based services used by SkyCast for location/geocoding functionality. Its platform provides APIs for geocoding, reverse geocoding, maps, places, and other location-related services.

**Official website:** https://www.geoapify.com/

**API documentation:** https://apidocs.geoapify.com/

### Leaflet

Leaflet is used to create and control the interactive map.

**Official website:** https://leafletjs.com/

### OpenStreetMap

OpenStreetMap provides the map data displayed through Leaflet.

**Official website:** https://www.openstreetmap.org/

---

## 🔐 API Keys & Environment Variables

SkyCast uses API keys for its external services.

API keys should **not** be committed directly to GitHub.

Example:

```env
WEATHER_API_KEY=your_weatherapi_key
GEOAPIFY_API_KEY=your_geoapify_key
```

> Use the exact environment-variable names required by the current application code. The names above are examples for documentation purposes.

For production deployment, configure the required environment variables through the Vercel project settings.

---

## 📦 Running the Project Locally

### Prerequisites

Install:

- Git
- Node.js
- A modern web browser
- WeatherAPI API key
- Geoapify API key
- Vercel CLI if using `vercel dev`

### 1. Clone the repository

```bash
git clone https://github.com/avadhoot-dev/weather-app.git
cd weather-app
```

### 2. Configure API keys

Configure the API keys using the environment-variable method used by the project.

Example:

```env
WEATHER_API_KEY=your_weatherapi_key
GEOAPIFY_API_KEY=your_geoapify_key
```

### 3. Start the local development server

If using Vercel CLI:

```bash
vercel dev
```

Then open:

```text
http://localhost:3000
```

---

## 🧠 Application Flow

```text
                    User
                     │
                     ▼
              Search Location
                     │
                     ▼
              JavaScript Logic
                │          │
                │          │
                ▼          ▼
          Geoapify      WeatherAPI
          Location      Weather Data
           Data             │
                │            │
                └─────┬──────┘
                      ▼
                Data Processing
                      │
                      ▼
                 DOM Updates
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
 Current Weather  Forecasts       Map
        │             │             │
        └─────────────┴─────────────┘
                      ▼
                SkyCast Dashboard
```

---

## 📁 Repository Structure

The repository currently contains an `old/` directory containing previous project files kept for reference.

The main application structure can be represented as:

```text
weather-app/
│
├── old/
│
├── assets/
│   └── weather-app-preview.png
│
├── index.html
├── style.css
├── script.js
├── .gitignore
└── README.md
```

> Keep the actual filenames and directories used by the project. This section can be updated if the final structure changes.

---

## 🚢 Deployment

SkyCast is deployed using **Vercel** and connected to the GitHub repository.

Typical workflow:

```text
Local Development
       │
       ▼
   Git Commit
       │
       ▼
    Git Push
       │
       ▼
 GitHub Repository
       │
       ▼
 Vercel Deployment
       │
       ▼
 Production Website
```

**Live application:**  
https://skycast-by-avadhoot.vercel.app/

**GitHub repository:**  
https://github.com/avadhoot-dev/weather-app

---

## 🔄 Current Data Behaviour

Weather data is fetched when the application loads and when a user searches for a location.

The current version does not continuously refresh weather data while the page remains open.

Automatic periodic weather refresh is planned as a future improvement.

---

## 🗺️ Map Attribution

SkyCast uses **Leaflet** for interactive map functionality and **OpenStreetMap** map data.

Map attribution is displayed within the map interface as required by the respective services.

---

## 🔮 Future Improvements

- [ ] Automatic weather data refresh
- [ ] AI-powered weather analysis
- [ ] More detailed weather statistics

---

## 📚 What This Project Demonstrates

This project provides practical experience with:

- REST API integration
- HTTP requests
- `fetch()`
- Asynchronous JavaScript
- JSON data processing
- DOM manipulation
- Dynamic UI rendering
- Loading and error states
- Location and geocoding APIs
- Third-party JavaScript libraries
- Interactive maps
- API-driven frontend applications
- Environment variables
- Git and GitHub
- Vercel deployment

---

## 👨‍💻 Author

**Avadhoot Shriwant**

GitHub: https://github.com/avadhoot-dev
