import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Toaster } from '@/components/ui/toaster'
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import InterviewSetup from '@/pages/InterviewSetup'
import Interview from '@/pages/Interview'
import InterviewReport from '@/pages/InterviewReport'
import History from '@/pages/History'
import Profile from '@/pages/Profile'
import Auth from '@/pages/Auth'
import ResumeAnalyzer from '@/pages/ResumeAnalyzer'
import ResumeMatch from '@/pages/ResumeMatch'
import VoiceInterview from '@/pages/VoiceInterview'
import CompanyInterview from '@/pages/CompanyInterview'
import Coach from '@/pages/Coach'
import Analytics from '@/pages/Analytics'
import Achievements from '@/pages/Achievements'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview/setup"
              element={
                <ProtectedRoute>
                  <Layout><InterviewSetup /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview/:id"
              element={
                <ProtectedRoute>
                  <Interview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview/:id/report"
              element={
                <ProtectedRoute>
                  <Layout><InterviewReport /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <Layout><History /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout><Profile /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume-analyzer"
              element={
                <ProtectedRoute>
                  <Layout><ResumeAnalyzer /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume-match"
              element={
                <ProtectedRoute>
                  <Layout><ResumeMatch /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/voice-interview"
              element={
                <ProtectedRoute>
                  <Layout><VoiceInterview /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/company-interview"
              element={
                <ProtectedRoute>
                  <Layout><CompanyInterview /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/coach"
              element={
                <ProtectedRoute>
                  <Layout><Coach /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Layout><Analytics /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <Layout><Achievements /></Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
