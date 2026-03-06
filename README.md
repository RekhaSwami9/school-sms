# School Management System (SMS)

A full-stack MERN (MongoDB/PostgreSQL, Express, React, Node.js) school management system for managing students, teachers, classes, attendance, grades, events, subjects, parents, and fees.

## Features

- **Authentication** - JWT-based login/register system
- **Dashboard** - Overview with quick stats and upcoming events
- **Students Management** - Add, edit, delete, and view students
- **Teachers Management** - Manage teacher records
- **Classes Management** - Create and manage classes
- **Attendance Tracking** - Track student attendance
- **Grade Management** - Manage student grades
- **Event Calendar** - School events and activities
- **Subject Management** - Manage subjects and assign teachers
- **Parent Directory** - Parent contact information
- **Fee Management** - Track tuition and fees
- **Global Search** - Search across all entities

## Tech Stack

### Backend

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT Authentication
- Helmet (Security)
- Rate Limiting

### Frontend

- React 18
- Vite
- React Router
- Axios
- Context API

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Clone the repository
git clone https://github.com/RekhaSwami9/school-sms.git
cd school-sms

# Install all dependencies
npm run install:all

# Or install separately
cd sms-backend && npm install
cd ../sms-frontend && npm install
```

### Development

```bash
# Run both frontend and backend
npm run dev

# Or run separately
npm run dev:backend  # http://localhost:5000
npm run dev:frontend # http://localhost:5174
```

### Environment Variables

Create `.env` in `sms-backend/`:

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=sms_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

## Deployment

### Option 1: Render.com (Recommended)

1. Push code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Add environment variables
5. Deploy

Or use the included `render.yaml` for automatic deployment configuration.

### Option 2: Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Option 3: Vercel + Supabase

- Deploy frontend on Vercel
- Use Supabase for PostgreSQL database

See [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md) for detailed deployment instructions.

## Project Structure

```
school-sms/
├── sms-backend/
│   ├── src/
│   │   ├── config/       # Database config
│   │   ├── controllers/  # Route controllers
│   │   ├── middlewares/  # Auth middleware
│   │   ├── models/       # Sequelize models
│   │   └── routes/       # API routes
│   ├── server.js         # Entry point
│   └── package.json
├── sms-frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/     # React contexts
│   │   ├── services/    # API services
│   │   └── App.jsx      # Main app
│   ├── index.html
│   └── package.json
├── render.yaml          # Render deployment config
├── DEPLOYMENT_PLAN.md  # Deployment guide
└── README.md
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET/POST /api/students` - Student CRUD
- `GET/POST /api/teachers` - Teacher CRUD
- `GET/POST /api/classes` - Class CRUD
- `GET/POST /api/attendance` - Attendance CRUD
- `GET/POST /api/grades` - Grade CRUD
- `GET/POST /api/events` - Event CRUD
- `GET/POST /api/subjects` - Subject CRUD
- `GET/POST /api/parents` - Parent CRUD
- `GET/POST /api/fees` - Fee CRUD
- `GET /api/search` - Global search

## License

ISC

## Author

Rekha Swami
