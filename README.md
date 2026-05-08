# 🛡️ OctaGuard - Cybersecurity SaaS (Phase 1)

OctaGuard is a modern cybersecurity SaaS platform for website vulnerability scanning using OWASP ZAP. This repository contains **Phase 1: Project Foundation**.

## 🚀 Features (Phase 1)

- **Modern UI**: Dark-themed, responsive dashboard built with React, Vite, and TailwindCSS.
- **Robust Backend**: Express.js server with modular architecture.
- **Database**: SQLite with Prisma ORM (v7) for efficient data management.
- **Scalable Foundation**: Clean folder structure and base routes.

## 📂 Project Structure

```txt
octaguard/
├── frontend/        # React + Vite + TailwindCSS
├── backend/         # Node.js + Express + Prisma
├── docs/            # Project documentation
└── README.md        # Root documentation
```

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Lucide React, React Router, Sonner.
- **Backend**: Node.js, Express, Prisma, SQLite, Cors, Dotenv.

## 🏁 Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd OctaGuard
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure .env (PORT, DATABASE_URL, JWT_SECRET)
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Configure .env (VITE_API_URL)
npm run dev
```

## 🔒 Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `DATABASE_URL`: SQLite connection string (`file:./dev.db`)
- `JWT_SECRET`: Secret key for token signing

### Frontend (.env)
- `VITE_API_URL`: Backend API URL (`http://localhost:5000/api`)
