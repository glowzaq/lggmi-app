# ⛪ LGGMI App

A full-stack web application for managing church operations including 
member management, events, sermons, donations, attendance and more.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + Tailwind CSS + shadcn/ui |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Infrastructure | Docker + Docker Compose |

## Features

- 👥 Member Management
- 📅 Events & Services
- 🎙️ Sermon Archive
- 💰 Donation Tracking
- ✅ Attendance Management
- 📢 Announcements
- 🙏 Prayer Requests
- 🔐 Role-based access (Pastor, Admin, Member)

## Project Structure

\`\`\`
lggmi-app/
├── apps/
│   ├── api/        # Express TypeScript Backend
│   └── web/        # Next.js Frontend
├── docker-compose.yml
└── README.md
\`\`\`

## Getting Started

### Prerequisites

Make sure you have these installed:
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/church-app.git
cd church-app

# Copy environment file and fill in your values
cp apps/api/.env.example apps/api/.env
\`\`\`

### Running with Docker

\`\`\`bash
# Start all services
docker-compose up -d

# Check running containers
docker ps
\`\`\`

Visit **http://localhost:5050** to access PGAdmin (database manager)

### Running the API locally

\`\`\`bash
cd apps/api
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
\`\`\`

API runs on **http://localhost:5000**
Health check: **http://localhost:5000/health**

### Database Management

\`\`\`bash
# Open Prisma Studio (visual DB editor)
npm run prisma:studio
\`\`\`

## Status

🚧 Currently in active development