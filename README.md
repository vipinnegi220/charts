# Survey Analytics & Report Automation SaaS

Production-ready starter for a side-income SaaS product aimed at market research agencies and HR teams.

## What it does
1. Upload survey Excel file (`.xlsx`).
2. Auto-generate dashboards (bar, stacked, pie, trend, wave comparison).
3. Compute KPI metrics (mean, top-box, bottom-box, NPS, distribution, response count).
4. Run significance testing via Python microservice.
5. Auto-generate downloadable PPT report.
6. Produce AI-style insight summary (placeholder deterministic model).

---

## Architecture (clean modular split)

```text
/frontend        -> React + Chart.js UI
/backend         -> Express API + auth + upload + analytics orchestration
/python-service  -> FastAPI stats + significance + ppt generation
/database        -> SQLite schema/seed SQL
/uploads         -> Stored uploads and generated reports
/sample-data     -> Example survey files
```

## Phase 1 — Project setup

### 1) Install dependencies
```bash
npm run setup
```

### 2) Initialize DB + demo user
```bash
npm --prefix backend run migrate
```
Demo login:
- Email: `demo@saas.com`
- Password: `password123`

### 3) Generate sample survey file
```bash
npm --prefix backend run sample:data
```

## Phase 2 — Upload system
- `POST /api/surveys/upload` accepts `.xlsx` with `multer`.
- Stores file in `/uploads`.
- Parses rows + question columns from first sheet.
- Saves survey metadata + raw row JSON in SQLite.

## Phase 3 — Dashboard generation
- `GET /api/surveys/:id/dashboard`
- Backend calculates KPIs per question.
- Frontend renders:
  - bar chart
  - pie chart
  - trend chart
  - wave comparison chart
  - stacked sentiment summary

## Phase 4 — Significance testing
- Backend sends grouped response payload to Python:
  - `POST /significance`
- Python runs Welch t-test for group comparisons.
- Returns significant labels (`A>B`, etc.) + p-values.

## Phase 5 — PPT generation
- Backend calls `POST /generate-ppt`.
- Python builds report with `python-pptx`:
  - title slide
  - KPI summary
  - insight summary
  - chart highlight slide
- Backend streams `.pptx` back for download.

## Phase 6 — Polish
- JWT auth with protected routes.
- Upload history view.
- Insight summary banner.
- Deployment-ready service split.

---

## Run locally (3 terminals)

### Terminal A — Python microservice
```bash
npm run dev:python
```

### Terminal B — Backend API
```bash
npm run dev:backend
```

### Terminal C — Frontend
```bash
npm run dev:frontend
```

Then open `http://localhost:5173`.

---

## API summary

### Auth
- `POST /api/auth/login`

### Surveys
- `GET /api/surveys`
- `POST /api/surveys/upload`
- `GET /api/surveys/:id/dashboard`
- `GET /api/surveys/:id/report`

---

## File-by-file guide

### `/frontend`
- `index.html` — Vite entry HTML.
- `src/main.jsx` — React bootstrap + router.
- `src/App.jsx` — route map + auth guard.
- `src/api.js` — Axios client with JWT interceptor.
- `src/pages/LoginPage.jsx` — login form.
- `src/pages/UploadPage.jsx` — upload + survey history.
- `src/pages/DashboardPage.jsx` — KPIs, charts, significance, PPT download.
- `src/components/ChartCard.jsx` — multi-chart visual per question.
- `src/components/KpiTable.jsx` — KPI metrics table.
- `src/styles.css` — clean UI styling.

### `/backend`
- `src/server.js` — API bootstrap.
- `src/app.js` — middleware + routes + error handler.
- `src/config/env.js` — environment config.
- `src/config/db.js` — sqlite connection singleton.
- `src/middleware/auth.js` — JWT validation.
- `src/routes/authRoutes.js` — login route.
- `src/routes/surveyRoutes.js` — protected survey routes + upload handling.
- `src/controllers/authController.js` — login and token issue.
- `src/controllers/surveyController.js` — upload, dashboard, report endpoints.
- `src/services/surveyService.js` — parsing + KPI + chart payload generation.
- `src/services/pythonClient.js` — calls Python microservice.
- `src/utils/initDb.js` — schema creation + demo user seed.
- `src/utils/generateSampleSurvey.js` — creates sample `.xlsx`.

### `/python-service`
- `app.py` — FastAPI service with significance, insight, PPT endpoints.
- `requirements.txt` — Python dependencies.

### `/database`
- `schema.sql` — database schema reference.
- `seed.sql` — seed notes.

### `/uploads`
- runtime storage for uploaded survey files + generated PPT.

### `/sample-data`
- generated sample `.xlsx` for testing flows.

---

## Deployment-ready notes
- Replace SQLite with Postgres for multi-tenant scale.
- Move uploads to object storage (S3/GCS).
- Add payment + subscription gates (Stripe).
- Add role-based access control and audit logs.
