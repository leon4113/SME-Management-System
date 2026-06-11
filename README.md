# SME Management System

An internal management system for Small and Medium Enterprises to manage users, inventory, and orders with secure role-based access control and full audit logging.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express 5 |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 7 |
| Frontend | Vue 3, Vite, Tailwind CSS, Pinia |
| Auth | JWT (jsonwebtoken, bcrypt) |
| Validation | express-validator |
| Infrastructure | Docker |

## Features

- **JWT authentication** — secure login with bcrypt password hashing
- **Role-based access control** — Admin and Staff roles enforced at middleware level
- **User management** — Admin can create and view users
- **Product management** — Admin can create and update products with inventory tracking
- **Order management** — Staff and Admin can create orders; inventory decrements automatically via database transaction
- **Audit logging** — all critical actions (user creation, product updates, order creation) recorded with timestamp and actor
- **Input validation** — all endpoints validate request data before processing
- **Containerized** — runs with a single `docker-compose up --build`

## Project Structure

```
├── src/
│   ├── app.js                  # Express app setup
│   ├── server.js               # Entry point
│   ├── lib/
│   │   └── prisma.js           # Shared Prisma client
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   ├── rbac.js             # Role-based access control
│   │   └── validate.js         # Validation error handler
│   └── modules/
│       ├── auth/               # Register, login
│       ├── users/              # User CRUD (Admin only)
│       ├── products/           # Product CRUD + inventory
│       ├── orders/             # Order creation + status updates
│       └── audit/              # Audit log service + endpoint
├── frontend/
│   └── src/
│       ├── views/              # Login, Dashboard, Products, Orders, Users, Audit
│       ├── stores/             # Pinia auth store
│       ├── api/                # Axios client with JWT interceptor
│       └── router/             # Vue Router with auth guards
├── prisma/
│   └── schema.prisma           # Data models: User, Product, Order, OrderItem, AuditLog
├── Dockerfile
└── docker-compose.yml
```

## API Endpoints

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user (STAFF role) |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/users` | Admin | List all users |
| POST | `/api/users` | Admin | Create user with role |
| GET | `/api/products` | Admin, Staff | List all products |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| GET | `/api/orders` | Admin, Staff | List orders |
| POST | `/api/orders` | Admin, Staff | Create order (decrements inventory) |
| PATCH | `/api/orders/:id` | Admin, Staff | Update order status |
| GET | `/api/audit` | Admin | View audit log |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier works)
- Docker (for containerized run)

### 1. Clone and install

```bash
git clone https://github.com/leon4113/SME-Management-System.git
cd SME-Management-System
npm install
cd frontend && npm install && cd ..
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
JWT_SECRET="your-long-random-secret"
PORT=3000
```

> **Important:** Use the **Session Pooler** connection string from Supabase (Settings → Database → Connection pooling), not the direct connection URL.

### 3. Run database migrations

```bash
npx prisma migrate deploy
```

### 4. Run locally (development)

```bash
# Terminal 1 — backend
node src/server.js

# Terminal 2 — frontend
cd frontend && npm run dev
```

Backend runs at `http://localhost:3000`, frontend at `http://localhost:5173`.

### 5. Run with Docker

```bash
docker-compose up --build
```

App available at `http://localhost:3000`.

## Known Improvements (TODO)

- [ ] Staff users can currently see all orders — should be filtered to their own
- [ ] No rate limiting on login endpoint (brute-force protection)
- [ ] JWT refresh tokens — sessions expire after 1 hour
- [ ] Pagination on list endpoints
- [ ] User deactivation endpoint (`isActive` field exists but unused)
- [ ] Integration tests (Jest + Supertest)
- [ ] Responsive frontend layout for mobile
