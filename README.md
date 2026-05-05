Admin Dashboard - Next.js
📋 Project Overview

A modern admin dashboard built using Next.js 14, Material UI (MUI), Zustand, and DummyJSON API.
This project includes authentication, user management, product listing, and responsive UI.

✨ Features Implemented
🔐 ### Authentication Module
Login using DummyJSON API
Token stored in localStorage + Zustand
Protected dashboard routes

### 👥 Users Management
Users list with table view
Pagination support
Search functionality
Single user detail page

### 📦 Products Management
Responsive product grid
Pagination
Search functionality
Category filter dropdown
Product detail page with image carousel

### 🎨 UI / UX
Built with Material UI
Fully responsive design
Loading and error states
Clean and modern layout
### 🛠 Tech Stack
Framework: Next.js 14 (App Router)
UI Library: Material UI (MUI v5)
State Management: Zustand
Authentication: NextAuth.js
API: DummyJSON
HTTP Client: Axios
### 📦 Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/your-username/nextjs-admin-dashboard.git
cd nextjs-admin-dashboard
2️⃣ Install Dependencies
npm install
3️⃣ Environment Setup

Create .env.local file:

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
4️⃣ Run Project
npm run dev

👉 Open: http://localhost:3000

🔐 Login Credentials

Use DummyJSON test user:

Username: kminchelle
Password: 0lelplR
📁 Project Structure
src/
 ├── app/
 │   ├── login/
 │   ├── dashboard/
 │   │   ├── users/
 │   │   ├── products/
 │   │   └── page.tsx
 ├── store/
 ├── services/
 ├── components/
### 🔗 API Endpoints Used
Authentication
POST /auth/login
Users
GET /users
GET /users/search?q=...
GET /users/{id}
Products
GET /products
GET /products/search?q=...
GET /products/category/{slug}
GET /products/{id}

### 🚀 How It Works
 --User logs in using DummyJSON API
--Token saved in localStorage + Zustand
Protected routes restrict dashboard access
Data fetched from API
### 
UI rendered using MUI
### 🐛 Common Issues
❌ Login resets after refresh

➡️ Store token in localStorage

❌ Category filter not working

➡️ Use category slug instead of object

❌ Product detail fetch error

➡️ Ensure id is valid string

📄 Build & Run (Production)
npm run build
npm start