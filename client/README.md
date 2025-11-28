# Real Estate Starter (MERN)

## What you get
- React (Vite) + Tailwind frontend
- Express + MongoDB backend
- Cloudinary image uploads
- Admin login (JWT) + simple upload form
- WhatsApp contact links on listings

## Quick start (local)
1. Fill `.env` in server with Mongo URI and Cloudinary keys.
2. From `server/` run:
   ```
   npm install
   npm run dev
   ```
3. From `client/` run:
   ```
   npm install
   npm run dev
   ```
4. Create admin: open POST `/api/auth/create-admin` with JSON `{ "email": "...", "password": "..." }` or run `node src/seed-admin.js`.

## Deploy
- Build client and serve static files via Nginx or host on Vercel.
- Start server with `pm2`.