# ⛪ Church App

A full-stack web application for managing church operations — built with
PostgreSQL, Prisma, TypeScript, Docker, Next.js and Express.

![Status](https://img.shields.io/badge/status-complete-green)
![Stack](https://img.shields.io/badge/stack-TypeScript-blue)
![Docker](https://img.shields.io/badge/docker-ready-blue)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 · Tailwind CSS · shadcn/ui |
| Backend | Node.js · Express · TypeScript |
| Database | PostgreSQL 15 |
| ORM | Prisma |
| Infrastructure | Docker · Docker Compose |
| Charts | Recharts |
| Auth | JWT · Role-based access control |

---

## Features

| Feature | Pastor | Admin | Member | Worker |
|---|---|---|---|---|
| Dashboard overview | ✅ | ✅ | ✅ | ✅ |
| Member management | 👁️ | ✅ | — | 👁️ |
| Events management | 👁️ | ✅ | 👁️ | Create only |
| Attendance tracking | 👁️ | ✅ | 👁️ | ✅ |
| Sermon archive | 👁️ | ✅ | 👁️ | Create only |
| Donation records | 👁️ | ✅ | Own only |
| Announcements | 👁️ | ✅ | 👁️ | Create only |
| Prayer requests | 👁️ | ✅ | ✅ | 👁️

✅ Full access · 👁️ Read only · — No access

---

## Project Structure

\`\`\`
church-app/
├── apps/
│   ├── api/                        ← Express TypeScript backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── members/
│   │   │   │   ├── events/
│   │   │   │   ├── attendance/
│   │   │   │   ├── sermons/
│   │   │   │   ├── donations/
│   │   │   │   ├── announcements/
│   │   │   │   └── prayer-requests/
│   │   │   ├── middleware/
│   │   │   └── utils/
│   │   └── prisma/schema.prisma
│   └── web/                        ← Next.js frontend
│       └── src/
│           ├── app/
│           │   ├── (auth)/
│           │   ├── (admin)/
│           │   ├── (pastor)/
│           │   └── (member)/
│           │   └── (worker)/
│           ├── components/
│           │   ├── layout/
│           │   ├── shared/
│           │   └── admin/
│           ├── services/
│           └── hooks/
├── docker-compose.yml
└── README.md
\`\`\`

---

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)

### Quick Start (Docker — recommended)

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/church-app.git
cd church-app

# 2. Set up environment variables
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env and fill in your values

cp apps/web/.env.example apps/web/.env.local
# Edit apps/web/.env.local and fill in your values

# 3. Start everything
docker-compose up --build -d

# 4. Check all containers are running
docker ps
\`\`\`

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:5000 |
| PGAdmin | http://localhost:5050 |

### Local Development (without Docker)

\`\`\`bash
# Backend
cd apps/api
npm install
npm run prisma:generate
npm run prisma:push
npm run dev

# Frontend (new terminal)
cd apps/web
npm install
npm run dev
\`\`\`

---

## Environment Variables

### `apps/api/.env`

\`\`\`env
POSTGRES_USER=church_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=church_db
DATABASE_URL=postgresql://church_user:your_password@localhost:5432/church_db
PGADMIN_EMAIL=admin@church.com
PGADMIN_PASSWORD=admin123
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key
CORS_ORIGIN=http://localhost:3000
\`\`\`

### `apps/web/.env.local`

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

---

## API Reference

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/create-worker | Admin-only

### Members
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/members | Admin, Pastor, Worker |
| GET | /api/members/stats | Admin, Pastor, Worker |
| GET | /api/members/:id | All |
| PATCH | /api/members/:id | All |
| DELETE | /api/members/:id | Admin |

### Events
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/events | Admin, Pastor, Worker |
| GET | /api/events/upcoming | All |
| GET | /api/events/stats | Admin, Pastor, Worker |
| POST | /api/events | Admin, Worker |
| PATCH | /api/events/:id | Admin |
| DELETE | /api/events/:id | Admin |

### Attendance
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/attendance | Admin, Worker |
| POST | /api/attendance/bulk | Admin, Worker |
| GET | /api/attendance/event/:id | Admin, Pastor, Worker |
| GET | /api/attendance/member/:id | All |
| GET | /api/attendance/stats | Admin, Pastor, Worker |

### Sermons
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/sermons | All |
| GET | /api/sermons/latest | All |
| GET | /api/sermons/series | All |
| POST | /api/sermons | Admin, Worker |
| PATCH | /api/sermons/:id | Admin |
| DELETE | /api/sermons/:id | Admin |

### Donations
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/donations | Admin, Pastor |
| GET | /api/donations/stats | Admin, Pastor |
| GET | /api/donations/member/:id | All |
| POST | /api/donations | Admin |
| PATCH | /api/donations/:id | Admin |
| DELETE | /api/donations/:id | Admin |

### Announcements
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/announcements | Admin, Pastor, Worker |
| GET | /api/announcements/active | All |
| POST | /api/announcements | Admin, Worker |
| PATCH | /api/announcements/:id | Admin |
| PATCH | /api/announcements/:id/toggle | Admin |
| DELETE | /api/announcements/:id | Admin |

### Prayer Requests
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/prayer-requests | Admin, Pastor, Worker |
| GET | /api/prayer-requests/public | All |
| GET | /api/prayer-requests/stats | Admin, Pastor, Worker |
| GET | /api/prayer-requests/member/:id | All |
| POST | /api/prayer-requests | All |
| PATCH | /api/prayer-requests/:id/status | Admin, Pastor |
| DELETE | /api/prayer-requests/:id | Admin |

---

## Dashboard Roles

### Pastor Dashboard
Read-only visibility into all church metrics. Includes member breakdown,
attendance trends, giving reports, upcoming events and prayer requests.

### Admin Dashboard
Full control center. Create and manage members, events, sermons,
donations, announcements and prayer requests. Includes live charts.

### Member Dashboard
Personal portal. View upcoming events, latest sermons, announcements,
personal attendance rate, giving history and prayer requests.

### Worker Dashboard
Partial control center. Create events, sermons, announcements and prayer requests. Includes attendance live charts
---

## Useful Commands

\`\`\`bash
# Docker
docker-compose up -d           # Start all services
docker-compose down            # Stop all services
docker-compose down -v         # Stop and delete all data
docker logs church_api         # API logs
docker logs church_db          # Database logs

# Prisma
npm run prisma:studio          # Open visual DB editor
npm run prisma:migrate         # Run migrations
npm run prisma:generate        # Regenerate client
\`\`\`

---

## License

MIT