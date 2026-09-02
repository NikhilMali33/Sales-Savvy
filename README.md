# Sales-Savvy

A full-stack e-commerce platform with separate customer and admin experiences, built with Spring Boot and React. Customers can browse products, manage a cart, and check out with real payment processing via Razorpay; admins get a dedicated panel to manage products, categories, orders, and users, backed by a sales dashboard.

## Features

**Customer**
- Registration and login with JWT authentication
- Password reset via email OTP verification
- Product browsing, search, and category filtering
- Cart management (add, update quantity, remove)
- Checkout with Razorpay payment integration and signature verification
- Order history and order detail views
- Profile management

**Admin**
- Role-based access control, isolated from customer routes
- Product CRUD with image uploads (Cloudinary)
- Category management
- Order management — view all orders, update order status
- User management — view all users and their order history
- Sales dashboard with revenue, order, and low-stock metrics (Recharts)

**Cross-cutting**
- Centralized exception handling with domain-specific exceptions (`PaymentException`, `OrderException`, `InsufficientStockException`, etc.) mapped to correct HTTP status codes
- Stock re-validation at payment time to prevent overselling
- Accessibility-focused frontend: visible error/success states, confirmation dialogs, and semantic structure across auth and admin flows

## Tech Stack

**Backend:** Java 17, Spring Boot 3.5.5, Spring Security, Spring Data JPA, MySQL, JWT (jjwt), Razorpay Java SDK, Cloudinary SDK, Spring Mail

**Frontend:** React 19, Vite, React Router, Axios, Recharts, Lucide React

## Architecture

The backend follows a layered architecture throughout:

```
Controller → Service (interface) → ServiceImpl → Repository
```

Admin and customer concerns are separated at the controller level (`controllers/admin/**` vs `controllers/**`), each backed by their own service pairs, with `SecurityConfig` enforcing `hasRole("ADMIN")` on all `/api/admin/**` routes. Request/response DTOs keep the API contract independent of JPA entities.

The frontend mirrors this split with separate `pages/admin/` and `pages/customer/` trees, a `ProtectedRoute` component gating authenticated routes, and a service layer (`services/*.js`) that maps directly to backend controllers.

## Project Structure

```
Sales-Savvy/
├── SalesSavvy-Backend/          # Spring Boot API
│   └── src/main/java/com/salessavvy/app/
│       ├── controllers/         # REST endpoints (customer + admin/)
│       ├── services/            # Service interfaces
│       ├── serviceImplementation/
│       ├── repositories/        # Spring Data JPA repositories
│       ├── entities/            # JPA entities
│       ├── dto/                 # request/ and response/ DTOs
│       ├── exception/           # domain exceptions + GlobalExceptionHandler
│       └── config/              # Security, JWT filter, Cloudinary, Razorpay
└── sales-savvy-frontend/        # React + Vite SPA
    └── src/
        ├── pages/                # auth/, customer/, admin/
        ├── components/           # shared + layout components
        ├── services/             # API client layer (axios)
        └── styles/
```

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- A Razorpay account (test mode is fine) and a Cloudinary account

### Backend setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE salessavvy;
   ```
2. Copy `.env.example` to `.env` (or export the variables directly) and fill in your values:
   ```
   DB_URL=jdbc:mysql://localhost:3306/salessavvy
   DB_USERNAME=your_database_username
   DB_PASSWORD=your_database_password
   JWT_SECRET=your_jwt_secret
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_gmail_app_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
3. Run the backend:
   ```bash
   cd SalesSavvy-Backend
   ./mvnw spring-boot:run
   ```
   The API starts on `http://localhost:8080`.

### Frontend setup

```bash
cd sales-savvy-frontend
npm install
npm run dev
```
The app starts on `http://localhost:5173` (the backend's CORS config is set up for this origin).

## API Overview

| Area | Base path | Access |
|---|---|---|
| Auth | `/api/auth/**` | Public |
| Users | `/api/users/**` | Public (register) / Authenticated |
| Products | `/api/products/**` | Public (read) |
| Categories | `/api/categories/**` | Public (read) |
| Cart | `/api/cart/**` | Authenticated |
| Orders | `/api/orders/**` | Authenticated |
| Payment | `/api/payment/**` | Authenticated |
| Admin | `/api/admin/**` | Role: `ADMIN` |