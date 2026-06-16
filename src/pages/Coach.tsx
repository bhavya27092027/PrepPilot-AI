import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target,
  TrendingUp,
  Calendar,
  CheckCircle,
  Circle,
  BookOpen,
  Play,
  Star,
  Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DayPlan {
  day: number
  title: string
  focus: string
  duration: string
  tasks: string[]
  completed: boolean
  resources: { title: string; type: 'article' | 'video' | 'exercise'; url: string }[]
}

interface CoachingRoadmap {
  overallGoal: string
  currentLevel: string
  targetLevel: string
  progress: number
  daysCompleted: number
  totalDays: number
  plan: DayPlan[]
  insights: string[]
  achievements: string[]
}

export default function Coach() {
  const [roadmap, setRoadmap] = useState<CoachingRoadmap | null>(null)
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null)
  const [activeTab, setActiveTab] = useState('roadmap')

  useEffect(() => {
    // Simulate loading coaching plan
    setRoadmap({
      overallGoal: 'Master Technical Interviews for Senior Software Engineer',
      currentLevel: 'Intermediate',
      targetLevel: 'Expert',
      progress: 35,
      daysCompleted: 10,
      totalDays: 30,
      insights: [
        'Your system design skills need more practice. Focus Week 2 on this area.',
        'Great progress on algorithm problems! Keep maintaining the streak.',
        'Consider practicing more behavioral questions using STAR method.',
        'Your communication score improved by 15% this week!',
      ],
      achievements: [
        'Completed 50 practice questions',
        '7-day learning streak',
        'Algorithms Expert badge earned',
        'First mock interview completed',
      ],
      plan: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        title: getDayTitle(i + 1),
        focus: getDayFocus(i + 1),
        duration: `${Math.floor(Math.random() * 30 + 30)} min`,
        tasks: getDayTasks(i + 1),
        completed: i < 10,
        resources: [
          {
            title: 'System Design Primer',
            type: 'article' as const,
            url: 'https://github.com/donnemartin/system-design-primer',
          },
          {
            title: 'DSA Patterns',
            type: 'video' as const,
            url: 'https://youtube.com',
          },
        ],
      })),
    })
  }, [])

  const getDayTitle = (day: number) => {
    if (day <= 5) return `Foundations Day ${day}`
    if (day <= 10) return `DSA Intensive ${day - 5}`
    if (day <= 15) return `System Design ${day - 10}`
    if (day <= 20) return `Behavioral Mastery ${day - 15}`
    if (day <= 25) return `Mock Interviews ${day - 20}`
    return `Final Prep ${day - 25}`
  }

  const getDayFocus = (day: number) => {
    if (day <= 5) return 'Core fundamentals review'
    if (day <= 10) return 'Algorithm patterns'
    if (day <= 15) return 'System architecture'
    if (day <= 20) return 'Soft skills'
    if (day <= 25) return 'Practice sessions'
    return 'Interview readiness'
  }

  const getDayTasks = (day: number) => {
    const templates = [
      ['Review core concepts', 'Complete quiz', 'Reflect on learnings'],
      ['Solve 3 problems', 'Learn new pattern', 'Time yourself'],
      ['Design a system', 'Draw diagrams', 'Explain tradeoffs'],
      ['Practice STAR stories', 'Record yourself', 'Get feedback'],
      ['Mock interview', 'Review feedback', 'Identify gaps'],
    ]
    return templates[Math.floor((day - 1) / 5) % templates.length]
  }

  const toggleDayCompletion = (day: number) => {
    if (!roadmap) return
    setRoadmap({
      ...roadmap,
      plan: roadmap.plan.map((d) =>
        d.day === day ? { ...d, completed: !d.completed } : d
      ),
      daysCompleted: roadmap.plan.filter((d) => d.day === day ? !d.completed : d.completed).length,
    })
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
          <h1 className="text-4xl font-bold gradient-text">AI Career Coach</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your personalized 30-day improvement roadmap. Track your progress, learn new skills,
            and ace your next interview.
          </p>
        </motion.div>

        {roadmap && (
          <>
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="text-center lg:text-left space-y-2 flex-1">
                      <h2 className="text-2xl font-bold">{roadmap.overallGoal}</h2>
                      <p className="text-muted-foreground">
                        {roadmap.currentLevel} → {roadmap.targetLevel}
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-primary">{roadmap.daysCompleted}</p>
                          <p className="text-xs text-muted-foreground">Days Completed</p>
                        </div>
                        <div className="w-px h-12 bg-border" />
                        <div className="text-center">
                          <p className="text-3xl font-bold">{roadmap.totalDays - roadmap.daysCompleted}</p>
                          <p className="text-xs text-muted-foreground">Days Left</p>
                        </div>
                      </div>
                    </div>
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="url(#progressGradient)"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 70 * (roadmap.progress / 100)} ${
                            2 * Math.PI * 70
                          }`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary">{roadmap.progress}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="roadmap">30-Day Roadmap</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="roadmap" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Day Grid */}
                  <div className="lg:col-span-2">
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Day-by-Day Plan</span>
                          <Badge variant="secondary">{roadmap.daysCompleted}/{roadmap.totalDays} days</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-5 gap-2">
                          {roadmap.plan.map((day) => (
                            <motion.button
                              key={day.day}
                              onClick={() => setSelectedDay(day)}
                              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                                day.completed
                                  ? 'bg-gradient-to-br from-primary to-secondary text-white'
                                  : 'bg-muted hover:bg-muted/80'
                              } ${selectedDay?.day === day.day ? 'ring-2 ring-primary scale-105' : ''}`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span className="font-bold">{day.day}</span>
                              {day.completed && <CheckCircle className="w-3 h-3 mt-1" />}
                            </motion.button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Selected Day Details */}
                  <div>
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {selectedDay ? `Day ${selectedDay.day}` : 'Select a Day'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <AnimatePresence mode="wait">
                          {selectedDay ? (
                            <motion.div
                              key={selectedDay.day}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-4"
                            >
                              <div>
                                <p className="font-medium">{selectedDay.title}</p>
                                <p className="text-sm text-muted-foreground">{selectedDay.focus}</p>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>{selectedDay.duration}</span>
                              </div>
                              <div className="space-y-2">
                                {selectedDay.tasks.map((task, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <Circle className="w-4 h-4 text-muted-foreground" />
                                    {task}
                                  </motion.div>
                                ))}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => toggleDayCompletion(selectedDay.day)}
                                className={`w-full ${
                                  selectedDay.completed
                                    ? 'bg-muted text-muted-foreground'
                                    : 'bg-gradient-to-r from-primary to-secondary'
                                }`}
                              >
                                {selectedDay.completed ? 'Mark Incomplete' : 'Mark Complete'}
                              </Button>
                            </motion.div>
                          ) : (
                            <div className="text-center text-muted-foreground py-8">
                              <Target className="w-8 h-8 mx-auto mb-2" />
                              <p>Click on a day to see details</p>
                            </div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roadmap.insights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="glass-card h-full">
                        <CardContent className="p-6 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                            <Lightbulb className="w-5 h-5 text-primary" />
                          </div>
                          <p className="text-sm">{insight}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roadmap.achievements.map((achievement, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="glass-card h-full">
                        <CardContent className="p-6 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                            <Star className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{achievement}</p>
                            <p className="text-xs text-muted-foreground">Completed</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Continue Learning</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => window.location.href = '/voice-interview'}
                    >
                      <Play className="w-6 h-6 text-primary" />
                      <span>Practice Interview</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => window.location.href = '/analytics'}
                    >
                      <TrendingUp className="w-6 h-6 text-primary" />
                      <span>View Progress</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => window.location.href = '/resume-analyzer'}
                    >
                      <BookOpen className="w-6 h-6 text-primary" />
                      <span>Analyze Resume</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
