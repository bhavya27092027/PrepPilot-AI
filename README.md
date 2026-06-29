# 🚀 PrepPilot AI

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)
![Gemini](https://img.shields.io/badge/Google-Gemini%202.5%20Flash-4285F4?logo=google)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify)
![License](https://img.shields.io/badge/License-MIT-green)

> **An AI-powered interview preparation and career assistant platform that helps students and professionals practice interviews, analyze resumes, match jobs, and improve communication skills using Google Gemini AI.**

---

# 🌐 Live Demo

### 🔗 Live Website

https://preppilot-ai.netlify.app

### 💻 GitHub Repository

https://github.com/bhavya27092027/PrepPilot-AI

---

# ✨ Key Features

## 🤖 AI Mock Interviews

* AI-generated interview questions using **Google Gemini 2.5 Flash**
* Technical, Behavioral and Mixed interview modes
* Company-specific interview preparation
* Dynamic follow-up questions
* Beginner, Intermediate and Advanced difficulty levels
* Personalized AI interview experience

---

## 🎙 AI Voice Interview

* Real-time voice interview simulation
* Hands-free interview practice
* Interactive speaking assessment
* Natural conversational interview flow

---

## 📄 AI Resume Analyzer

* Resume upload and parsing
* ATS compatibility analysis
* Resume quality score
* Section-wise feedback
* AI-powered resume improvement suggestions
* Professional optimization recommendations

---

## 💼 AI Resume Job Matcher

* Resume vs Job Description matching
* AI-powered skill gap analysis
* Match percentage calculation
* Missing skills identification
* Personalized career recommendations

---

## 📊 AI Answer Evaluation

Every interview response is evaluated based on:

* Technical Accuracy
* Communication Skills
* Problem Solving
* Confidence
* Clarity
* Completeness
* Overall Performance

---

## 📈 Performance Analytics Dashboard

Track your interview preparation through:

* Overall Performance
* Technical Performance
* Communication Score
* Problem Solving Score
* Interview Statistics
* Performance Trends
* AI-generated Insights

---

## 📚 Interview History

* Complete interview history
* Previous interview reports
* Performance comparison
* Answer review
* Learning progress
* Historical analytics

---

## 📝 AI Interview Reports

Each completed interview generates:

* Overall Score
* Technical Score
* Communication Score
* Problem Solving Score
* Strengths
* Weaknesses
* AI Feedback
* Personalized Learning Plan
* Recommended Learning Resources

---

## 🏢 Company Specific Preparation

Practice interview questions for companies including:

* Google
* Amazon
* Microsoft
* Meta
* Adobe
* Uber
* Flipkart
* Zomato
* General Interviews

---

## 💻 Supported Interview Domains

* Data Structures & Algorithms
* Operating Systems
* DBMS
* OOPs
* System Design
* React.js
* Node.js
* Machine Learning
* Product Strategy
* Behavioral Interviews

---

## 🔐 Authentication

* Email & Password Authentication
* Google OAuth Login
* Secure Session Management
* Supabase Authentication
* Protected Routes

---

# 🛠 Tech Stack

## Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* shadcn/ui
* Lucide React

---

## Backend

* Supabase
* PostgreSQL
* Supabase Authentication
* Row Level Security (RLS)
* Supabase Edge Functions

---

## Artificial Intelligence

* Google Gemini 2.5 Flash
* Prompt Engineering
* AI Evaluation Pipeline

---

## Deployment

* Netlify
* GitHub Actions (Auto Deployment)

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
                          │
                          ▼
          AI Question Generation & Evaluation
```

---

# 📂 Project Structure

```text
PrepPilot-AI/

├── public/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
│
├── supabase/
│   ├── functions/
│   │      └── gemini/
│   └── migrations/
│
├── package.json
├── vite.config.ts
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

Create a `.env` file.

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

> **Security Notice**
>
> Google Gemini API Keys are securely stored inside **Supabase Edge Function Secrets** and are never exposed to the frontend.

---

## Run Development Server

```bash
npm run dev
```

---

## Build Production

```bash
npm run build
```

---

# 🔒 Security Features

* Secure Google OAuth Authentication
* Email Authentication
* Supabase Authentication
* Row Level Security (RLS)
* Protected API Access
* Gemini API secured through Supabase Edge Functions
* Sensitive credentials never exposed to the client
* Secure user-specific interview data

---

# 📊 AI Workflow

```text
User Login
      │
      ▼
Select Interview Type
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
Interview Report Generation
      │
      ▼
Dashboard • Analytics • History
```

---

# 🚀 Future Enhancements

* Live Coding Playground
* AI Interview Coach
* Video Interview Analysis
* Personalized Career Roadmap
* Company-wise Analytics
* Interview Leaderboard
* Recruiter Dashboard
* AI Mock HR Interviews
* Multi-language Interview Support

---

# 👨‍💻 Author

**Bhavya Jain**

### GitHub

https://github.com/bhavya27092027

### LinkedIn

https://www.linkedin.com/in/bhavyajain-fullstack/

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

---

# 📄 License

Licensed under the **MIT License**.
