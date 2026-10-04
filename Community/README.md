# APSMART – Bus Route Intelligence
> **"From Passenger Data to Smarter Bus Routes."**  
> **Problem Statement ID:** PS050 | **Title:** Bus Route Utilisation Survey for City Transport | **Domain:** Smart Cities  

---

## 🚌 Overview

**APSMART** is a production-quality, smart city public-transport analytics platform designed for city bus transportation networks (APSRTC Visakhapatnam domain context). 

Rather than serving merely as a passenger bus tracking app, **APSMART** implements a complete data pipeline that turns passenger movement evidence into actionable transport planning recommendations:

```
PASSENGER DATA
        ↓
BOARDING / ALIGHTING ANALYSIS
        ↓
ROUTE UTILISATION ANALYSIS
        ↓
DEMAND & UNDER-SERVED AREA DETECTION
        ↓
MAP VISUALIZATION (GIS / LEAFLET)
        ↓
ROUTE CHANGE RECOMMENDATIONS
        ↓
ADMIN / TRANSPORT AUTHORITY REPORT
```

---

## 🌟 Key Roles & Features

### 1. 🚶 PASSENGER
- **Bus & Route Search:** Find buses from Point A → Point B with filters (Ordinary, Metro Express, Metro Deluxe, Palle Velugu).
- **Bus Details & Real-Time Timeline:** View bus status, complete stop sequence, running delays, occupancy status, and upcoming stop ETAs.
- **Alternative Bus Suggestions:** Recommends alternative buses if selected bus is delayed (>10 min) or full.
- **Live Simulated GPS Tracking:** Interactive OpenStreetMap tracking bus movements, speed, and direction.
- **Nearby Bus Stops:** Locates surrounding bus stops within 2.5 km with shelter and accessibility filters.
- **Saved Routes:** Bookmark frequent travel corridors for one-click status checks.
- **Passenger Issue Reporting:** Submit delay or overcrowding reports directly to transport planners.

### 2. 📋 FIELD SURVEYOR
- **Mobile-Friendly Entry Portal:** Ergonomic interface designed for enumerators conducting field surveys on mobile phones.
- **Fast Entry Workflow:** Quick selection of Route, Bus Registration No., Bus Type, Direction (UP/DOWN), Date, and Time.
- **Boarding / Alighting Logger:** Record boarding stop, alighting stop, passenger count, category (General, Student, Senior Citizen, Women/Child), and automatic GPS location capture.
- **Survey Log Table:** View and verify past submitted survey records.

### 3. 📊 TRANSPORT ADMIN / AUTHORITY
- **Command Center Dashboard:** KPI overview cards (Total Routes, Active Buses, Daily Passengers, Under-Served Zones) and interactive Recharts visualizations (Route Utilisation, Hourly Demand Curve, Boarding vs Alighting, Stop Turnover).
- **Deterministic Route Utilisation Analysis:** Route-by-route carrying-capacity score calculations ($Utilisation = \frac{\text{Passenger Demand}}{\text{Available Carrying Capacity}} \times 100$) with configurable high/low demand thresholds.
- **Under-Served Area Detection:** Automatically flags zones with measurable parameters: unmet peak demand (pax/hr), distance to stop (km), and bus headway (min) with explicit diagnostic reasons.
- **Route Recommendation Engine:** Data-driven recommendations (e.g., "Add 3 Peak-Hour Buses", "Introduce Feeder Route 45F", "Increase Frequency") with confidence % and one-click **Approve / Reject** controls.
- **Route Comparison Tool:** Side-by-side comparison of 2 to 4 routes across passengers, frequency, capacity, and demand/km.
- **GIS Interactive Map Dashboard:** Layered OpenStreetMap controls (Routes, Stops, Boarding Demand, Under-Served Circles, Live Bus Markers).
- **Executive Report Generation:** Export full PDF reports (via jsPDF) and CSV data tables (via PapaParse).

---

## 🛠️ Technology Stack

- **Frontend:** React (TypeScript) + Vite + Tailwind CSS + Lucide React + Recharts + Leaflet / React-Leaflet
- **Backend:** Node.js + Express (TypeScript)
- **Database:** SQLite + Prisma ORM out-of-the-box (Zero external DB installation required)
- **Authentication:** JWT (JSON Web Tokens) + Bcrypt password hashing
- **Reports & Export:** jsPDF + jsPDF-AutoTable (PDF) + PapaParse (CSV)

---

## 📁 Directory Structure

