# XIS Image Analytics Platform

A full-stack image analytics platform built with the MERN stack. Users can register, log in, upload images with labels, and view powerful analytics — including total counts, per-day graphs, per-label breakdowns, and date-based filtering.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Docker Setup](#docker-setup)
- [Design Decisions](#design-decisions)
- [Assumptions & Limitations](#assumptions--limitations)

---

## Project Overview

XIS Image Analytics Platform allows authenticated users to:

- Upload images with custom labels to Cloudinary
- View a personal dashboard with analytics
- Filter images by date
- See total image count, per-day trends, and per-label breakdowns

Every user's data is **private** — users only see their own images and analytics.

---

## Key Features

- JWT-based authentication (register & login)
- Cloudinary image upload with automatic local file cleanup
- Analytics dashboard with bar and pie charts
- Date-based image filtering
- Pagination on image listing
- Error states and loading states throughout the UI
- Protected routes (unauthorized users redirected to login)

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React + Vite, Tailwind CSS, Recharts |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB (MongoDB Atlas)             |
| Auth      | JWT + bcrypt                        |
| Storage   | Cloudinary                          |
| Validation| Joi                                 |
| Container | Docker + Docker Compose             |

---

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND (React)               │
│  Login → Dashboard → Images → Filter by Date   │
└────────────────────┬────────────────────────────┘
                     │ HTTP Requests (Axios)
                     │ Authorization: Bearer <token>
┌────────────────────▼────────────────────────────┐
│              BACKEND (Express.js)               │
│                                                 │
│  /api/auth      → Register, Login, My Info      │
│  /api/images    → Upload, Get (paginated)       │
│  /api/analytics → Count, By Date, By Label,    │
│                   Filter by Date                │
└──────────┬──────────────────────┬───────────────┘
           │                      │
┌──────────▼──────┐    ┌──────────▼──────────────┐
│  MongoDB Atlas  │    │       Cloudinary         │
│  Users + Images │    │  Image Storage (Cloud)   │
└─────────────────┘    └──────────────────────────┘
```

**Request Flow:**
1. User logs in → receives JWT token
2. Token stored in cookies
3. Every protected request sends token in `Authorization` header
4. Backend middleware verifies token → extracts `userId`
5. All queries filtered by `userId` (users see only their data)

---

## Database Schema

### Users Collection

```json
{
  "_id": "ObjectId",
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (hashed with bcrypt)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Images Collection

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users) — which user uploaded this",
  "originalName": "string — original file name",
  "size": "number — file size in bytes (provided by Multer)",
  "label": "string — user-defined category (default: uncategorized)",
  "url": "string — Cloudinary secure URL",
  "publicId": "string — Cloudinary public ID (for deletion)",
  "createdAt": "Date — used for date-based analytics",
  "updatedAt": "Date"
}
```

**Key design note:** The image file itself is NOT stored in MongoDB. Only metadata is stored. The actual file lives on Cloudinary, and `url` points to it.

---

## Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ahmedullahmern/Image-Analytics.git
cd Image-Analytics
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (see [Environment Variables](#environment-variables)).

```bash
node server.js
# Server running on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App running on http://localhost:5173
```

---

## Environment Variables

Create `backend/.env` with the following:

```env
PORT=5000

# MongoDB Atlas
DB_USER=your_mongo_username
DB_PASS=your_mongo_password
DB_NAME=your_database_name

# JWT
AUTH_SECRET=your_jwt_secret_key

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

---

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Response Format
All responses follow this structure:
```json
{
  "error": false,
  "data": { },
  "msg": "Success message"
}
```

---

### Auth Routes

#### POST `/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "Ahmed",
  "email": "ahmed@gmail.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "error": false,
  "data": {
    "newUser": { "name": "Ahmed", "email": "ahmed@gmail.com" },
    "token": "eyJhbGc..."
  },
  "msg": "User Register successfully"
}
```

---

#### POST `/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "ahmed@gmail.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "error": false,
  "data": {
    "user": { "name": "Ahmed", "email": "ahmed@gmail.com" },
    "token": "eyJhbGc..."
  },
  "msg": "User Login successfully"
}
```

---

#### GET `/auth/myInfo`
Get logged-in user's info. **Protected.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "error": false,
  "data": { "name": "Ahmed", "email": "ahmed@gmail.com" },
  "msg": "User fetched Successfully"
}
```

