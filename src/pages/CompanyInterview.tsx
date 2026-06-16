import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Play,
  Star,
  Users,
  Clock,
  Building,
  Target,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Company {
  id: string
  name: string
  logo: string
  color: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  focusAreas: string[]
  interviewStyle: string
  avgTime: string
  questionsCount: number
  description: string
}

const companies: Company[] = [
  {
    id: 'google',
    name: 'Google',
    logo: 'https://www.google.com/favicon.ico',
    color: 'from-blue-500 to-green-500',
    difficulty: 'advanced',
    focusAreas: ['DSA', 'System Design', 'Behavioral'],
    interviewStyle: 'Rigorous technical interviews with coding challenges',
    avgTime: '45-60 min',
    questionsCount: 4,
    description: 'Practice Google-style coding interviews with focus on algorithms and scalability.',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://www.amazon.com/favicon.ico',
    color: 'from-orange-500 to-yellow-500',
    difficulty: 'intermediate',
    focusAreas: ['Leadership Principles', 'System Design', 'Coding'],
    interviewStyle: 'Behavioral-focused with technical depth',
    avgTime: '45 min',
    questionsCount: 4,
    description: 'Master Amazon\'s Leadership Principles with STAR method responses.',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'https://www.microsoft.com/favicon.ico',
    color: 'from-blue-600 to-cyan-500',
    difficulty: 'intermediate',
    focusAreas: ['Algorithms', 'System Design', 'Growth Mindset'],
    interviewStyle: 'Balanced technical and behavioral interviews',
    avgTime: '40-50 min',
    questionsCount: 4,
    description: 'Practice Microsoft interviews with focus on growth mindset and collaboration.',
  },
  {
    id: 'meta',
    name: 'Meta',
    logo: 'https://www.meta.com/favicon.ico',
    color: 'from-blue-400 to-indigo-500',
    difficulty: 'advanced',
    focusAreas: ['DSA', 'System Design', 'Behavioral'],
    interviewStyle: 'Fast-paced technical interviews',
    avgTime: '45 min',
    questionsCount: 4,
    description: 'Meta-style interviews focusing on speed and optimization.',
  },
  {
    id: 'adobe',
    name: 'Adobe',
    logo: 'https://www.adobe.com/favicon.ico',
    color: 'from-red-500 to-pink-500',
    difficulty: 'intermediate',
    focusAreas: ['Algorithms', 'UI Engineering', 'Design'],
    interviewStyle: 'Creative technical interviews',
    avgTime: '40 min',
    questionsCount: 4,
    description: 'Adobe interviews focusing on creativity and user experience.',
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    logo: 'https://www.flipkart.com/favicon.ico',
    color: 'from-yellow-400 to-blue-500',
    difficulty: 'intermediate',
    focusAreas: ['DSA', 'System Design', 'Problem Solving'],
    interviewStyle: 'Practical coding and design interviews',
    avgTime: '45 min',
    questionsCount: 4,
    description: 'Indian e-commerce giant with focus on scalable systems.',
  },
  {
    id: 'zomato',
    name: 'Zomato',
    logo: 'https://www.zomato.com/favicon.ico',
    color: 'from-red-500 to-orange-500',
    difficulty: 'beginner',
    focusAreas: ['Backend', 'System Design', 'Product'],
    interviewStyle: 'Product-focused technical interviews',
    avgTime: '35-40 min',
    questionsCount: 3,
    description: 'Food-tech company interviews with product mindset.',
  },
  {
    id: 'uber',
    name: 'Uber',
    logo: 'https://www.uber.com/favicon.ico',
    color: 'from-gray-800 to-gray-900',
    difficulty: 'advanced',
    focusAreas: ['Distributed Systems', 'Mobile', 'Real-time'],
    interviewStyle: 'Deep dive into distributed systems',
    avgTime: '50-60 min',
    questionsCount: 4,
    description: 'Uber interviews focusing on real-time systems and scalability.',
  },
]

const difficultyColors = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-red-500/20 text-red-400',
}

export default function CompanyInterview() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const navigate = useNavigate()

  const handleStartInterview = (company: Company) => {
    // Navigate to interview with company context
    navigate(`/interview/setup?company=${company.id}`)
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold gradient-text">Company-Specific Interviews</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Practice interviews tailored to specific companies. Each company has unique interview
            styles, question patterns, and focus areas.
          </p>
        </motion.div>

        {/* Company Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Card
                className={`glass-card cursor-pointer transition-all hover:shadow-lg ${
                  selectedCompany?.id === company.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCompany(company)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${company.color} flex items-center justify-center text-white font-bold text-lg`}
                      >
                        {company.name[0]}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{company.name}</CardTitle>
                        <Badge className={difficultyColors[company.difficulty]}>
                          {company.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{company.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {company.focusAreas.slice(0, 3).map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {company.avgTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {company.questionsCount} questions
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Selected Company Details */}
        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedCompany.color} flex items-center justify-center text-white font-bold text-2xl`}
                      >
                        {selectedCompany.name[0]}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedCompany.name} Interview</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={difficultyColors[selectedCompany.difficulty]}>
                            {selectedCompany.difficulty}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {selectedCompany.avgTime} average
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Interview Style</h3>
                      <p className="text-muted-foreground">{selectedCompany.interviewStyle}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Focus Areas</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCompany.focusAreas.map((area) => (
                          <motion.div
                            key={area}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Badge className="bg-primary/20 text-primary px-4 py-1">
                              {area}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Duration</span>
                        </div>
                        <p className="text-xl font-bold">{selectedCompany.avgTime}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Target className="w-4 h-4" />
                          <span className="text-sm">Questions</span>
                        </div>
                        <p className="text-xl font-bold">{selectedCompany.questionsCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-64 flex flex-col justify-center gap-4">
                    <Button
                      size="lg"
                      onClick={() => handleStartInterview(selectedCompany)}
                      className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 w-full"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Practice
                    </Button>
                    <Button variant="outline" size="lg" className="w-full">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      View Tips
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <Building className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">{companies.length}</p>
              <p className="text-sm text-muted-foreground">Companies Available</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-muted-foreground">Practice Sessions</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">4.8</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
