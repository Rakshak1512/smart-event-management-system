# Smart Event Management System

A complete, production-ready full-stack platform for managing college events —
built with **FastAPI + PostgreSQL** on the backend and **React (Vite) + Tailwind CSS**
on the frontend.

Students can discover, search, and register for events, track their
registrations on a calendar, and download PDF certificates after attendance is
marked. Faculty can create and manage events, view registered students, mark
attendance, generate certificates, and track everything on an analytics
dashboard.

---

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Framer Motion, Axios, Recharts
**Backend:** FastAPI, SQLAlchemy, JWT Authentication, Alembic, psycopg
**Database:** PostgreSQL

---

## Project Structure

```
Smart-Event-Management-System/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app entrypoint
│   │   ├── config.py          # Environment-based settings
│   │   ├── database.py        # SQLAlchemy engine/session
│   │   ├── models.py          # ORM models (Users, Events, Registrations, ...)
│   │   ├── schemas.py         # Pydantic request/response schemas
│   │   ├── auth.py            # JWT + password hashing + role guards
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── events.py
│   │   │   ├── registrations.py
│   │   │   ├── attendance.py
│   │   │   ├── certificates.py
│   │   │   ├── notifications.py
│   │   │   ├── analytics.py
│   │   │   └── upload.py
│   │   └── utils/
│   │       └── certificate_generator.py   # PDF certificate generation
│   ├── alembic/                # DB migrations
│   ├── seed.py                 # Demo data seeder
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx, Login.jsx, Register.jsx
│   │   │   ├── Notifications.jsx, Profile.jsx
│   │   │   ├── student/  (Dashboard, Events, EventDetails, MyRegistrations, Calendar, Certificates)
│   │   │   └── faculty/  (Dashboard, EventForm, MyEvents, ManageEvent, Analytics)
│   │   ├── components/   (Navbar, Footer, DashboardLayout, EventCard, StatCard, ProtectedRoute)
│   │   ├── context/      (AuthContext, ThemeContext)
│   │   └── api/axios.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 1. PostgreSQL Setup

Install PostgreSQL locally (or use a hosted instance), then create the database:

```sql
CREATE DATABASE smart_event_db;
```

Make sure a PostgreSQL user has access to it. You'll reference this in the
backend `.env` file in the next step.

---

## 2. Backend Setup

```bash
cd backend
python -m venv venv

# Activate virtual environment
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

pip install -r requirements.txt
```

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

`.env`:
```
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/smart_event_db
SECRET_KEY=change_this_to_a_long_random_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
FRONTEND_URL=http://localhost:5173
```

### Create the database tables

Tables are created automatically the first time the API starts (via
`Base.metadata.create_all`). If you prefer versioned migrations instead, run:

```bash
alembic revision --autogenerate -m "init"
alembic upgrade head
```

### Seed demo data (optional but recommended for a demo)

```bash
python seed.py
```

This creates:
- **Faculty login:** `faculty@college.edu` / `password123`
- **Student login:** `student@college.edu` / `password123`
- 3 sample events

### Run the backend

```bash
uvicorn app.main:app --reload
```

The API will be available at **http://localhost:8000**, with interactive
Swagger docs at **http://localhost:8000/docs**.

---

## 3. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will be available at **http://localhost:5173**. Vite is pre-configured
to proxy `/api` and `/uploads` requests to `http://localhost:8000`, so the
frontend and backend talk to each other out of the box during development.

---

## 4. Environment Variables Reference

**backend/.env**
| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLAlchemy PostgreSQL connection string |
| `SECRET_KEY` | Secret used to sign JWT tokens — change this in production |
| `ALGORITHM` | JWT signing algorithm (default `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes |
| `FRONTEND_URL` | Used for reference/CORS documentation |

**frontend/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

---

## 5. Running the Full Project

1. Start PostgreSQL and create `smart_event_db`.
2. Terminal 1: `cd backend && uvicorn app.main:app --reload`
3. Terminal 2: `cd frontend && npm run dev`
4. Visit `http://localhost:5173`, sign in with the seeded demo accounts, or register a new account.

---

## 6. Feature Overview

### Student
- Browse/search/filter events by category
- Register / cancel registration for events
- View "My Registrations" and a calendar view of upcoming events
- Download PDF certificates once attendance is marked
- Real-time in-app notifications
- Profile management

### Faculty
- Create, edit, and delete events (with banner image upload)
- View registered students per event
- Mark attendance per student
- Generate PDF certificates in bulk for all present students
- Analytics dashboard: total events, registrations, upcoming events, attendance %, registration trends (bar chart), and category split (pie chart)

---

## 7. Deployment Notes

- **Backend:** Deploy the FastAPI app with `uvicorn`/`gunicorn` behind a reverse
  proxy (e.g. Nginx) on any VM, or containerize with Docker and deploy to a
  service like Render, Railway, or AWS ECS. Point `DATABASE_URL` at a managed
  PostgreSQL instance (e.g. Render Postgres, AWS RDS, Neon, etc.).
- **Frontend:** Run `npm run build` inside `frontend/` to produce a static
  `dist/` folder, then deploy it to Vercel, Netlify, or any static host. Set
  `VITE_API_URL` to your deployed backend's public URL at build time.
- **File storage:** Uploaded banner images and generated certificate PDFs are
  written to local folders (`backend/uploads` and `backend/certificates`). For
  production, mount persistent storage or swap in an object store (S3, etc.).
- **CORS:** `main.py` currently allows all origins for ease of local
  development — restrict `allow_origins` to your deployed frontend domain in
  production.

---

## 8. Default Demo Accounts (after running `seed.py`)

| Role | Email | Password |
|---|---|---|
| Faculty | faculty@college.edu | password123 |
| Student | student@college.edu | password123 |

Enjoy exploring EventSphere! 🎓
