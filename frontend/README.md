# Style Era - Full-Stack Fashion & AI Style Assistant

**Style Era** is a modern full-stack web application designed to provide personalized fashion recommendations, AI-powered styling advice, and interactive clothing management across different user preferences.

---

🌐 Live Deployments
Live Frontend: Style Era (Vercel)

Live Backend API: Style Era API (Render)

## ✨ Features & Functionalities

* **User Authentication:** Secure registration and login system with token-based authentication and Google OAuth support.
* **Fashion Catalog Management:** Browse, filter, and manage trendy fashion collections and clothing items.
* **AI Style Advisor:** Integrated AI-powered assistant to provide personalized outfit suggestions and styling advice.
* **Responsive Dashboard:** Fully responsive user interface optimized for seamless mobile and desktop experiences.
* **Health Check & Mock Fallback:** Robust backend error-handling with built-in database status tracking.

---

## 🛠️ Tech Stack & Frameworks

Here are the core technologies and frameworks used to build this project:

<p>
  <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

---

## 📂 Project Structure

```text
style-era/
├── frontend/             # Next.js Frontend Application (Vercel)
│   ├── src/
│   │   ├── app/          # App Router & Pages
│   │   ├── components/   # Reusable UI components
│   │   └── lib/          # API helpers and utilities
│   └── package.json
│
└── backend/              # Express.js Backend Application (Render)
    ├── src/
    │   ├── config/       # Database & Store configurations
    │   ├── models/       # Mongoose Schemas & Data Models
    │   ├── routes/       # API Endpoints (Auth, Items, AI)
    │   └── server.ts     # Main server entry point
    └── package.json


⚙️ Environment Variables Note
Security Notice: For security reasons, actual .env credentials and API keys are not displayed in this repository.

To run this project locally, you need to create your own .env files in both the frontend and backend folders using local placeholders (e.g., PORT, MONGODB_URI, JWT_SECRET, NEXT_PUBLIC_API_BASE_URL).

 How to Run Locally

1. Clone the Repository
git clone [https://github.com/Nishitasarker/Style-Era.git](https://github.com/Nishitasarker/Style-Era.git)
cd Style-Era

2. Setup Backend
cd backend
npm install
# Create a .env file with your local configurations (Port, MongoDB URI, etc.)
npm run dev

3. Setup Frontend
# Open a new terminal
cd frontend
npm install
# Create a .env.local file with your frontend environment variables
npm run dev

