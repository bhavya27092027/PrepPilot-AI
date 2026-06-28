![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)
![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?logo=google)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green)

# 🚀 PrepPilot AI

> **An AI-powered career preparation platform that helps students and professionals prepare for technical interviews, behavioral interviews, voice interviews, resume optimization, and job matching using Google Gemini AI.**

PrepPilot AI is an intelligent interview preparation platform designed to simulate real-world interview experiences. It combines **AI-powered mock interviews, voice interviews, resume analysis, job matching, interview history, and performance analytics** to help users improve their technical and communication skills while tracking their career growth.

---

## 🌐 Live Demo

**🔗 Live Website:**
https://prep-pilot-ai-flax.vercel.app

---

# ✨ Features

## 🤖 AI Mock Interview

* AI-generated interview questions using **Google Gemini 2.5 Flash**
* Technical, Behavioral & Mixed Interview modes
* Company-specific interview preparation
* Dynamic AI-generated follow-up questions
* Multiple difficulty levels (Beginner, Intermediate, Advanced)
* Intelligent fallback question generation

---

## 🎤 Voice Interview

* AI-powered voice interview simulation
* Natural conversation experience
* Hands-free interview practice
* Interactive speaking assessment

---

## 📄 AI Resume Analyzer

* Resume upload and analysis
* ATS-friendly resume evaluation
* Resume scoring
* AI-powered improvement suggestions
* Resume optimization recommendations

---

## 💼 AI Job Matcher

* Match resumes with suitable job roles
* AI-based skill analysis
* Personalized career recommendations
* Better job discovery

---

## 📊 AI Answer Evaluation

Each answer is evaluated using AI based on:

* Technical Accuracy
* Communication Skills
* Problem Solving
* Confidence
* Clarity
* Completeness

---

## 📈 Performance Dashboard

Track your interview journey with:

* Overall Performance
* Technical Performance
* Communication Skills
* Problem Solving Score
* Interview Statistics
* Progress Tracking
* AI Performance Insights

---

## 📚 Interview History

* Complete interview history
* Previous interview reports
* Answer review
* Performance comparison
* Progress tracking
* Learning history

---

## 📝 AI Interview Report

After every interview PrepPilot AI generates:

* Overall Score
* Technical Score
* Communication Score
* Problem Solving Score
* Strengths
* Weaknesses
* Personalized Learning Plan
* Recommended Learning Resources
* AI-generated Feedback

---

## 🏢 Company-Specific Preparation

Practice interviews for top companies including:

* Google
* Amazon
* Microsoft
* Meta
* Adobe
* Uber
* Flipkart
* Zomato
* General

---

## 💻 Supported Domains

* Data Structures & Algorithms
* React.js
* Node.js
* System Design
* Machine Learning
* Product Strategy
* Behavioral Interviews

---

## 🔐 Authentication

* Email & Password Login
* Google OAuth Login
* Secure Session Management
* Supabase Authentication

---

# 🛠 Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* shadcn/ui
* Lucide React

### Backend

* Supabase
* PostgreSQL
* Supabase Authentication
* Row Level Security (RLS)
* Supabase Edge Functions

### Artificial Intelligence

* Google Gemini 2.5 Flash

### Deployment

* Vercel

---

# 🏗 System Architecture

```text
                 React + TypeScript
                         │
                         ▼
                 Supabase Authentication
                         │
                         ▼
                 PostgreSQL Database
                         │
                         ▼
            Supabase Edge Functions
                         │
                         ▼
                 Google Gemini AI
```

---

# 📂 Project Structure

```text
PrepPilot-AI/
│
├── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── types/
│   └── App.tsx
│
├── supabase/
│   ├── functions/
│   │      └── gemini/
│   └── migrations/
│
├── public/
├── package.json
├── .env.example
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/bhavya27092027/PrepPilot-AI.git

cd PrepPilot-AI
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL

VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

> **Note:** Google Gemini API keys are securely stored using **Supabase Edge Function Secrets** and are never exposed to the frontend.

---

## Start Development Server

```bash
npm run dev
```

---

## Build for Production

```bash
npm run build
```

---

# 🔒 Security Features

* Secure Authentication with Supabase Auth
* Google OAuth Integration
* Row Level Security (RLS)
* Gemini API secured through Supabase Edge Functions
* API keys are never exposed to the client
* Secure database access
* Protected user-specific interview data

---

# 📊 AI Workflow

```text
User Login
      │
      ▼
Choose Interview Type
      │
      ▼
AI Question Generation
      │
      ▼
Candidate Response
      │
      ▼
Gemini AI Evaluation
      │
      ▼
Performance Analysis
      │
      ▼
AI Report Generation
      │
      ▼
Dashboard & Interview History
```

---

# 🚀 Future Enhancements

* Live Coding Playground
* AI Interview Coach
* Video Interview Analysis
* Personalized Career Roadmap
* Company-wise Analytics
* Mock Interview Leaderboard
* Recruiter Dashboard

---

# 👨‍💻 Author

**Bhavya Jain**

**GitHub:**
https://github.com/bhavya27092027

**LinkedIn:**
https://www.linkedin.com/in/bhavyajain-fullstack/

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

---

# 📄 License

This project is licensed under the **MIT License**.
