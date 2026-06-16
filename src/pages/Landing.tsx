import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Brain, Target, BarChart3, Sparkles, Zap, Shield, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Interviews',
    description: 'Experience realistic mock interviews powered by advanced AI that adapts to your responses and asks relevant follow-up questions.',
  },
  {
    icon: Target,
    title: 'Personalized Feedback',
    description: 'Get detailed feedback on your technical accuracy, communication, problem-solving, and clarity with actionable improvement tips.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Track your interview performance over time, identify patterns, and watch your skills improve with each practice session.',
  },
]

const benefits = [
  'Practice anytime, anywhere',
  'Industry-specific interview questions',
  'Real-time performance scoring',
  'Detailed analytics dashboard',
  'Personalized learning plans',
  'Export interview reports as PDF',
]

export default function Landing() {

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-secondary/10 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <header className="relative z-10">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <span className="font-bold text-xl">InterviewPro AI</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button variant="gradient">Get Started</Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Interview Preparation</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="block">Ace Your Next</span>
            <span className="gradient-text">Job Interview</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Practice with AI mock interviews, receive detailed feedback, and track your progress.
            Land your dream job with confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button variant="gradient" size="xl" className="group">
                Start Practicing Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-secondary" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span>Free to Start</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Demo Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl opacity-20 blur-2xl" />
            <div className="relative glass-card rounded-2xl overflow-hidden border-2 border-white/10">
              <div className="bg-muted/50 p-4 flex items-center gap-2 border-b">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center text-sm text-muted-foreground">
                  InterviewPro AI Dashboard
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-background to-muted/30">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label: 'Interviews', value: '24', color: 'primary' },
                    { label: 'Avg Score', value: '87%', color: 'secondary' },
                    { label: 'Streak', value: '7 days', color: 'accent' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-card rounded-xl p-4 border">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-card rounded-xl p-4 border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">AI Interviewer</p>
                      <p className="text-xs text-muted-foreground">Ready to start your next mock interview...</p>
                    </div>
                    <Button size="sm">Start Now</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive interview preparation tools designed to help you land your dream job.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-lg">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 container mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Practice Makes Perfect
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our AI interview engine creates realistic, challenging interview scenarios
              tailored to your target role and domain. Get instant, actionable feedback
              to improve with every session.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold mb-4">Ready to Start?</h3>
            <p className="text-muted-foreground mb-6">
              Create your free account and start practicing mock interviews in minutes.
            </p>
            <Link to="/auth">
              <Button variant="gradient" size="lg" className="w-full group">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="font-semibold">InterviewPro AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by AI. Built for your success.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
