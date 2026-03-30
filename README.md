# Company Management System - College Project

A professional-grade Company Management System built with a Node.js backend and a high-performance React frontend.

## Features
- **Dashboard**: Real-time stats for employees, products, and defects.
- **Departments**: Full CRUD for company departments.
- **Employees**: Manage staff with department associations and salary tracking.
- **Products**: Track inventory and manage quality control (Defects).
- **Quality Control**: Advanced defect reporting and status management.
- **Stock & Staff Assignments**: Manage many-to-many relationships between products, materials, and employees.
- **Premium UI**: Modern dark-mode interface with glassmorphism and smooth animations.

## Tech Stack
- **Frontend**: React + Vite + Framer Motion + Lucide Icons + Vanilla CSS.
- **Backend**: Node.js + Express + PostgreSQL.
- **Database**: PostgreSQL (Relational schema with 9 tables).

## Setup Instructions

### 1. Database Setup (Supabase)
1. Create a project on [Supabase](https://supabase.com).
2. Go to **Project Settings > Database** and copy the **Connection String** (use the Transaction pooler URI if possible, or direct).
3. Run the SQL script found in `database/schema.sql` in the **Supabase SQL Editor**.
4. Run the SQL script found in `database/seed.sql` to populate sample data.

### 2. Backend Configuration
1. Navigate to the `backend/` directory.
2. Install dependencies: `npm install`.
3. Open the `.env` file and paste your `DATABASE_URL`:
   ```env
   PORT=5000
   DATABASE_URL=postgres://postgres:[YOUR_PASSWORD]@[YOUR_HOST]:5432/postgres
   ```
4. Start the server: `npm run dev`.

### 3. Frontend Configuration
1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
4. Open the application at `http://localhost:5173`.

## Minimum Requirements
- Node.js installed.
- PostgreSQL server running.
