# OmniScholar

**The universe of knowledge, mapped for you.**

OmniScholar is a full-stack Learning Management System (LMS) built with the MERN stack, designed for teachers to manage courses and assignments, and for students to learn, submit work, and track their progress — all through a clean, purpose-built interface.

🔗 **Live Demo:** [omnischolar.vercel.app](https://omnischolar.vercel.app)
🔗 **API:** [omnischolar.onrender.com](https://omnischolar.onrender.com)

---

## ✨ Features

### Authentication & Authorization
- JWT-based authentication with secure password hashing
- Role-based access control (Teacher / Student)
- Protected routes on both frontend and backend

### Course Management
- Teachers can create, edit, and delete courses with modules and lessons
- Students can browse, search, filter, and enroll in courses
- Rich course detail pages with learning objectives, prerequisites, and resources

### Assignments & Submissions
- Teachers create assignments with deadlines, rubrics, and attachments
- Students submit work via file upload or text, with automatic late detection
- Transparent, rubric-based grading with instructor feedback

### Dashboards
- Role-specific dashboards with real-time stats
- Teachers: course overview, student counts, submission queue
- Students: enrolled courses, pending assignments, recent grades

### File Management
- Secure file uploads and downloads using MongoDB GridFS

### Profile
- Editable user profiles with skills, bio, and academic details

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- shadcn/ui (Radix UI primitives)
- React Router
- Axios
- Lucide Icons

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- GridFS for file storage

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 📁 Project Structure

```
omnischolar/
├── backend/
│   ├── config/          # Database & GridFS configuration
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth & role-based access control
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions (JWT, etc.)
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── assets/       # Logo, images
    │   ├── components/   # Reusable UI components
    │   ├── context/      # Auth context
    │   ├── lib/          # API client
    │   ├── pages/        # Page-level components
    │   └── App.jsx
    └── index.html
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run the server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```
VITE_API_URL=http://localhost:5000/api
```

Run the app:

```bash
npm run dev
```

---

## 🎨 Design Philosophy

OmniScholar's visual identity is built around the concept of a **"universe of knowledge"** — courses, modules, and progress are represented as constellations, with a consistent teal, navy, and gold color system across the product. The interface draws inspiration from Notion, Linear, and Coursera: minimal, focused, and premium without being flashy.

---

## 🗺️ Roadmap (v0.2+)

- [ ] Cloudinary integration for optimized media storage
- [ ] Quiz module
- [ ] Certificate generation
- [ ] Real-time notifications
- [ ] Discussion forums
- [ ] AI-powered learning recommendations

---

## 📄 License

This project is currently a personal/portfolio project and is not licensed for commercial redistribution.

---

## 👤 Author

Built solo by Sunita Satpathy as a full-stack learning project — from backend architecture to frontend design, deployed end-to-end.

