# Expense Tracker MVC

A full-stack expense management application built to help users manage personal and team expenses, monitor spending patterns, and generate reports for analysis. The project combines a modern React front end with a FastAPI backend and a PostgreSQL-compatible database layer.

This project is designed to showcase practical full-stack development skills, including API design, user authentication, database modeling, reporting, and responsive UI implementation.

## Project Overview

The application supports:
- User registration and login
- Expense creation, update, and deletion
- Search and lookup by user name
- Expense summaries and totals
- Graph generation for spending trends
- PDF generation for expense reports
- Email delivery for report exports
- A clean dashboard-style interface

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- CSS Modules / custom styling
- Lucide icons

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL / Supabase-compatible database
- JWT-based authentication with cookie storage
- Matplotlib for graph generation

### Tools and Infrastructure
- Python-dotenv for environment configuration
- Psycopg2 for PostgreSQL integration
- SMTP-based email sending

## Architecture

The project follows a layered application design:

- Frontend: React pages and components under `front-end/src`
- Backend: FastAPI app under `app/`
- Models: database entities defined under `app/models/`
- Repositories: database data access under `app/repositories/`
- Services: business logic under `app/services/`
- Controllers: API endpoints under `app/controllers/`
- Schemas: validation and response models under `app/schemas/`
- Middleware: request handling and authorization under `app/middleware/`

This separation keeps the code easier to maintain and makes the project suitable for demonstration in a professional portfolio or recruiter-facing review.

## Features

### 1. User Management
- Register new users
- View users by name or ID
- Search across user records
- Basic user identity tracking

### 2. Expense Management
- Add expense records
- Edit expense details
- Delete expenses
- Search expenses by user name
- Filter by user and date-related data

### 3. Analytics and Reports
- Generate spending charts
- Export graph visuals as PNG
- Export PDF reports
- Summarize expenses by user

### 4. Automated Email Reporting
- Prepare expense reports for a selected user
- Attach generated PDF content
- Send via SMTP in the background

### 5. Secure Authentication
- Login and register endpoints
- Password hashing and validation
- Cookie-based token storage
- Protected routes and middleware checks

## Application Workflow

1. A user logs in or registers on the frontend.
2. The React app sends requests to the FastAPI backend.
3. The backend validates input and performs operations through service and repository layers.
4. Data is stored in the configured PostgreSQL database.
5. Expense summaries, PDF files, and email reports are generated as needed.
6. The frontend displays the results in a dashboard-like experience.

## Project Structure

```text
expense_tracker_mvc/
├── app/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── schemas/
│   ├── services/
│   ├── cors_config.py
│   ├── database.py
│   ├── main.py
│   ├── security.py
│   ├── user_auth.py
│   └── __init__.py
├── front-end/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── .env
├── requirements.txt
├── .gitignore
└── README.md
```

## Backend API Highlights

The backend exposes API endpoints for the following modules:

- Authentication: `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/user`
- Users: `/users/`, `/users/search`, `/users/{user_id}`
- Expenses: `/expenses/`, `/expenses/search`, `/expenses/{user_id}`
- Summary: `/summary/{user_id}`
- Graphs: `/expenses/user/{user_id}/graph`, `/expenses/user/{user_id}/graph/pdf`
- Email: `/email/send-expense-report/{user_id}`

These routes are organized with FastAPI routers and are integrated in `app/main.py`.

## Frontend Highlights

The frontend includes pages such as:
- Login / registration screen
- Home dashboard
- User management page
- Expense management page
- PDF report management view
- Email report sending flow

Navigation is handled by React Router and the application uses a layout shell with shared navigation controls.

## Environment Configuration

The project uses a root `.env` file for runtime configuration.

Required environment variables include:
- `DATABASE_URL`
- `SMTP_SERVER`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`

Important: never commit real production secrets to source control. Use placeholder values in shared projects and secure real credentials in a local or deployment environment.

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Harsha4576dks/expense_tracker_mvc.git
cd expense_tracker_mvc
```

### 2. Set up the backend

```bash
python -m venv myenv
myenv\Scripts\activate
pip install -r requirements.txt
```

Then create or update the `.env` file with your database and email configuration.

Run the API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Set up the frontend

```bash
cd front-end
npm install
npm run dev
```

The app typically runs at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

## Local Development Notes

- The backend loads environment variables from `.env` at startup.
- SQLAlchemy models are created automatically using `Base.metadata.create_all(bind=engine)`.
- CORS settings allow local frontend requests to communicate with the backend securely.
- Auth tokens are stored as cookies for browser-based requests.

## Project Strengths

This project demonstrates a balanced mix of:
- Full-stack application design
- Database-backed business logic
- Modular API architecture
- User-centric dashboard UI
- Real-world reporting features
- Authentication and secure workflow patterns

For recruiters and hiring managers, it reflects a developer who can work across both frontend and backend layers, manage data flow, and build functional product experiences beyond simple CRUD screens.

## Potential Future Enhancements

- Role-based access control
- Advanced dashboards with charts and filters
- Better pagination and sorting
- Export to CSV and Excel
- Better validation and error handling
- Test coverage for backend and frontend
- Deployment with Docker and cloud hosting

## Summary

Expense Tracker MVC is a practical, portfolio-ready application that showcases end-to-end full-stack development. It combines user management, spending records, reporting, authentication, and modern UI patterns into a cohesive product that is easy to understand, easy to demonstrate, and clearly aligned with real-world business needs.

This project is a strong example of a developer building a complete workflow: from database modeling and API creation to frontend interactions and user-facing reporting features.
