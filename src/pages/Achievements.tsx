import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy,
  Flame,
  Star,
  Zap,
  Target,
  Rocket,
  Crown,
  Medal,
  Gift,
  Check,
  Lock,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  xp: number
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  total?: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

interface UserStats {
  level: number
  currentXP: number
  xpToNextLevel: number
  totalXP: number
  streak: number
  totalAchievements: number
  unlockedAchievements: number
}

interface LeaderboardEntry {
  rank: number
  name: string
  level: number
  xp: number
  avatar: string
}

const achievementTemplates: Omit<Achievement, 'unlocked' | 'progress' | 'unlockedAt'>[] = [
  // Bronze tier
  { id: 'first_interview', name: 'First Steps', description: 'Complete your first interview', icon: 'Rocket', xp: 50, tier: 'bronze' },
  { id: 'streak_3', name: 'On Fire', description: 'Maintain a 3-day practice streak', icon: 'Flame', xp: 75, tier: 'bronze', total: 3 },
  { id: 'complete_5', name: 'Getting Started', description: 'Complete 5 interviews', icon: 'Target', xp: 100, tier: 'bronze', total: 5 },
  { id: 'score_70', name: 'Above Average', description: 'Score 70% or higher in an interview', icon: 'Medal', xp: 75, tier: 'bronze' },

  // Silver tier
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day practice streak', icon: 'Flame', xp: 150, tier: 'silver', total: 7 },
  { id: 'complete_20', name: 'Dedicated Learner', description: 'Complete 20 interviews', icon: 'Star', xp: 200, tier: 'silver', total: 20 },
  { id: 'score_85', name: 'Excellence Seeker', description: 'Score 85% or higher in 3 interviews', icon: 'Trophy', xp: 175, tier: 'silver', total: 3 },
  { id: 'all_roles', name: 'Versatile', description: 'Practice interviews for 3 different roles', icon: 'Zap', xp: 150, tier: 'silver', total: 3 },

  // Gold tier
  { id: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day practice streak', icon: 'Crown', xp: 500, tier: 'gold', total: 30 },
  { id: 'complete_50', name: 'Interview Expert', description: 'Complete 50 interviews', icon: 'Trophy', xp: 400, tier: 'gold', total: 50 },
  { id: 'score_95', name: 'Perfectionist', description: 'Score 95% or higher in an interview', icon: 'Star', xp: 350, tier: 'gold' },
  { id: 'all_domains', name: 'Knowledge Seeker', description: 'Master all interview domains', icon: 'Target', xp: 450, tier: 'gold', total: 4 },

  // Platinum tier
  { id: 'streak_100', name: 'Legendary Dedication', description: 'Maintain a 100-day practice streak', icon: 'Crown', xp: 1000, tier: 'platinum', total: 100 },
  { id: 'complete_200', name: 'Interview Legend', description: 'Complete 200 interviews', icon: 'Trophy', xp: 1500, tier: 'platinum', total: 200 },
  { id: 'top_10', name: 'Elite Performer', description: 'Reach top 10 on the leaderboard', icon: 'Medal', xp: 2000, tier: 'platinum' },
]

export default function Achievements() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [category, setCategory] = useState<'all' | 'unlocked' | 'locked'>('all')

  useEffect(() => {
    // Simulate loading data
    setStats({
      level: 12,
      currentXP: 1250,
      xpToNextLevel: 1500,
      totalXP: 16500,
      streak: 7,
      totalAchievements: achievementTemplates.length,
      unlockedAchievements: 6,
    })

    setAchievements(
      achievementTemplates.map((a, i) => ({
        ...a,
        unlocked: i < 6,
        progress: a.total ? Math.min(Math.floor(Math.random() * a.total * 1.5), a.total) : undefined,
        unlockedAt: i < 6 ? '2024-01-15' : undefined,
      }))
    )

    setLeaderboard([
      { rank: 1, name: 'Alex Chen', level: 25, xp: 45000, avatar: 'AC' },
      { rank: 2, name: 'Sarah Kim', level: 23, xp: 42000, avatar: 'SK' },
      { rank: 3, name: 'Mike Johnson', level: 21, xp: 38000, avatar: 'MJ' },
      { rank: 4, name: 'Emily Davis', level: 19, xp: 31000, avatar: 'ED' },
      { rank: 5, name: 'You', level: 12, xp: 16500, avatar: 'YO' },
      { rank: 6, name: 'James Wilson', level: 18, xp: 29000, avatar: 'JW' },
      { rank: 7, name: 'Lisa Brown', level: 17, xp: 27000, avatar: 'LB' },
      { rank: 8, name: 'Tom Miller', level: 16, xp: 25000, avatar: 'TM' },
      { rank: 9, name: 'Rachel Green', level: 15, xp: 23000, avatar: 'RG' },
      { rank: 10, name: 'David Lee', level: 14, xp: 21000, avatar: 'DL' },
    ])
  }, [])

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ElementType> = {
      Trophy,
      Flame,
      Star,
      Zap,
      Target,
      Rocket,
      Crown,
      Medal,
      Gift,
    }
    return icons[iconName] || Trophy
  }

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'from-amber-600 to-amber-800'
      case 'silver':
        return 'from-gray-300 to-gray-500'
      case 'gold':
        return 'from-yellow-400 to-yellow-600'
      case 'platinum':
        return 'from-cyan-300 to-cyan-500'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const filteredAchievements = achievements.filter((a) => {
    if (category === 'unlocked') return a.unlocked
    if (category === 'locked') return !a.unlocked
    return true
  })

  if (!stats) return null

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold gradient-text">Achievements & Gamification</h1>
          <p className="text-muted-foreground">
            Earn XP, unlock achievements, and level up your interview skills
          </p>
        </motion.div>

        {/* XP & Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Level Badge */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-primary">{stats.level}</p>
                        <p className="text-xs text-muted-foreground">LEVEL</p>
                      </div>
                    </div>
                  </div>
                  {stats.streak > 0 && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      <Flame className="w-4 h-4" />
                      {stats.streak} day streak
                    </div>
                  )}
                </div>

                {/* XP Progress */}
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Level {stats.level}</span>
                      <span className="text-sm text-primary">
                        Level {stats.level + 1}
                      </span>
                    </div>
                    <Progress value={(stats.currentXP / stats.xpToNextLevel) * 100} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      {stats.currentXP} / {stats.xpToNextLevel} XP (
                      {stats.xpToNextLevel - stats.currentXP} XP to level up)
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold text-primary">{stats.totalXP.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total XP</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold text-yellow-500">{stats.unlockedAchievements}</p>
                      <p className="text-xs text-muted-foreground">Achievements</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold text-orange-500">{stats.streak}</p>
                      <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Achievements Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Achievements</h2>
              <div className="flex gap-2">
                {(['all', 'unlocked', 'locked'] as const).map((cat) => (
                  <Badge
                    key={cat}
                    variant={category === cat ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setCategory(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAchievements.map((achievement, i) => {
                const Icon = getIconComponent(achievement.icon)
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card
                      className={`glass-card h-full ${!achievement.unlocked ? 'opacity-60' : ''}`}
                    >
                      <CardContent className="p-4 flex items-start gap-4">
                        <div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getTierGradient(achievement.tier)} flex items-center justify-center shrink-0 ${
                            !achievement.unlocked ? 'grayscale' : ''
                          }`}
                        >
                          {achievement.unlocked ? (
                            <Icon className="w-7 h-7 text-white" />
                          ) : (
                            <Lock className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              +{achievement.xp} XP
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {achievement.description}
                          </p>
                          {achievement.progress !== undefined && achievement.total && (
                            <div className="mt-2">
                              <Progress
                                value={(achievement.progress / achievement.total) * 100}
                                className="h-1.5"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {achievement.progress} / {achievement.total}
                              </p>
                            </div>
                          )}
                          {achievement.unlocked && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
                              <Check className="w-3 h-3" />
                              <span>Unlocked on {achievement.unlockedAt}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Leaderboard</h2>
            <Card className="glass-card">
              <CardContent className="p-4 space-y-2">
                {leaderboard.map((entry, i) => {
                  const isYou = entry.name === 'You'
                  return (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        isYou ? 'bg-primary/20 border border-primary/50' : 'bg-muted/50'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          entry.rank === 1
                            ? 'bg-yellow-500 text-black'
                            : entry.rank === 2
                              ? 'bg-gray-400 text-black'
                              : entry.rank === 3
                                ? 'bg-amber-600 text-white'
                                : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {entry.rank <= 3 ? <Medal className="w-4 h-4" /> : entry.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isYou ? 'text-primary' : ''}`}>
                          {entry.name}
                        </p>
                        <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                      </div>
                      <p className="text-sm font-medium text-primary">{entry.xp.toLocaleString()}</p>
                    </motion.div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
