# Research Brief Generator

A full-stack AI-powered web application that generates structured research briefs from multiple article links.

## 🚀 Live Links

Frontend: https://researchbrief.vercel.app/

Backend: https://researchbrief-gg0i.onrender.com/

## 🧠 Features

- Paste up to 5 article links
- Fetches and cleans article content
- Generates structured research brief:
  - Summary
  - Key Points with citations
  - Conflicting claims
  - Verification checklist
  - Topic tags
- Save and view the last 5 briefs
- Clickable history
- System health status page
- Production deployment (Render + Vercel)

## 🏗 Tech Stack

Frontend:
- React (Vite)
- Axios

Backend:
- Node.js
- Express
- MongoDB (Mongoose)
- Groq LLM API

## ⚙️ Setup

### Backend

cd backend
npm install
node server.js

### Frontend

cd frontend
npm install
npm run dev

## 🔐 Environment Variables

Backend:
- GROQ_API_KEY
- MONGO_URI
- PORT

Frontend:
- VITE_API_URL
