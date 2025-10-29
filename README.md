# Disaster Response System

A full-stack web application for reporting and managing disaster incidents. Users can create reports, view reports, and manage them. The project includes a React + Vite frontend and a Python backend (Flask-style assumed) with a relational database.

---

## Table of contents

- [Project overview](#project-overview)
- [Features](#features)
- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local development (quickstart)](#local-development-quickstart)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Database & migrations](#database--migrations)
- [Testing](#testing)
- [License](#license)
- [Contact](#contact)

---

## Project overview

This repository implements a disaster reporting system:
- Submit reports (title, description, severity, location, optional image)
- List and view individual reports
- Edit and delete reports (authentication assumed)
- Store and serve uploaded images for display in report cards

---

## Features

- Report creation with file/image upload
- List and details views for reports
- Classification fo disasters by AI.
- Database-backed persistence and migrations

---

# Disaster Response System

## Project Structure

```
disaster-response-system/
├── client/
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Reports/
│   │   │   └── common/
│   │   ├── Services/
│   │   │   └── api.js
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── migrations/
│   ├── models/
│   │   └── __init__.py
│   ├── routes/
│   ├── config.py
│   ├── app.py
│   └── requirements.txt
│
├── README.md
└── .gitignore
```

## Directory Structure Explanation

### Client Side (React + Vite)
- `client/`: Frontend application
  - `public/`: Static files and assets
  - `src/`: Source code
    - `components/`: Reusable React components
    - `Services/`: API and other services
    - `pages/`: Page components
    - `App.jsx`: Main application component
    - `main.jsx`: Entry point

### Server Side (Flask)
- `server/`: Backend application
  - `migrations/`: Database migration files
  - `models/`: Database models
  - `routes/`: API route handlers
  - `config.py`: Configuration settings
  - `app.py`: Main Flask application
  - `requirements.txt`: Python dependencies
---

## Tech stack

- Frontend: React, Vite, JavaScript.
- Backend: Python (Flask)
- Database: SQLite.
---

## Prerequisites

- Git
- Node.js (16+ recommended) and npm/yarn
- Python 3.8+
- pip
- Database:SQLite for local dev

---



## Local development (quickstart)

Clone repo:
```
git clone <repo-url>
cd final_project
```

### Backend

1. Create and activate venv:
```
python -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:
```
cd server
pip install -r requirements.txt
```

3. Set environment variables (example):
```
export FLASK_APP=app.py
export FLASK_ENV=development
export DATABASE_URL=sqlite:///dev.db
export UPLOAD_DIR=./uploads
```

4. Run migrations:
```
flask db init
flask db migrate -m "initial migrations"
flask db upgrade head
```

5. Start backend:
```
python app.py
```

### Frontend

1. Install dependencies:
```
cd client
npm install

```

2. Start dev server (Vite):
```
npm run dev
```
---

## Database & migrations

- Keep migration scripts under `server/migrations/`.
- For Flask-Migrate:
  - `flask db migrate -m "message"`
  - `flask db upgrade`

---

## Testing

### Backend (pytest)

1. Activate Python venv and install dev/test dependencies (if separate):
```
source .venv/bin/activate
pip install -r requirements.txt
pip install pytest
```

2. Run pytest from the `server` folder:
```
cd server
pytest -q
```

3. Recommended test cases:
- Report creation with and without images
- Image file saved on disk and DB record includes URL/path
- GET endpoints return image URLs accessible by client
- Error handling for invalid uploads and permissions

Add a `tests/` directory under `server/` with test fixtures that use a temporary database and upload folder.

---



## License

This project is under no license.

---


