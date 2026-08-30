# 🛒 Bzaro

### E-Commerce | Marketplace

> A full-stack marketplace architecture built around a modern customer web application, dedicated backend API, shared contracts, secure authentication, validation, and scalable commerce workflows.

---

## 📌 Project Overview

**Bzaro** is an e-commerce marketplace project organized as an npm-workspace monorepo.

The repository separates the system into three primary workspaces:

- `apps/web` — customer-facing web application
- `apps/api` — backend API
- `packages/contracts` — shared contracts/types

The supplied root configuration identifies the project as a private e-commerce platform monorepo and defines these three workspaces.

---

# 🎯 Project Vision

Bzaro is designed as a foundation for a modern marketplace where users can discover products, manage shopping activity, and complete commerce workflows through a dedicated backend.

The architecture emphasizes:

- Frontend/backend separation
- Shared contracts
- Secure authentication
- Input validation
- Database persistence
- API protection
- Structured logging
- Maintainable code organization
- Future scalability

---

# 🏗️ High-Level Architecture

```text
                         ┌──────────────────────┐
                         │       Customer       │
                         │      Web Browser     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      apps/web        │
                         │ React + Vite         │
                         │ Redux Toolkit        │
                         │ React Query          │
                         │ Tailwind CSS         │
                         └──────────┬───────────┘
                                    │
                                 HTTP API
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      apps/api        │
                         │ Express + TypeScript │
                         │ Authentication       │
                         │ Validation           │
                         │ Security middleware  │
                         │ Business logic       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │        MongoDB        │
                         │       Mongoose        │
                         └──────────────────────┘

                                    ▲
                                    │
                         ┌──────────────────────┐
                         │ packages/contracts   │
                         │ Shared contracts /   │
                         │ types between apps  │
                         └──────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development/build tooling |
| TypeScript | Type safety |
| Redux Toolkit | Client/application state |
| React Redux | Redux integration |
| TanStack React Query | Server state/data fetching |
| Axios | HTTP communication |
| React Router | Client-side routing |
| Framer Motion | Animations |
| Lucide React | Icons |
| Tailwind CSS | Styling |
| PostCSS | CSS processing |
| Autoprefixer | Browser compatibility |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express | REST API framework |
| TypeScript | Type safety |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| Zod | Request/data validation |
| Argon2 | Password hashing |
| JSON Web Token | Authentication |
| Cookie Parser | Cookie handling |
| CORS | Cross-origin protection |
| Helmet | Security headers |
| Express Rate Limit | Rate limiting |
| Pino | Structured logging |
| Pino HTTP | HTTP logging |
| dotenv | Environment configuration |

These technologies are supported by the supplied package manifests. The root package defines the workspace structure and MongoDB dependency, while the API workspace includes Argon2, Express, rate limiting, Helmet, JWT, Mongoose, Pino and Zod. The web workspace includes React, Vite, Redux Toolkit, React Query, Axios, React Router, Framer Motion and Tailwind tooling.

---

# 📂 Complete Project File Structure

```text
Bzaro/
│
├── apps/
│   │
│   ├── api/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   └── ...
│   │   │
│   │   ├── package.json
│   │   └── ...
│   │
│   └── web/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── hooks/
│       │   ├── services/
│       │   ├── store/
│       │   ├── routes/
│       │   └── ...
│       │
│       ├── public/
│       ├── package.json
│       └── ...
│
├── packages/
│   └── contracts/
│       ├── src/
│       ├── package.json
│       └── ...
│
├── bzaro-assets/
│   └── bzaro-logo.jpg
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

> The workspace-level structure above is directly supported by the supplied package configuration. The internal `src` folders are a recommended organization; keep them aligned with the actual implementation.

---

# 🌐 Frontend — `apps/web`

The web application is the customer-facing layer.

Responsibilities include:

- Marketplace UI
- Product discovery
- Product details
- Client-side routing
- Authentication UI
- Cart experience
- API communication
- Server-state management
- Application state management
- Responsive design
- Animations

### Frontend flow

```text
User Interaction
       ↓
React Component
       ↓
Redux / React Query
       ↓
Axios
       ↓
Backend API
       ↓
Response
       ↓
UI Update
```

---

# ⚙️ Backend — `apps/api`

The API is responsible for server-side operations and business rules.

Responsibilities include:

- Authentication
- Authorization
- API routing
- Request validation
- Business logic
- Database operations
- Password hashing
- JWT handling
- Rate limiting
- Security headers
- CORS
- Logging
- Error handling

---

# 🗄️ Database Layer

Bzaro uses:

```text
MongoDB
   ↑
Mongoose
   ↑
Express API
```

Potential marketplace entities include:

```text
User
Product
Category
Cart
Order
OrderItem
Address
Payment
Review
Wishlist
Seller
```

The exact implemented schema should remain the source of truth for the current version.

---

# 🔐 Authentication & Security

The API dependency set provides a security foundation using:

- Argon2 password hashing
- JWT authentication
- Helmet
- CORS
- Express Rate Limit
- Zod validation
- Structured logging

