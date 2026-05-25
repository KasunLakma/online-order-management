# OrderFlow - Online Business Order Management System

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Backend-Express.js%205-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%207-blue?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Neon](https://img.shields.io/badge/Database-Serverless%20PostgreSQL%20(Neon)-00e599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)

OrderFlow is a cloud-based, full-stack order and inventory management solution tailored specifically for online sellers utilizing social media platforms (Facebook, Instagram, WhatsApp, TikTok) and websites. Built with high-performance frameworks and clean architectures, the system integrates robust security, real-time inventory adjustments, interactive sales visualization, and professional invoicing capabilities.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router structure)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Dark-themed glassmorphism system)
- **Charts**: Recharts (with hydration mismatch mitigation)

### Backend
- **Runtime & Router**: Node.js, Express.js 5
- **Language**: TypeScript (strongly typed Request/Response models)
- **ORM**: Prisma ORM 7
- **Auth**: JSON Web Tokens (JWT) & bcryptjs encryption

### Database
- **Engine**: Serverless PostgreSQL hosted on [Neon.tech](https://neon.tech/)

---

## ⚡ 100% Completed Features Checklist

- [x] **Role-Based Access Control (RBAC)**: Secure access restricted to `ADMIN` and `MANAGER` roles. Strict endpoint authorization middlewares inspect roles on the API layer.
- [x] **Staff Management**: Admins have view-and-write permissions to manage Manager accounts (create new credentials, list staff) while non-admins are restricted on the UI and API levels.
- [x] **Interactive Analytics Dashboard**: Beautiful dark-mode graphs utilizing Recharts (Monthly Sales Line Chart, Order Status Distribution Donut Chart, and Best-Selling Products Bar Chart) that run dynamically on the client.
- [x] **Core Inventory Logic**: Dynamic Category & Product data grid tables supporting automated SKU checks, SKU unique validation, and relational lookups.
- [x] **Automatic Stock Deduction**: Multi-product transactional checkout that auto-calculates totals and discounts, decrements inventory stock levels atomically, and blocks transactions if order requests exceed available stock.
- [x] **Order Source Tracking**: Segregates order pipelines based on marketing channels: `Facebook`, `Instagram`, `TikTok`, `WhatsApp`, `Website` (Web), and `Walk-in` (Cash/POS).
- [x] **Status Transition Workflow**: Dynamic state progression panels allowing staff to move orders between `NEW`, `PACKAGING`, `DELIVERED`, `COMPLETED`, `RETURNED`, and `CANCELED`.
- [x] **Automatic Restocking**: Cancelling or returning an order automatically initiates a database transaction that increments the product quantity back into stock.
- [x] **Invoicing Matrix**: Premium interactive Modal view displaying business metadata, customer reference data, line items, and discounts with a browser print print-to-PDF template.
- [x] **Advanced Financial Reports**: Tab-based modular reporting for Sales summaries, Orders status count ratios, and Customer metrics with placeholder download buttons for CSV, Microsoft Excel, and PDF formats.

---

## 📂 Database Blueprint (Prisma Schema Snippet)

Below are the Prisma schemas representing the `User` (RBAC) and `Product` (Inventory) entities, mapping exactly to our cloud database tables.

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  roleId    Int      @map("role_id")
  role      Role     @relation(fields: [roleId], references: [id])
  createdAt DateTime @default(now()) @map("created_at")
  orders    Order[]

  @@map("users")
}

model Product {
  id         Int         @id @default(autoincrement())
  name       String
  sku        String      @unique
  categoryId Int         @map("category_id")
  category   Category    @relation(fields: [categoryId], references: [id])
  price      Decimal
  quantity   Int         @default(0)
  image      String?
  status     String      @default("ACTIVE")
  orderItems OrderItem[]

  @@map("products")
}
```

---

## 🛠️ Step-by-Step Installation & Setup

Follow these commands to clone, configure, and launch the application in your local environment.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and [npm](https://www.npmjs.com/) installed.

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/KasunLakmal/online-order-management.git
cd online-order-management

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Parameters

Create a `.env` file in the root of the `backend` folder:

```env
PORT=5000
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
JWT_SECRET="super-secret-key-change-me-for-production"
```

### 3. Database Migration & Seeding

Sync the Prisma schema directly with the Neon PostgreSQL database and seed the system's default users.

```bash
cd ../backend

# Push the database schema
npx prisma db push

# Seed default accounts (creates ADMIN and MANAGER users)
npx prisma db seed
```

*Seeded credentials:*
- **Admin**: `admin@example.com` / `admin123`
- **Manager**: `manager@example.com` / `manager123`

### 4. Running the Application

Launch both the backend and frontend dev servers.

#### Start the Backend (Port 5000)
```bash
cd backend
npm run dev
```

#### Start the Frontend (Port 3000)
```bash
cd frontend
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to access the login page.

---

## 📝 Project Metadata

- **Prepared For**: Pixzora LABS (Pvt) Ltd
- **Developer**: Kasun Lakmal
- **Project Status**: 100% Completed & Tested
