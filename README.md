# RohWinBghit

RohWinBghit is a full-scale Algerian carpooling platform (BlaBlaCar-like) with:

- **Drivers**: publish inter-wilayas trips
- **Passengers**: search, book seats, pay (Cash / CIB-BaridiMob simulation)
- **Trust**: profiles, ratings, verifications (email/SMS), reports & moderation
- **Real-time**: messaging + notifications + booking updates

## Tech stack (strict)

- **Web**: React 18, React Router v6, Redux Toolkit + RTK Query, Tailwind CSS, React Hook Form + Zod, Axios, Leaflet, Day.js, Framer Motion
- **API**: Node.js 18+, Express, MongoDB + Mongoose, JWT + Refresh Tokens, RBAC (User/Driver/Admin), Zod validation, Multer + Cloudinary, Email (Nodemailer), SMS (mock/provider adapter), Socket.io
- **Deployment**: Docker + Docker Compose

## Monorepo structure

```
.
├── apps/
│   ├── api/       # Express + MongoDB + Socket.io
│   └── web/       # React SPA (BlaBlaCar-like UX)
├── packages/
│   └── shared/    # Shared types/schemas/constants
└── docker-compose.yml
```

## Quick start (local)

1) Create env files

- `apps/api/.env` (copy from `apps/api/.env.example`)
- `apps/web/.env` (copy from `apps/web/.env.example`)

2) Install dependencies

```bash
npm install
```

3) Start Mongo + API + Web

```bash
docker compose up -d mongo
npm run dev
```

## Docker (production-style)

```bash
docker compose up --build
```