### Password flow

```text
User Password
      ↓
    Argon2
      ↓
Password Hash
      ↓
   MongoDB
```

Passwords should never be stored as plaintext.

### Authentication flow

```text
Login
  ↓
Credential Verification
  ↓
Authentication Token
  ↓
Authenticated Request
  ↓
Protected API Route
```

---

# 🧱 Security Architecture

```text
Incoming Request
       ↓
     CORS
       ↓
    Helmet
       ↓
 Rate Limiter
       ↓
 Authentication
       ↓
    Zod
 Validation
       ↓
 Authorization
       ↓
 Business Logic
       ↓
   Database
```

Security should be implemented as defense in depth rather than relying on a single mechanism.

---

# 🔄 Shared Contracts

`packages/contracts` provides a shared layer between the frontend and backend.

```text
                 packages/contracts
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
          apps/web               apps/api
```

Shared contracts can help keep:

- Request structures
- Response structures
- Shared types
- API contracts
- Validation expectations

consistent between both sides of the application.

---

# 🛒 Marketplace Workflow

```text
Visitor
   ↓
Browse Marketplace
   ↓
View Product
   ↓
Add to Cart
   ↓
Review Cart
   ↓
Login / Authentication
   ↓
Select Address
   ↓
Checkout
   ↓
Order Creation
   ↓
Payment
   ↓
Order Confirmation
   ↓
Order Tracking
```

---

# 👤 User System

A marketplace user can have:

```text
User
├── Registration
├── Login
├── Logout
├── Profile
├── Address Management
├── Cart
├── Orders
├── Wishlist
└── Reviews
```

The backend remains responsible for authentication, authorization, and sensitive business rules.

---

# 🛍️ Product System

A marketplace product can conceptually contain:

```text
Product
├── Name
├── Description
├── Price
├── Images
├── Category
├── Inventory
├── Seller
└── Metadata
```

The actual database schema should define the authoritative fields.

---

# 🛒 Cart System

```text
Product
   ↓
Add to Cart
   ↓
Cart
├── Product
├── Quantity
└── Price Reference
   ↓
Checkout
```

The backend should independently validate important values.

The client should never be treated as authoritative for:

- Price
- Inventory
- Discount
- Final total
- User identity
- Authorization

---

# 📦 Order System

A typical order lifecycle can be:

```text
CART
 ↓
PENDING
 ↓
CONFIRMED
 ↓
PROCESSING
 ↓
SHIPPED
 ↓
DELIVERED
```

Possible cancellation:

```text
PENDING / CONFIRMED
        ↓
    CANCELLED
```

Invalid state transitions should be rejected by backend business logic.

---

# 💳 Payment Architecture

A secure payment workflow should follow:

```text
Checkout
   ↓
Server Recalculates Order
   ↓
Payment Creation
   ↓
Payment Provider
   ↓
Payment Result / Webhook
   ↓
Server Verification
   ↓
Order Status Update
```

The frontend should never be trusted to declare a payment successful.

---

# 🧪 Testing Strategy

## Functional Testing

```text
[ ] Registration
[ ] Login
[ ] Logout
[ ] Product browsing
[ ] Product details
[ ] Cart
[ ] Checkout
[ ] Order creation
[ ] Profile
[ ] Address management
```

## Security Testing

```text
[ ] Unauthorized API access
[ ] Invalid JWT
[ ] Expired JWT
[ ] Cross-user data access
[ ] Rate-limit bypass
[ ] Input validation bypass
[ ] NoSQL injection
[ ] Privilege escalation
[ ] Sensitive data exposure
```

## Business Logic Testing

```text
[ ] Price manipulation
[ ] Inventory manipulation
[ ] Duplicate orders
[ ] Duplicate payment callbacks
[ ] Invalid order transitions
[ ] Coupon abuse
[ ] Quantity manipulation
```

---

# 🛡️ Security Principles

## Never Trust the Client

```text
Client
  ↓
Untrusted Input
  ↓
Validation
  ↓
Authentication
  ↓
Authorization
  ↓
Business Rules
  ↓
Database
```

## Least Privilege

Every user should have only the permissions required for their role.

## Defense in Depth

```text
Browser
 ↓
API
 ↓
Middleware
 ↓
Authentication
 ↓
Authorization
 ↓
Validation
 ↓
Business Logic
 ↓
Database
```

---

# 🌱 Scalability Direction

The monorepo architecture can evolve into:

```text
apps/
├── api
├── web
├── admin
└── seller

packages/
├── contracts
├── ui
├── config
└── validation
```

Potential future capabilities:

- Seller dashboard
- Admin dashboard
- Search service
- Recommendation system
- Notifications
- Analytics
- Delivery management
- Payment service

---

# 📦 Package Management

Bzaro uses npm workspaces.

Important commands defined by the supplied root package configuration include:

```bash
npm install
npm run dev
npm run dev:api
npm run dev:web
npm run build
npm run start
npm run clean
```

