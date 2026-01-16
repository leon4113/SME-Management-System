# SME Management System

An internal management system designed for Small and Medium Enterprises (SMEs) to manage users, inventory, and orders with secure role-based access control and audit logging.

This project demonstrates backend system design, authentication, authorization, and production-ready API development.

## Tech Stack
- Backend: Node.js, Express
- Database: Supabase (PostgreSQL)
- Frontend: Vue.js
- Authentication: JWT / Supabase Auth
- Infrastructure: Docker

## Core Features
- Role-based access control (Admin, Staff)
- Secure user authentication
- Inventory and order management
- Audit logging for critical system actions
- RESTful API design with proper error handling

## Architecture Overview
- REST API backend with Express
- Relational database hosted on Supabase
- Authorization enforced via backend middleware
- Supabase used as managed PostgreSQL; business logic lives in the application layer
- Containerized services using Docker

## Getting Started

### Prerequisites
- Docker
- Supabase project (PostgreSQL database)

### Run Locally
```bash
docker-compose up --build
