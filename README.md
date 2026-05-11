# Ecommerce-Lite

A full-stack ecommerce application with a Next.js frontend and a Node.js backend, where users can register as buyers or sellers.

## Features
- Separate login and registration for buyers and sellers
- Role-based access control
- Product listing and management
- Product details with images and descriptions
- Product search and filtering (Backend is ready. Soon will be added to the front too.)
- Add to cart and order placement
- Order history and tracking
- Seller dashboard for managing products and sales
- Profile management for users
- Image upload support
- Secure authentication using JWT and bcrypt

## Tech Stack
- Next.js for frontend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- multer
- dotenv
- cors

## Project Structure
mainFolder/
├── ecommerce/
└── backend/

# Setup Instructions
- clone:
    `git clone origin https://github.com/amirmohammadabdi/ecommerce-lite`
    `cd mainFolder`
- Frontend: 
    `cd ecommerce`
    `npm install`
- Backend:
    `cd backend`
    `npm install`

# Environment Variables
- Create .env.local for the fonrtend. Create .env for the backend.
- .env.local contains:
    NEXT_PUBLIC_BACKEND_URL=http://backend_url
- .env contains:
    MONGODB_URI=mongodb_url
    JWT_SECRET=long_jwt_secret_key
    EXPIRES_IN=jwt_expiration_time
    PORT=port_like_8000

# Running the Project
- Backend:
    `cd backend`
    `npm run start`
- Front:
    `cd ecommerce`
    `npm run dev`

# Build for Production
- Frontend:
    `cd ecommerce`
    `npm run build`