The root configuration runs the API and web development environments independently or together and provides workspace build/start/clean commands.

---

# 🔐 Environment Variables

Secrets should never be committed to Git.

Example:

```env
# API
PORT=
MONGODB_URI=
JWT_SECRET=
CORS_ORIGIN=

# Web
VITE_API_URL=
```

Local secret files should remain outside version control.

---

# 🚫 Git Security

The repository should not contain:

```text
.env
.env.local
.env.production.local
node_modules/
dist/
build/
coverage/
logs/
```

The lockfile **should be committed**:

```text
package-lock.json
```

This allows reproducible dependency installation.

---

# 📄 Recommended `.gitignore`

```gitignore
# Dependencies
node_modules/

# Build outputs
dist/
dist-ssr/
build/
out/

# Vite
.vite/

# Environment variables / secrets
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.env
*.env.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Test / coverage
coverage/
.nyc_output/

# Cache / temporary files
.cache/
.temp/
*.tmp
*.temp

# IDE / editors
.vscode/
!.vscode/extensions.json
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
Desktop.ini

# Local database files
*.sqlite
*.sqlite3
*.db

# TypeScript build info
*.tsbuildinfo
```

This extends the supplied `.gitignore`, which already excludes dependencies, build outputs, environment files, logs, and IDE/OS artifacts. 

---

# 📊 Engineering Goals

| Area | Goal |
|---|---|
| Architecture | Clear separation of responsibilities |
| Frontend | Responsive marketplace UX |
| Backend | Secure REST API |
| Database | Reliable MongoDB persistence |
| Authentication | Secure identity management |
| Authorization | Protected operations |
| Validation | Strict request validation |
| Security | Defense in depth |
| Performance | Efficient data fetching |
| Maintainability | Modular monorepo |
| Scalability | Easy future expansion |

---

# 🏆 Why Bzaro?

Bzaro is designed as more than a simple e-commerce frontend.

It combines:

```text
Modern UI
+
Dedicated Backend
+
MongoDB
+
Authentication
+
Authorization
+
Shared Contracts
+
Input Validation
+
Security Middleware
+
Rate Limiting
+
Structured Logging
+
Monorepo Architecture
```

This creates a foundation that can evolve into a larger marketplace ecosystem.

---

# 🔭 Future Scope

### Phase 1 — Core Marketplace

- Product catalog
- Categories
- Search
- Cart
- Authentication
- Checkout
- Orders

### Phase 2 — Marketplace

- Seller accounts
- Seller dashboard
- Product management
- Inventory management
- Reviews
- Wishlist

### Phase 3 — Operations

- Admin dashboard
- Order management
- Analytics
- Notifications
- Payment integration
- Delivery tracking

### Phase 4 — Scale

- Search optimization
- Caching
- Background jobs
- Observability
- CI/CD
- Automated security testing
- Service separation where necessary

---

# 👨‍💻 Expert Review Focus

| Category | Focus |
|---|---|
| Product | Marketplace usefulness |
| UX | Customer experience |
| Architecture | Monorepo and service separation |
| API | REST design and validation |
| Database | MongoDB modeling |
| Security | Authentication, authorization and middleware |
| Reliability | Business-rule enforcement |
| Maintainability | TypeScript and shared contracts |
| Scalability | Future workspace/service expansion |

---

# 📈 Project Maturity

```text
Concept
  ↓
UI Prototype
  ↓
Functional Marketplace
  ↓
Full-Stack Application
  ↓
Secure Application
  ↓
Production-Oriented Marketplace
```

The current repository architecture establishes a clear separation between the web application, backend API, and shared contracts.

---

# 📁 Final Repository Layout

```text
Bzaro/
│
├── apps/
│   ├── api/
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   │
│   └── web/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── ...
│
├── packages/
│   └── contracts/
│       ├── src/
│       ├── package.json
│       └── ...
│
├── bzaro-assets/
│   └── bzaro-logo.jpg
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

# 🎯 Conclusion

**Bzaro** is a full-stack e-commerce marketplace project built around a monorepo architecture.

Its engineering direction is based on:

> **Modern User Experience + Strong Backend Architecture + Secure Business Logic**

The project separates the frontend, API, and shared contracts while using MongoDB for persistence and a dedicated security layer around authentication, validation, rate limiting, headers, and authorization.

### Core Principles

**Functional • Secure • Maintainable • Scalable • Production-Oriented**

---

## 🚀 Project Status

**Development / Expert Review Preparation**

### Current Architecture

```text
Frontend
   │
   ▼
React + Vite
   │
   ▼
Express API
   │
   ├── Authentication
   ├── Validation
   ├── Security
   ├── Business Logic
   └── Logging
   │
   ▼
MongoDB + Mongoose
```

### Workspace Architecture

```text
Bzaro
├── apps/web
├── apps/api
└── packages/contracts
```

---

<p align="center">

## 🛒 Bzaro

### E-Commerce | Marketplace

**Built for a modern marketplace experience.**

</p>
