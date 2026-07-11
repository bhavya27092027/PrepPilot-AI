import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, Target, Trophy, Flame, TrendingUp, ArrowRight,
  Calendar, Star, AlertTriangle, CheckCircle, BookOpen
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { formatDate, getScoreColor } from '@/lib/utils'
import { JOB_ROLE_LABELS, DOMAIN_LABELS } from '@/types'
import type { Interview } from '@/types'

interface DashboardStats {
  totalInterviews: number
  averageScore: number
  bestScore: number
  practiceStreak: number
  strongAreas: string[]
  weakAreas: string[]
}

interface ProgressData {
  date: string
  score: number
}

interface RecentInterview extends Interview {
  question_count: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [recentInterviews, setRecentInterviews] = useState<RecentInterview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  async function fetchDashboardData() {
    try {
      // Fetch user profile stats
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single()

      // Fetch interviews
      const { data: interviews } = await supabase
        .from('interviews')
        .select('*, questions(count)')
        .eq('user_id', user!.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10)

      const completedInterviews = interviews?.filter(i => i.status === 'completed') || []

      // Calculate stats
      const scores = completedInterviews
        .map(i => i.overall_score)
        .filter((s): s is number => s !== null)

      const avgScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0

      // Calculate strong/weak areas
      const domainScores: Record<string, number[]> = {}
      completedInterviews.forEach(interview => {
        if (!domainScores[interview.domain]) {
          domainScores[interview.domain] = []
        }
        const score = interview.overall_score
        if (score !== null) {
          domainScores[interview.domain].push(score)
        }
      })

      const domainAverages = Object.entries(domainScores).map(([domain, scores]) => ({
        domain,
        avg: scores.reduce((a, b) => a + b, 0) / scores.length,
      })).sort((a, b) => b.avg - a.avg)

      const strongAreas = domainAverages.slice(0, 3).map(d => DOMAIN_LABELS[d.domain as keyof typeof DOMAIN_LABELS] || d.domain)
      const weakAreas = domainAverages.slice(-2).filter(d => d.avg < 80).map(d => DOMAIN_LABELS[d.domain as keyof typeof DOMAIN_LABELS] || d.domain)

      setStats({
        totalInterviews: completedInterviews.length,
        averageScore: avgScore,
        bestScore,
        practiceStreak: profile?.practice_streak || 0,
        strongAreas,
        weakAreas,
      })

      // Prepare progress data
      const progress = completedInterviews
        .slice(0, 10)
        .reverse()
        .map(interview => ({
          date: formatDate(interview.completed_at || interview.created_at),
          score: interview.overall_score || 0,
        }))

      setProgressData(progress)

      // Set recent interviews
      setRecentInterviews(
        completedInterviews.slice(0, 5).map(i => ({
          ...i,
          question_count: (i as unknown as { questions: { count: number }[] }).questions?.[0]?.count || 0,
        }))
      )
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold"
          >
            Welcome back!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Ready to ace your next interview?
          </motion.p>
        </div>
        <Link to="/interview/setup">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="gradient" size="lg" className="group">
              <Brain className="w-5 h-5 mr-2" />
              Start New Interview
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'Total Interviews', value: stats?.totalInterviews || 0, color: 'primary' },
          { icon: TrendingUp, label: 'Average Score', value: `${stats?.averageScore || 0}%`, color: 'secondary', scoreColor: stats?.averageScore },
          { icon: Trophy, label: 'Best Score', value: `${stats?.bestScore || 0}%`, color: 'accent', scoreColor: stats?.bestScore },
          { icon: Flame, label: 'Practice Streak', value: `${stats?.practiceStreak || 0} days`, color: 'orange-500' },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glass className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.scoreColor ? getScoreColor(stat.scoreColor) : ''}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card glass>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Progress Over Time
            </CardTitle>
            <CardDescription>Your interview performance over the last 10 sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {progressData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.75rem',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(239, 84%, 67%)"
                      strokeWidth={2}
                      fill="url(#scoreGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Complete your first interview to see progress</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Strong Areas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Strong Areas
              </CardTitle>
              <CardDescription>Domains where you perform best</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.strongAreas.length ? stats.strongAreas.map((area) => (
                <div key={area} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="font-medium">{area}</span>
                </div>
              )) : (
                <p className="text-muted-foreground text-sm">
                  Complete interviews to identify your strengths
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Weak Areas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Areas to Improve
              </CardTitle>
              <CardDescription>Focus on these for better performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.weakAreas.length ? stats.weakAreas.map((area) => (
                <div key={area} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="font-medium">{area}</span>
                </div>
              )) : (
                <p className="text-muted-foreground text-sm">
                  Great job! No weak areas identified yet.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Interviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card glass>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Recent Interviews
              </CardTitle>
              <CardDescription>Your latest practice sessions</CardDescription>
            </div>
            <Link to="/history">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentInterviews.length > 0 ? (
              <div className="space-y-4">
                {recentInterviews.map((interview) => (
                  <Link
                    key={interview.id}
                    to={`/interview/${interview.id}/report`}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {JOB_ROLE_LABELS[interview.job_role as keyof typeof JOB_ROLE_LABELS]}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {DOMAIN_LABELS[interview.domain as keyof typeof DOMAIN_LABELS]} • {interview.total_questions} questions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${getScoreColor(interview.overall_score || 0)}`}>
                          {interview.overall_score}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(interview.completed_at || interview.created_at)}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">No interviews yet</p>
                <Link to="/interview/setup">
                  <Button variant="gradient">
                    Start Your First Interview
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
