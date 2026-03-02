# 🛒 TapCart - Full-Stack Cross-Platform E-Commerce Solution

> **TapCart is a production-ready, full-stack e-commerce solution. It
> features a high-performance React Native (Expo) mobile app for
> customers and a powerful MERN admin dashboard for management. Built
> with scalability in mind, it includes secure authentication, Stripe
> payments, real-time push notifications, and background job
> processing.**

---

## 🚀 Features

### 📱 Mobile App (Customer Facing)

- **Fully Functional E-Commerce Mobile App:** Built with **React
  Native** & **Expo** for a smooth, native experience.
- **Secure Authentication:** Powered by **Clerk** (supporting Google &
  Apple sign-in).
- **Complete Shopping Flow:** Includes Product Browsing, Cart
  Management, Checkout, and Order History.
- **Smart Features:** Favorites/Wishlist system, Address Management,
  and Product Image Sliders.
- **Real-Time Updates:** **Push Notifications** for order status
  updates.
- **Performance:** Fast data fetching & caching using **TanStack
  Query**.

### 🏪 Admin Dashboard (Management)

- **Comprehensive Dashboard:** View live analytics, sales stats, and
  customer insights.
- **Product Management:** Full CRUD operations for products (Create,
  Read, Update, Delete), including image handling and pricing.
- **Order Management:** Track and update order statuses (Pending, Processing,
  Shipped, Delivered, Cancelled).
- **Customer Management:** View and manage registered users.
- **Security:** **Admin-Only Protected Routes** ensuring sensitive
  data is safe.

### ⚙️ Backend & Infrastructure

- **Robust REST API:** Built with **Node.js** & **Express**, featuring
  Role-Based Access Control (RBAC).
- **Payments:** Integrated **Stripe** for secure payment processing.
- **Background Jobs:** Handled by **Inngest** for reliable
  asynchronous tasks.
- **Image Storage:** Optimized image handling with **Cloudinary**.
- **Deployment Ready:** Configured for seamless deployment on
  **Vercel** (API + Admin Dashboard).

---

## 🛠️ Tech Stack

- **Frontend (Mobile):** React Native, Expo, NativeWind (Tailwind CSS)
- **Frontend (Admin):** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** Clerk
- **Payments:** Stripe
- **State Management / Fetching:** TanStack Query (React Query)
- **Background Jobs:** Inngest
- **Image Storage:** Cloudinary

---

## 🧪 Environment Setup

Create a `.env` file in each corresponding directory and add the
following keys.

### 🟦 Backend (`/backend/.env`)

```env
NODE_ENV=development
PORT=5000  # Make sure this matches your frontend API calls!
DB_URL=<YOUR_MONGODB_CONNECTION_STRING>

# Auth (Clerk)
CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>
CLERK_SECRET_KEY=<YOUR_CLERK_SECRET_KEY>

# Payments (Stripe)
STRIPE_PUBLISHABLE_KEY=<YOUR_STRIPE_PUBLISHABLE_KEY>
STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>
STRIPE_WEBHOOK_SECRET=<YOUR_STRIPE_WEBHOOK_SECRET>

# Images (Cloudinary)
CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>

# Background Jobs (Inngest)
INNGEST_SIGNING_KEY=<YOUR_INNGEST_SIGNING_KEY>

# Admin Config
ADMIN_EMAIL=<YOUR_ADMIN_EMAIL>
CLIENT_URL=http://localhost:5173
```

### 🟩 Admin Dashboard (`/admin/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_EMAIL=<YOUR_ADMIN_EMAIL>
```

### 🟧 Mobile App (`/mobile/.env`)

> Note: Replace `<YOUR_IP>` with your computer's local IP address (e.g.,
> 192.168.1.33) to allow your phone to connect to the backend.

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>
EXPO_PUBLIC_API_URL=http://<YOUR_IP>:5000/api
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=<YOUR_STRIPE_PUBLISHABLE_KEY>
```

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1️⃣ Run the Backend

```bash
cd backend
npm install
npm run dev
# Server should be running on http://localhost:5000
```

### 2️⃣ Run the Admin Dashboard

```bash
cd admin
npm install
npm run dev
# Admin dashboard should be running on http://localhost:5173
```

### 3️⃣ Run the Mobile App

```bash
cd mobile
npm install
npx expo start
```

Download the Expo Go app on your iOS or Android device.\
Scan the QR code displayed in the terminal.

(Optional) For a production-like experience with Native Modules (Notifications), run:

```bash
npx expo start --dev-client
```
