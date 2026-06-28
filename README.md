# 🚀 PrepPilot AI

> **An AI-powered mock interview platform that helps students and professionals prepare for technical and behavioral interviews using Gemini AI.**

PrepPilot AI provides realistic interview simulations with AI-generated questions, answer evaluation, personalized feedback, and performance reports to improve interview readiness.

---

## 🌐 Live Demo

**Live Website:**
`https://prep-pilot-ai-flax.vercel.app`

---

# ✨ Features

### 🤖 AI Interview Simulation

* AI-generated interview questions using Google Gemini
* Company-specific interview preparation
* Technical, Behavioral & Mixed interview modes
* Dynamic follow-up questions

### 💻 Technical Interview Domains

* Data Structures & Algorithms
* System Design
* React.js
* Node.js
* Machine Learning
* Product Strategy

### 🏢 Company-wise Preparation

* Google
* Amazon
* Microsoft
* Meta
* Adobe
* Uber
* Flipkart
* Zomato
* General

### 📊 AI Answer Evaluation

Every answer is evaluated on:

* Technical Accuracy
* Communication Skills
* Problem Solving
* Clarity
* Confidence
* Completeness

### 📈 Personalized Interview Report

After completing an interview, users receive:

* Overall Score
* Technical Score
* Communication Score
* Problem Solving Score
* Strengths
* Weaknesses
* Personalized Learning Plan
* Recommended Learning Resources

### 🔐 Authentication

* Email & Password Login
* Google OAuth Login
* Secure User Sessions with Supabase Auth

### ☁️ Backend

* PostgreSQL Database
* Supabase Authentication
* Row Level Security (RLS)
* Supabase Edge Functions
* Secure Gemini API Integration

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

## Backend

* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Edge Functions

## Artificial Intelligence

* Google Gemini 2.5 Flash

## Deployment

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
                  Supabase Database
                          │
                          ▼
               Supabase Edge Function
                          │
                          ▼
                    Google Gemini AI
```

---

# 📂 Project Structure

```text
PrepPilot-AI/

│── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
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

## Configure Environment Variables

Create a `.env` file in the root directory.

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL

VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

> **Note:** Gemini API keys are **NOT** stored in the frontend. They are securely managed using **Supabase Edge Function Secrets**.

---

## Start Development Server

```bash
npm run dev
```

---

## Build Project

```bash
npm run build
```

---

# 🔒 Security Features

* Google Gemini API Key stored securely using **Supabase Edge Function Secrets**
* API key is never exposed to the client
* Row Level Security (RLS) enabled
* Secure Authentication with Supabase Auth
* Protected Database Access

---

# 📊 AI Workflow

```
User Starts Interview
        │
        ▼
Generate AI Question
        │
        ▼
User Submits Answer
        │
        ▼
Gemini AI Evaluation
        │
        ▼
Performance Scoring
        │
        ▼
Final Interview Report
```

---

# 📌 Future Improvements

* Video Interview Support
* Coding Playground
* AI Interview Analytics
* Multi-language Support
* Company Interview Trends
* Team Interview Mode

---

# 👨‍💻 Author

**Bhavya Jain**

GitHub:
https://github.com/bhavya27092027

LinkedIn:
https://www.linkedin.com/in/bhavyajain-fullstack/

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

---

# 📄 License

This project is licensed under the **MIT License**.

