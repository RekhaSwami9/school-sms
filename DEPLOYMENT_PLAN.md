# Deployment Guide for School Management System

## Quick Deploy Options

### Option 1: Render.com (Recommended - Free Tier Available)

#### Backend Deployment:

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Create New → Web Service
4. Connect your GitHub repository
5. Configure:
   - **Name:** school-sms-backend
   - **Build Command:** (leave empty - using npm start)
   - **Start Command:** npm start
   - **Environment:** Node
6. Add Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   DB_HOST=your_postgres_host
   DB_PORT=5432
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_secure_random_string
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-frontend.onrender.com
   ```
7. Create and deploy

#### Frontend Deployment:

1. In Render, create New → Static Site
2. Connect your GitHub repository
3. Configure:
   - **Name:** school-sms-frontend
   - **Build Command:** npm run build
   - **Publish directory:** sms-frontend/dist
4. Add Environment Variables:
   ```
   VITE_API_URL=https://school-sms-backend.onrender.com
   ```
5. Deploy

### Option 2: Railway (Free Tier Available)

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add database: `railway add postgresql`
5. Deploy: `railway up`

### Option 3: Vercel + Supabase (Frontend + Database)

**Frontend (Vercel):**

1. Go to [Vercel](https://vercel.com)
2. Import GitHub repository
3. Framework preset: Vite
4. Build command: npm run build
5. Output directory: sms-frontend/dist
6. Environment Variables:
   - VITE_API_URL=https://your-backend-url.com

**Database (Supabase):**

1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Get connection details
4. Update backend environment variables

---

## Environment Variables Needed

### Backend (.env)

```
PORT=5000
NODE_ENV=production
DB_HOST=your_postgres_host
DB_PORT=5432
DB_NAME=sms_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=generate_a_secure_random_string
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend

```
VITE_API_URL=https://your-backend-url.com
```

---

## Database Setup

If using local PostgreSQL:

```bash
# Create database
createdb sms_db

# Or using psql
psql -U postgres -c "CREATE DATABASE sms_db;"
```

---

## Project Structure for Deployment

```
school-sms/
├── sms-backend/          # Express.js API
│   ├── src/
│   ├── server.js
│   ├── Procfile         # For Render deployment
│   └── package.json
├── sms-frontend/        # React + Vite
│   ├── src/
│   ├── dist/           # Production build
│   └── package.json
├── .env.example
└── DEPLOYMENT_PLAN.md
```

---

## Features Ready for Production

✅ Security:

- Helmet (security headers)
- Rate limiting
- CORS configuration
- Error handling middleware
- Body size limits

✅ Authentication:

- JWT tokens
- Cookie handling

✅ API Endpoints:

- Students, Teachers, Classes
- Attendance, Grades, Events
- Subjects, Parents, Fees
- Search functionality

---

## Troubleshooting

### CORS Errors

- Ensure `FRONTEND_URL` is set in backend environment variables

### Database Connection

- Verify PostgreSQL credentials
- Check if database exists
- Ensure IP is whitelisted (for cloud databases)

### Build Errors

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript/eslint errors

---

## Testing Production Build Locally

```bash
# Backend
cd sms-backend
npm start

# Frontend (from sms-frontend directory)
npm run build
npm run preview
```
