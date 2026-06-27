# 🏡 EstateQuest

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> A modern full-stack real estate marketplace where users can **discover**, **list**, and **connect** — all in one elegant platform. 🔑

---

## ✨ Features

- 🔐 **Authentication** — Email/password sign-up & Google OAuth via Firebase
- 🏠 **Property Listings** — Create, edit, and delete rent or sale listings with full details
- 🖼️ **Image Uploads** — Multi-image upload powered by Cloudinary CDN
- 🔍 **Smart Search** — Filter listings by type, amenities, price, and sort order
- 💰 **Offer Pricing** — Support for regular price and discounted offer price
- 🛋️ **Amenity Tags** — Furnished, parking, bedrooms, and bathrooms details
- 👤 **User Profiles** — Manage your account and view all your listings
- 📱 **Responsive Design** — Mobile-first UI with smooth animations via Framer Motion
- 🎠 **Image Carousel** — Swiper-powered photo gallery on each listing page

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| ⚛️ Frontend | React 18, React Router DOM v6, Redux Toolkit, Redux Persist |
| 🎨 UI | Tailwind CSS, MUI (Material UI), Framer Motion, React Icons |
| 🔥 Auth | Firebase (Google OAuth + Email) |
| 🖥️ Backend | Node.js, Express.js |
| 🗄️ Database | MongoDB, Mongoose ODM |
| ☁️ Media | Cloudinary (image upload & CDN) |
| 🔒 Security | bcryptjs (password hashing), JWT (cookie-based sessions) |
| ⚡ Build | Vite, ESLint |

---

## 📁 Project Structure

```
EstateQuest/
├── 📂 api/                     # Express backend
│   ├── controllers/            # Route logic (auth, user, listing, upload)
│   ├── models/                 # Mongoose schemas (User, Listing)
│   ├── routes/                 # API route definitions
│   └── utils/                  # JWT verification, Cloudinary config, error handler
│
├── 📂 client/                  # Vite + React frontend
│   └── src/
│       ├── pages/              # Home, SignIn, SignUp, Profile, Listing, Search…
│       ├── components/         # Header, PrivateRoute, shared UI
│       ├── App.jsx             # Root router
│       └── firebase.js         # Firebase initialisation
│
└── package.json                # Backend dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Firebase project (for auth)
- Cloudinary account (for image uploads)

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/EstateQuest.git
cd EstateQuest
```

### 2️⃣ Configure environment variables

**Backend** — create `/api/.env` (or root `.env`):

```env
MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend** — create `client/.env`:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3️⃣ Install dependencies

```bash
# Backend
npm install

# Frontend
cd client && npm install
```

### 4️⃣ Run the app

```bash
# Backend (from root) — runs on http://localhost:3000
npm run dev

# Frontend (from /client) — runs on http://localhost:5173
npm run dev
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/signin` | Sign in & receive JWT cookie |
| `POST` | `/api/auth/google` | Google OAuth sign-in |
| `POST` | `/api/auth/signout` | Clear session cookie |
| `GET` | `/api/user/:id` | Get user profile |
| `POST` | `/api/user/update/:id` | Update user profile 🔒 |
| `DELETE` | `/api/user/delete/:id` | Delete account 🔒 |
| `GET` | `/api/user/listings/:id` | Get user's listings 🔒 |
| `POST` | `/api/listing/create` | Create a listing 🔒 |
| `POST` | `/api/listing/update/:id` | Update a listing 🔒 |
| `DELETE` | `/api/listing/delete/:id` | Delete a listing 🔒 |
| `GET` | `/api/listing/get/:id` | Get single listing |
| `GET` | `/api/listing/get` | Search & filter listings |
| `POST` | `/api/upload` | Upload images to Cloudinary 🔒 |

> 🔒 Protected routes require a valid JWT cookie.

---




