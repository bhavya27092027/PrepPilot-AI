export const JOB_ROLES = [
  { value: 'software_engineer', label: 'Software Engineer' },
  { value: 'frontend_developer', label: 'Frontend Developer' },
  { value: 'backend_developer', label: 'Backend Developer' },
  { value: 'full_stack_developer', label: 'Full Stack Developer' },
  { value: 'data_analyst', label: 'Data Analyst' },
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'data_scientist', label: 'Data Scientist' },
] as const

export const COMPANIES = [
  { value: 'general', label: 'General' },
  { value: 'google', label: 'Google' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'microsoft', label: 'Microsoft' },
  { value: 'meta', label: 'Meta' },
  { value: 'adobe', label: 'Adobe' },
  { value: 'flipkart', label: 'Flipkart' },
  { value: 'uber', label: 'Uber' },
  { value: 'zomato', label: 'Zomato' },
] as const

export const DOMAINS = [
  { value: 'react', label: 'React' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'system_design', label: 'System Design' },
  { value: 'dsa', label: 'Data Structures & Algorithms' },
  { value: 'machine_learning', label: 'Machine Learning' },
  { value: 'product_strategy', label: 'Product Strategy' },
  { value: 'behavioral', label: 'Behavioral' },
] as const

export const DIFFICULTIES = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'Great for those new to interviews or the domain',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'For those with some experience',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Challenging questions for experienced candidates',
  },
] as const

export const INTERVIEW_TYPES = [
  {
    value: 'technical',
    label: 'Technical',
    description: 'Focus on technical skills',
  },
  {
    value: 'behavioral',
    label: 'Behavioral',
    description: 'Focus on communication and experience',
  },
  {
    value: 'mixed',
    label: 'Mixed',
    description: 'Technical + Behavioral',
  },
] as const

export const DOMAINS_BY_ROLE: Record<string, string[]> = {
  software_engineer: [
    'dsa',
    'system_design',
    'react',
    'nodejs',
    'behavioral',
  ],

  frontend_developer: [
    'react',
    'dsa',
    'behavioral',
  ],

  backend_developer: [
    'nodejs',
    'system_design',
    'dsa',
    'behavioral',
  ],

  full_stack_developer: [
    'react',
    'nodejs',
    'system_design',
    'dsa',
    'behavioral',
  ],

  data_analyst: [
    'dsa',
    'machine_learning',
    'behavioral',
  ],

  product_manager: [
    'product_strategy',
    'behavioral',
    'system_design',
  ],

  data_scientist: [
    'machine_learning',
    'dsa',
    'system_design',
    'behavioral',
  ],
}

export const QUESTION_COUNTS = [5, 7, 10] as const