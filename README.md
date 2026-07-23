# TwaraSmart — AI Logistics & Fleet Management Platform

A full-stack logistics platform: Spring Boot + PostgreSQL backend, React (Vite) frontend.
Manage your fleet, track vehicles live on a map, run warehouses and inventory, predict
delivery ETAs, monitor fuel efficiency, and get AI-optimized delivery routes.

## Features

- **Auth**: JWT access tokens + rotating refresh tokens, BCrypt password hashing
- **Fleet management**: vehicles (plate, type, capacity, status) and drivers (license, phone,
  status), with driver-vehicle assignment
- **Live tracking**: vehicle positions on a Leaflet/OpenStreetMap map, color-coded by status,
  with a "Simulate GPS ping" demo action (swap for a real telematics feed via the same
  `PATCH /api/vehicles/{id}/location` endpoint)
- **Warehouse & inventory**: warehouses with capacity, inventory items per warehouse with
  reorder thresholds and automatic low-stock flags
- **Deliveries**: shipments with origin/destination, assigned vehicle/driver, and status
  (pending/in-transit/delivered/delayed); ETA is predicted from great-circle distance and
  average speed the moment a shipment is created
- **Fuel optimization**: log fuel purchases per vehicle, automatically compute km/liter
  efficiency from consecutive odometer readings, and flag vehicles trending below the
  fleet average
- **AI route planning**: given a set of delivery stops, a nearest-neighbor heuristic computes
  an optimized visiting order and reports distance saved vs. an unoptimized route, visualized
  on a map
- **Dashboard**: active vehicles, in-transit deliveries, on-time delivery rate, average fuel
  efficiency, a 7-day delivery trend chart, fleet status breakdown, and low-stock alerts
- **Dark / light theme** toggle, persisted per browser
- **API docs**: Swagger UI at `/swagger-ui.html` once the backend is running

## Tech stack

| Layer | Stack |
|---|---|
| Backend | Java 17, Spring Boot 3.3, Spring Security, Spring Data JPA, Flyway, PostgreSQL, JJWT |
| Frontend | React 18, Vite, React Router, Recharts, Leaflet + react-leaflet, Axios, lucide-react |
| Infra | Docker Compose (Postgres + backend + frontend) |

## Running locally

### Option A — Docker Compose

```bash
docker compose up --build
```
- Backend: http://localhost:8080 (Swagger UI at `/swagger-ui.html`)
- Frontend: http://localhost:5173
- Postgres: localhost:5432 (user `twara_user` / password `twara_pass` / db `twarasmart`)

### Option B — Run manually

**1. Start Postgres** (Docker or local install), then create the database/user if running
Postgres locally instead of via Docker:
```sql
CREATE USER twara_user WITH PASSWORD 'twara_pass';
CREATE DATABASE twarasmart OWNER twara_user;
```

**2. Backend** (JDK 17+ and Maven):
```bash
cd backend
mvn spring-boot:run
```
Flyway auto-creates the schema on first run. API listens on `http://localhost:8080`.

**3. Frontend** (Node 18+):
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open `http://localhost:5173`, register an account, and you're in.

## Design notes

The sidebar is a fixed dark charcoal-indigo rail (constant in both light and dark theme —
a common pattern in fleet/ops dashboards) while the content area follows the light/dark
toggle. Accent color is a single restrained indigo blue used only for primary actions and
the active nav item. Status colors (green/amber/red) are used only semantically — active
vs. maintenance, on-time vs. delayed, in-stock vs. low-stock — never decoratively. Typography
is Plus Jakarta Sans throughout, flat 1px borders instead of drop shadows, and a 4px maximum
corner radius.

## Extending this project

- **Real GPS integration**: replace "Simulate GPS ping" with a webhook/MQTT listener that
  calls the same `PATCH /api/vehicles/{id}/location` endpoint from real telematics hardware.
- **Smarter route optimization**: swap the nearest-neighbor heuristic in
  `RouteOptimizationService` for a proper VRP solver (e.g. OR-Tools) for larger stop counts.
- **ETA model**: replace the straight-line-distance ETA calculation with a routing-API-based
  estimate (OSRM, Mapbox Directions) for road-accurate times.
- **Tests**: add `@WebMvcTest` and `@DataJpaTest` tests using the H2 profile already
  configured in `src/test/resources/application-test.yml`.
