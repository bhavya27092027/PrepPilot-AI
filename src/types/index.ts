export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
  total_interviews: number
  average_score: number
  best_score: number
  practice_streak: number
  last_practice_date: string | null
  strong_areas: string[]
  weak_areas: string[]
  created_at: string
  updated_at: string
}

export type JobRole =
  | 'software_engineer'
  | 'frontend_developer'
  | 'backend_developer'
  | 'full_stack_developer'
  | 'data_analyst'
  | 'product_manager'
  | 'data_scientist'

export type Domain =
  | 'react'
  | 'nodejs'
  | 'system_design'
  | 'dsa'
  | 'machine_learning'
  | 'product_strategy'
  | 'behavioral'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type InterviewType = 'technical' | 'behavioral' | 'mixed'

export interface InterviewConfig {
  job_role: JobRole
  domain: Domain
  difficulty: Difficulty
  interview_type: InterviewType
  num_questions: number
}

export interface Question {
  id: string
  interview_id: string
  question_text: string
  question_type: 'technical' | 'behavioral'
  difficulty: Difficulty
  order_index: number
  follow_up_for: string | null
  created_at: string
}

export interface Answer {
  id: string
  question_id: string
  interview_id: string
  answer_text: string
  time_taken_seconds: number
  technical_accuracy: number
  communication: number
  problem_solving: number
  clarity: number
  confidence: number
  completeness: number
  overall_score: number
  feedback: string
  improvement_suggestions: string[]
  created_at: string
}

export interface Interview {
  id: string
  user_id: string
  job_role: JobRole
  domain: Domain
  difficulty: Difficulty
  interview_type: InterviewType
  status: 'in_progress' | 'completed' | 'abandoned'
  current_question_index: number
  total_questions: number
  overall_score: number | null
  technical_score: number | null
  communication_score: number | null
  problem_solving_score: number | null
  strengths: string[]
  weaknesses: string[]
  learning_plan: string[]
  suggested_resources: Resource[]
  started_at: string
  completed_at: string | null
  created_at: string
}

export interface Resource {
  title: string
  url: string
  type: 'article' | 'video' | 'course' | 'book'
}

export interface ChatMessage {
  id: string
  role: 'ai' | 'user'
  content: string
  timestamp: Date
  isTyping?: boolean
}

export interface InterviewSession {
  interview: Interview
  questions: Question[]
  answers: Answer[]
  currentQuestionIndex: number
}

export interface DashboardStats {
  totalInterviews: number
  averageScore: number
  bestScore: number
  practiceStreak: number
  strongAreas: string[]
  weakAreas: string[]
  recentActivity: RecentActivity[]
  progressData: ProgressPoint[]
}

export interface RecentActivity {
  id: string
  type: 'interview_completed' | 'milestone'
  title: string
  description: string
  score?: number
  date: string
}

export interface ProgressPoint {
  date: string
  score: number
  interviewId: string
}

export const JOB_ROLE_LABELS: Record<JobRole, string> = {
  software_engineer: 'Software Engineer',
  frontend_developer: 'Frontend Developer',
  backend_developer: 'Backend Developer',
  full_stack_developer: 'Full Stack Developer',
  data_analyst: 'Data Analyst',
  product_manager: 'Product Manager',
  data_scientist: 'Data Scientist',
}

export const DOMAIN_LABELS: Record<Domain, string> = {
  react: 'React',
  nodejs: 'Node.js',
  system_design: 'System Design',
  dsa: 'Data Structures & Algorithms',
  machine_learning: 'Machine Learning',
  product_strategy: 'Product Strategy',
  behavioral: 'Behavioral',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  technical: 'Technical',
  behavioral: 'Behavioral',
  mixed: 'Mixed',
}

export const DOMAINS_BY_ROLE: Record<JobRole, Domain[]> = {
  software_engineer: ['dsa', 'system_design', 'react', 'nodejs'],
  frontend_developer: ['react', 'dsa', 'behavioral'],
  backend_developer: ['nodejs', 'system_design', 'dsa'],
  full_stack_developer: ['react', 'nodejs', 'system_design', 'dsa'],
  data_analyst: ['dsa', 'machine_learning', 'behavioral'],
  product_manager: ['product_strategy', 'behavioral', 'system_design'],
  data_scientist: ['machine_learning', 'dsa', 'system_design'],
}