---

### Image Routes (All Protected)

**Headers required for all:**
```
Authorization: Bearer <token>
```

#### POST `/images/upload`
Upload an image.

**Body:** `form-data`
| Key   | Type | Value              |
|-------|------|--------------------|
| image | File | Select image file  |
| label | Text | e.g. "nature"      |

**Response:**
```json
{
  "error": false,
  "data": {
    "_id": "...",
    "userId": "...",
    "originalName": "photo.jpg",
    "size": 245000,
    "label": "nature",
    "url": "https://res.cloudinary.com/...",
    "publicId": "xis-images/abc123"
  },
  "msg": "Image uploaded successfully"
}
```

---

#### GET `/images?page=1&limit=8`
Get paginated list of user's images.

**Query Params:**
- `page` (default: 1)
- `limit` (default: 10)

**Response:**
```json
{
  "error": false,
  "data": {
    "images": [ ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 8,
      "totalPages": 4
    }
  },
  "msg": "Images fetched successfully"
}
```

---

### Analytics Routes (All Protected)

#### GET `/analytics/count`
Total image count for the logged-in user.

**Response:**
```json
{
  "error": false,
  "data": { "total": 42 },
  "msg": "Total count fetched successfully"
}
```

---

#### GET `/analytics/by-date`
Images grouped by upload date.

**Response:**
```json
{
  "error": false,
  "data": [
    { "_id": "2024-01-15", "count": 5 },
    { "_id": "2024-01-16", "count": 3 }
  ],
  "msg": "Images by date fetched successfully"
}
```

---

#### GET `/analytics/by-label`
Images grouped by label.

**Response:**
```json
{
  "error": false,
  "data": [
    { "_id": "nature", "count": 10 },
    { "_id": "cars", "count": 5 }
  ],
  "msg": "Images by label fetched successfully"
}
```

---

#### GET `/analytics/filter?date=2024-01-15`
Get all images uploaded on a specific date.

**Query Params:**
- `date` — format: `YYYY-MM-DD` (required)

**Response:**
```json
{
  "error": false,
  "data": [ ],
  "msg": "Images filtered successfully"
}
```

---

## Docker Setup

### Prerequisites
- Docker Desktop installed

### Files Structure
```
Image-Analytics/
├── backend/
│   └── Dockerfile
├── frontend/
│   └── Dockerfile
└── docker-compose.yml
```

### backend/Dockerfile
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### frontend/Dockerfile
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

### docker-compose.yml (root folder)
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    env_file:
      - ./backend/.env

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

### Run with Docker
```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down
```

After running, access:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## Design Decisions

### 1. Cloudinary for Image Storage
Instead of storing images locally, Cloudinary is used. This means images persist across server restarts and work in any environment including Docker. Local temp files are deleted immediately after Cloudinary upload.

### 2. JWT Authentication
JWT tokens are stored in browser cookies using `js-cookie`. The token is sent with every protected request via the `Authorization: Bearer` header. Token expiry is set to 7 days.

### 3. userId Filtering
Every image is stored with a `userId` reference. All queries — images, analytics, filters — are scoped to `req.user.id` extracted from the JWT. This ensures users never see each other's data.

### 4. MongoDB Aggregation for Analytics
Analytics endpoints use MongoDB's aggregation pipeline with `$match`, `$group`, and `$sort` stages. `$match` always filters by `userId` first so results are always user-specific.

### 5. Pagination
The images endpoint supports `page` and `limit` query parameters with `skip()` and `limit()` on the Mongoose query, keeping responses fast even with large datasets.

---

## Assumptions & Limitations

- Only image files are accepted (JPG, PNG, WEBP) — validated via Multer's `fileFilter`
- Labels are free-text — no predefined categories enforced
- No image deletion feature in current version
- Date filtering is based on `createdAt` timestamp in UTC — timezone differences may affect results
- MongoDB Atlas free tier has 512MB storage limit
- Cloudinary free tier has 25GB bandwidth/month

---

## Author

**Ahmed**
GitHub: [ahmedullahmern](https://github.com/ahmedullahmern)
Repository: [Image-Analytics](https://github.com/ahmedullahmern/Image-Analytics)
