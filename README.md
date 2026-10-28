# KrishiRakshak (कृषि रक्षक / ಕೃಷಿ ರಕ್ಷಕ್)
### AI-Powered Pesticide Advisory & Organic Farming Awareness Platform
**Tagline:** Protecting Crops. Empowering Farmers. Preserving Nature.  
**Secondary Tagline:** Smarter Farming, Safer Harvests.

---

## 🌾 Project Overview

**KrishiRakshak** is a full-stack agricultural advisory and decision-support platform designed to protect crops, prevent pesticide overuse and toxicity, promote certified organic alternatives, track farm treatments, and deliver weather-synchronized spraying advisories.

All data, models, databases, uploaded leaf photos, and dependencies are stored strictly inside the project root directory (`D:\Vignesh 2`).

---

## 🚀 Quick Startup Guide

### Prerequisites
- Python 3.12 (using the existing virtual environment in `.venv`)
- Node.js v24+ and npm

### 1. Start the FastAPI Backend Server
Open a terminal in the project root:
```powershell
.\.venv\Scripts\Activate.ps1
$env:PYTHONPATH = "d:\Vignesh 2"
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend runs on:* `http://127.0.0.1:8000`  
*Interactive Swagger Documentation:* `http://127.0.0.1:8000/docs`

### 2. Start the Vite React Frontend
Open a second terminal in `frontend`:
```powershell
cd frontend
$env:npm_config_cache = "D:\Vignesh 2\.cache\npm"
$env:TMP = "D:\Vignesh 2\.tmp"
$env:TEMP = "D:\Vignesh 2\.tmp"
npm run dev -- --host 127.0.0.1 --port 5173
```
*Frontend runs on:* `http://127.0.0.1:5173`

---

## 🔑 Default Demonstration Account
For instant 1-click testing:
- **Email:** `farmer@krishirakshak.in`
- **Password:** `Kisan@2026`
- **Farmer Name:** Vignesh Sharma
- **Pre-seeded Farm:** Bengaluru Rural, Karnataka (Tomato, Ragi, Chilli standing crops)

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, React Router 7, Lucide Icons |
| **Backend** | Python 3.12, FastAPI, Uvicorn, SQLAlchemy 2.0, Pydantic, Pillow |
| **Database** | SQLite stored locally at `backend/data/krishirakshak.db` |
| **Weather** | Open-Meteo High-Resolution Agrometeorological Model (No API key required) |
| **Voice & Speech** | Native Web Speech API (SpeechRecognition STT & SpeechSynthesis TTS) |
| **Caching** | Strictly project-local (`.cache/pip`, `.cache/npm`, `.tmp/`, `.logs/`) |

---

## 📋 Implemented Features (All 12 Modules Complete)

1. **Farmer Registration & Crop Profile:** Full auth with PBKDF2 HMAC SHA-256 salted hashing, JWT sessions, standing crop manager (area, growth stage, farming method).
2. **AI Crop Disease Detection:** Image upload with integrity verification (Pillow), leaf disease analysis with symptoms, causes, organic & chemical guidance, and heuristic demonstration transparency notice.
3. **Smart Pesticide Advisory:** Official Central Insecticides Board & Registration Committee (CIBRC) approved directory, label dosage, dilution ratio, toxicity band triangles (Green, Blue, Yellow, Red), PPE requirements, and Pre-Harvest Intervals (PHI).
4. **Organic Alternatives & Recipes:** Evidence-based natural formulations (Jeevamrutha, Neem Oil 10,000 ppm, Trichoderma viride, Beauveria bassiana, Pheromone traps, Dashaparni Kashayam) with step-by-step preparation recipes.
5. **Chemical vs Organic Comparison Tool:** Side-by-side decision matrix comparing input cost, speed of action, operator safety, environmental footprint, waiting periods, and suitability.
6. **Weather & Spraying Advisory:** Live district meteorological forecasts with automated alerts against rain wash-off, high wind drift (>15 km/h), and extreme heat evaporation.
7. **Location-Based Regional Advisory:** Agro-climatic zone recommendations across Kharif, Rabi, and Zaid seasons with regional KVK contact directories.
8. **AI Farming Assistant Chatbot:** Grounded agricultural chatbot providing instant agronomy guidance, source citations, and suggested questions.
9. **Multilingual & Voice Support:** Seamless translation across English, Kannada (`ಕನ್ನಡ`), and Hindi (`हिंदी`) with integrated microphone speech-to-text and voice read-aloud buttons.
10. **Farming Activity Tracker:** Digital logbook recording sprayings, organic treatments, product quantities, input expenditures, treatment timelines, and follow-up reminders.
11. **Organic Farming Awareness Hub:** Educational technical guides covering aerobic composting, vermicomposting (*Eisenia fetida*), soil organic carbon, and Integrated Pest Management (IPM).
12. **Farmer Dashboard & Notifications:** Unified dashboard with standing crops, weather overview, upcoming reminders, in-app pest alerts, and quick actions.

---

## 📁 Project Directory Structure
```text
D:\Vignesh 2/
├── .venv/                         # Reused existing Python 3.12 virtual environment
├── .cache/                        # Project-local package caches
│   ├── pip/
│   └── npm/
├── .tmp/                          # Project-local temporary files
├── .logs/                         # Project-local logs
├── backend/
│   ├── app/
│   │   ├── api/                   # All 12 modular REST API routers
│   │   ├── core/                  # Security, config, database engine
│   │   ├── models/                # SQLAlchemy database models
│   │   ├── schemas/               # Pydantic schemas
│   │   ├── services/              # Agronomic logic, Open-Meteo, seed data, vision AI
│   │   └── main.py                # FastAPI entrypoint with startup lifespans
│   ├── data/
│   │   └── krishirakshak.db       # Project-local SQLite database
│   ├── uploads/                   # Uploaded leaf diagnostic photos
│   ├── tests/
│   │   └── test_api.py            # Automated backend verification test suite
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/            # Navbar, Footer, ToxicityBadge, VoiceButton, SprayingStatusBadge
│   │   ├── context/               # AuthContext, LanguageContext
│   │   ├── pages/                 # 12 full feature pages
│   │   ├── services/api.ts        # Frontend API client
│   │   └── types/                 # TypeScript definitions
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```
