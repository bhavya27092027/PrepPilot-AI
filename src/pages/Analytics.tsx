import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp,
  Target,
  Brain,
  MessageSquare,
  Clock,
  Award,
  Calendar,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface AnalyticsData {
  weeklyProgress: { week: string; score: number; interviews: number }[]
  domainScores: { domain: string; score: number; fullMark: number }[]
  skillBreakdown: { skill: string; value: number }[]
  dailyActivity: { day: string; hours: number }[]
  interviewHistory: { id: string; role: string; score: number; date: string }[]
  stats: {
    totalInterviews: number
    totalHours: number
    streak: number
    improvement: number
    topScore: number
    avgScore: number
  }
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    // Simulate loading analytics data
    setData({
      weeklyProgress: [
        { week: 'Week 1', score: 65, interviews: 3 },
        { week: 'Week 2', score: 72, interviews: 4 },
        { week: 'Week 3', score: 68, interviews: 2 },
        { week: 'Week 4', score: 78, interviews: 5 },
        { week: 'Week 5', score: 82, interviews: 4 },
      ],
      domainScores: [
        { domain: 'DSA', score: 75, fullMark: 100 },
        { domain: 'System Design', score: 82, fullMark: 100 },
        { domain: 'Architecture', score: 70, fullMark: 100 },
        { domain: 'Teamwork', score: 88, fullMark: 100 },
        { domain: 'Leadership', score: 65, fullMark: 100 },
      ],
      skillBreakdown: [
        { skill: 'Technical', value: 78 },
        { skill: 'Communication', value: 85 },
        { skill: 'Problem Solving', value: 72 },
        { skill: 'Leadership', value: 65 },
        { skill: 'Creativity', value: 70 },
      ],
      dailyActivity: [
        { day: 'Mon', hours: 2 },
        { day: 'Tue', hours: 1.5 },
        { day: 'Wed', hours: 3 },
        { day: 'Thu', hours: 2 },
        { day: 'Fri', hours: 2.5 },
        { day: 'Sat', hours: 1 },
        { day: 'Sun', hours: 0.5 },
      ],
      interviewHistory: [
        { id: '1', role: 'Software Engineer', score: 78, date: '2024-01-15' },
        { id: '2', role: 'Frontend Developer', score: 82, date: '2024-01-13' },
        { id: '3', role: 'Full Stack Developer', score: 75, date: '2024-01-10' },
        { id: '4', role: 'Software Engineer', score: 70, date: '2024-01-08' },
        { id: '5', role: 'Backend Developer', score: 68, date: '2024-01-05' },
      ],
      stats: {
        totalInterviews: 24,
        totalHours: 12.5,
        streak: 7,
        improvement: 15,
        topScore: 92,
        avgScore: 75,
      },
    })
  }, [timeRange])

  if (!data) {
    return (
      <div className="min-h-screen p-6 lg:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold gradient-text">Progress Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Track your interview preparation journey with detailed insights
            </p>
          </div>
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? 'bg-gradient-to-r from-primary to-secondary' : ''}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {[
            { label: 'Total Interviews', value: data.stats.totalInterviews, icon: Target, color: 'text-primary' },
            { label: 'Practice Hours', value: `${data.stats.totalHours}h`, icon: Clock, color: 'text-secondary' },
            { label: 'Current Streak', value: `${data.stats.streak} days`, icon: Calendar, color: 'text-accent' },
            { label: 'Improvement', value: `+${data.stats.improvement}%`, icon: TrendingUp, color: 'text-green-500' },
            { label: 'Top Score', value: data.stats.topScore, icon: Award, color: 'text-yellow-500' },
            { label: 'Avg Score', value: data.stats.avgScore, icon: Brain, color: 'text-cyan-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass-card h-full">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="text-lg">Score Progress Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.weeklyProgress}>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="week" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fill="url(#scoreGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skill Radar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="text-lg">Skill Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data.skillBreakdown}>
                      <PolarGrid className="stroke-muted" />
                      <PolarAngleAxis dataKey="skill" className="text-xs" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
                      <Radar
                        name="Skills"
                        dataKey="value"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Domain Scores & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Domain Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="text-lg">Domain Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.domainScores.map((domain, i) => (
                  <motion.div
                    key={domain.domain}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{domain.domain}</span>
                      <span className="text-sm text-primary">{domain.score}%</span>
                    </div>
                    <Progress value={domain.score} className="h-2" />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.dailyActivity}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Interview History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Interviews</CardTitle>
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.interviewHistory.map((interview, i) => (
                  <motion.div
                    key={interview.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{interview.role}</p>
                        <p className="text-xs text-muted-foreground">{interview.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={interview.score >= 80 ? 'default' : interview.score >= 60 ? 'secondary' : 'destructive'}
                      >
                        {interview.score}%
                      </Badge>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