```
APSMART/
 ├── package.json                   # Root package runner
 ├── README.md                      # Comprehensive documentation
 ├── server/                        # Express Backend API
 │    ├── package.json
 │    ├── tsconfig.json
 │    ├── prisma/
 │    │    └── schema.prisma        # Database Relational Schema
 │    └── src/
 │         ├── index.ts             # Express server entry point
 │         ├── config/              # Prisma DB Client instance
 │         ├── middleware/          # JWT Auth & Role Authorization
 │         ├── data/                # Seed Data (10 routes, 32 stops, 10 buses, 13k+ pax records)
 │         ├── analytics/           # Utilisation, Underserved & Recommendation engines
 │         ├── routes/              # REST API Endpoints
 │         └── utils/               # PDF & Report Generator helpers
 └── client/                        # React Vite Frontend
      ├── package.json
      ├── tsconfig.json
      ├── vite.config.ts
      ├── tailwind.config.js
      ├── index.html
      └── src/
           ├── main.tsx
           ├── App.tsx              # Main Application router & tab state
           ├── types/               # TypeScript data definitions
           ├── context/             # AuthContext (Role switching & login)
           ├── services/            # Axios API Service Client
           ├── components/
           │    ├── navbar/         # Header Navbar with Quick Role Toggle
           │    ├── footer/         # Footer
           │    └── maps/           # Interactive Leaflet GIS Map Component
           └── pages/               # All 16 Application Screens & Portals
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Transport Admin** | `admin@apsmart.com` | `password123` | Full Dashboard, Analytics, Under-Served, Recommendations, Compare, Reports |
| **Field Surveyor** | `surveyor@apsmart.com` | `password123` | Record Boarding/Alighting Survey & View Survey Log |
| **Passenger** | `passenger@apsmart.com` | `password123` | Search Buses, Live Tracking, Nearby Stops, Saved Routes |

> **Note:** The top navigation bar includes a **Quick Role Switcher** (`Passenger` | `Surveyor` | `Admin`) for effortless demonstration during presentations!

---

## 🚀 Quick Setup & Run Instructions

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
From the root directory:
```bash
# Install server & client dependencies
npm run install:all
```

### 3. Database Setup & Seeding
```bash
# Push Prisma SQLite schema and populate demo data (13,800+ passenger records)
npm run db:setup
```

### 4. Running Development Servers
```bash
# Run backend server (Port 5000) and client app (Port 3000) concurrently:
npm run dev
```

Or run them in separate terminals:
```bash
# Terminal 1 (Server):
cd server && npm run dev

# Terminal 2 (Client):
cd client && npm run dev
```

Access the application in your web browser at: **`http://localhost:3000`**

### 5. Production Build
```bash
# Compile TypeScript and build production artifacts
npm run build
```

---

## 📐 Analytics Logic & Formulas

### 1. Route Utilisation Calculation
```math
\text{Utilisation Score (\%)} = \left( \frac{\text{Total Passenger Demand}}{\text{Available Carrying Capacity}} \right) \times 100
```
- **Carrying Capacity** = $\text{Active Buses Count} \times \text{Trips per Bus per Day (6)} \times \text{Bus Seat Capacity (55)}$
- **Demand Categories:**
  - **HIGH DEMAND:** Score $\ge 80\%$ (Over-capacity peak hour crowding)
  - **MEDIUM DEMAND:** $45\% \le \text{Score} < 80\%$ (Balanced carrying load)
  - **LOW DEMAND:** Score $< 45\%$ (Under-utilized fleet capacity)

### 2. Under-Served Area Classification Criteria
An area is classified as **Under-Served** based on deterministic thresholds:
1. **Distance Gap:** Distance to nearest bus stop $> 1.2\text{ km}$
2. **Frequency Gap:** Average bus headway $> 20\text{ minutes}$
3. **Unmet Peak Demand:** 
   $$\text{Unmet Demand} = \max\left(0, \text{Peak Demand (pax/h)} - \text{Available Bus Capacity (pax/h)}\right) > 50\text{ pax/h}$$

---

## 🎬 Hackathon Demonstration Flow (10 Steps)

1. **Open Landing Page (`/`):** Showcase the smart city brand "APSMART TRANSIT", quick statistics, and methodology pipeline.
2. **Switch to Transport Authority Dashboard:** Click **"Transport Dashboard"** or click `Admin` on the top navbar.
3. **Inspect Executive KPIs & Charts:** View the hourly passenger demand curve highlighting 8:00 AM and 6:00 PM peak periods.
4. **Open Under-Served Areas (`AdminUnderserved`):** Inspect Madhurawada Sector X and Gajuwaka SEZ diagnostic cards showing unmet demand (130 pax/h & 200 pax/h) and explicit reasons.
5. **Open Route Recommendation Engine (`AdminRecommendations`):** View data-driven suggestions (e.g., "Add 3 Peak-Hour Buses on Route 28"). Click **Approve**.
6. **Open GIS Spatial Map (`AdminGISMap`):** Toggle map layers (Routes, Stops, Under-Served Circles, Live Bus Markers).
7. **Generate Executive PDF Report (`AdminReports`):** Click **Download PDF Report** to view structured jsPDF output.
8. **Switch to Field Surveyor Mode:** Click `Surveyor` in the top navbar. Record a sample boarding/alighting passenger entry.
9. **Switch to Passenger Mode:** Click `Passenger` in the top navbar. Search **"Madhurawada" → "RTC Complex"**.
10. **View Bus Details & Live Tracking:** Click a bus card to view complete stop sequence, delay warnings, and simulated GPS map tracking.

---

## 🛡️ License & Credits
Built for Smart City Mobility Analytics (**PS050**).  
Domain Context: **APSRTC City Bus Transportation System**.
