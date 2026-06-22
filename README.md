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

### Running the Frontend

\`\`\`bash
cd apps/web
npm install
npm run dev
\`\`\`

Frontend runs on **http://localhost:3000**

### API Endpoints

#### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login |

#### Members
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/members | Admin, Pastor | Get all members |
| GET | /api/members/stats | Admin, Pastor | Get member statistics |
| GET | /api/members/:id | All | Get single member |
| PATCH | /api/members/:id | All | Update member |
| DELETE | /api/members/:id | Admin | Deactivate member |

#### Events
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/events | Admin, Pastor | Get all events |
| GET | /api/events/upcoming | All | Get upcoming events |
| GET | /api/events/stats | Admin, Pastor | Get event statistics |
| GET | /api/events/:id | All | Get single event |
| POST | /api/events | Admin | Create event |
| PATCH | /api/events/:id | Admin | Update event |
| DELETE | /api/events/:id | Admin | Delete event |

#### Attendance
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/attendance | Admin | Mark single attendance |
| POST | /api/attendance/bulk | Admin | Bulk mark attendance |
| GET | /api/attendance/event/:eventId | Admin, Pastor | Get event attendance |
| GET | /api/attendance/member/:memberId | All | Get member attendance |
| GET | /api/attendance/stats | Admin, Pastor | Get attendance trend |

#### Sermons
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/sermons | All | Get all sermons |
| GET | /api/sermons/latest | All | Get latest sermons |
| GET | /api/sermons/series | All | Get all series names |
| GET | /api/sermons/:id | All | Get single sermon |
| POST | /api/sermons | Admin | Create sermon |
| PATCH | /api/sermons/:id | Admin | Update sermon |
| DELETE | /api/sermons/:id | Admin | Delete sermon |

#### Donations
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/donations | Admin, Pastor | Get all donations |
| GET | /api/donations/stats | Admin, Pastor | Get donation stats and trend |
| GET | /api/donations/:id | Admin, Pastor | Get single donation |
| GET | /api/donations/member/:memberId | All | Get member giving history |
| POST | /api/donations | Admin | Record donation |
| PATCH | /api/donations/:id | Admin | Update donation |
| DELETE | /api/donations/:id | Admin | Delete donation |

#### Announcements
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/announcements | Admin, Pastor | Get all announcements |
| GET | /api/announcements/active | All | Get active announcements |
| GET | /api/announcements/:id | All | Get single announcement |
| POST | /api/announcements | Admin | Create announcement |
| PATCH | /api/announcements/:id | Admin | Update announcement |
| PATCH | /api/announcements/:id/toggle | Admin | Toggle active status |
| DELETE | /api/announcements/:id | Admin | Delete announcement |

#### Prayer Requests
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/prayer-requests | Admin, Pastor | Get all prayer requests |
| GET | /api/prayer-requests/public | All | Get public requests |
| GET | /api/prayer-requests/stats | Admin, Pastor | Get prayer stats |
| GET | /api/prayer-requests/member/:memberId | All | Get member requests |
| GET | /api/prayer-requests/:id | All | Get single request |
| POST | /api/prayer-requests | All | Submit prayer request |
| PATCH | /api/prayer-requests/:id | All | Update request |
| PATCH | /api/prayer-requests/:id/status | Admin, Pastor | Update status |
| DELETE | /api/prayer-requests/:id | Admin | Delete request |

## Dashboard Roles

### Pastor Dashboard
Read-only visibility into all church metrics including member breakdown,
attendance trends, giving reports and prayer request status.

### Admin Dashboard
Full control center with live stats, giving charts, attendance trends,
recent donations and breakdown by giving type.

### Member Dashboard
Personal portal showing upcoming events, latest sermons, announcements,
personal attendance rate and giving history.

## Frontend Structure

\`\`\`
src/
├── app/
│   ├── (auth)/login/       ← Login page
│   ├── (admin)/            ← Admin pages
│   ├── (pastor)/           ← Pastor pages
│   └── (member)/           ← Member pages
├── components/
│   ├── layout/             ← Sidebar, Topbar, DashboardLayout
│   └── shared/             ← AuthGuard, StatCard
└── services/
    └── api.ts              ← Axios instance with interceptors
\`\`\`

## Status

🚧 Currently in active development