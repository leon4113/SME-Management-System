```md
# Product Requirements Document (PRD)

## Product Name
SME Management System

## Author
Leonardo

## Version
1.0

---

## 1. Overview

### 1.1 Problem Statement
Many SMEs rely on spreadsheets or fragmented tools to manage staff, inventory, and orders. This results in data inconsistency, lack of accountability, and limited visibility into operations.

### 1.2 Objective
Build a secure internal system that enables SMEs to manage users, inventory, and orders while ensuring traceability of all critical actions.

---

## 2. Goals & Non-Goals

### Goals
- Role-based access for administrators and staff
- Inventory and order management
- Audit logging for traceability
- Production-ready backend API

### Non-Goals
- Customer-facing e-commerce features
- Payment processing
- Mobile application support

---

## 3. User Roles

### Admin
- Manage users and roles
- Manage products
- View all orders
- View audit logs

### Staff
- View products
- Create orders
- View assigned orders

---

## 4. Functional Requirements

### 4.1 Authentication
- Users authenticate using email and password
- JWT issued upon successful login
- All protected endpoints require valid JWT

### 4.2 User Management
- Admins can create and view users
- Users are assigned roles: ADMIN or STAFF

### 4.3 Product Management
- Admins can create and update products
- Product attributes: name, SKU, price, quantity
- Inventory updated automatically upon order creation

### 4.4 Order Management
- Staff can create orders
- Orders include one or more products
- Order statuses: PENDING, COMPLETED, CANCELLED

### 4.5 Audit Logging
- System logs actions such as:
  - User creation
  - Product updates
  - Order creation
- Logs include user, action, entity, and timestamp

---

## 5. Non-Functional Requirements
- RESTful API design
- Secure password hashing
- Input validation and centralized error handling
- Pagination for list endpoints
- Dockerized deployment

---

## 6. Data Model (High-Level)

Entities:
- User
- Product
- Order
- OrderItem
- AuditLog

Relationships:
- User → Orders (1:N)
- Order → OrderItems (1:N)
- Product → OrderItems (1:N)

---

## 7. Success Metrics
- Unauthorized access blocked at API level
- All critical actions recorded in audit logs
- Application deployable using Docker with minimal setup
