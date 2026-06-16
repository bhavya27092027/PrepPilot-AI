import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  Briefcase,
  ArrowRight,
  CheckCircle,
  XCircle,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

interface MatchResult {
  overallMatch: number
  skillsMatch: {
    score: number
    matched: string[]
    missing: string[]
    additional: string[]
  }
  experienceMatch: {
    score: number
    required: string
    hasRelevant: boolean
    gaps: string[]
  }
  educationMatch: {
    score: number
    required: string
    meetsRequirement: boolean
  }
  keywordMatch: {
    score: number
    topKeywords: string[]
    missingKeywords: string[]
  }
  recommendations: string[]
  interviewReadiness: 'high' | 'medium' | 'low'
}

export default function ResumeMatch() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleResumeUpload(e.dataTransfer.files[0])
    }
  }

  const handleResumeUpload = (file: File) => {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setResumeFile(file)
    }
  }

  const handleMatch = async () => {
    if (!resumeFile || !jobDescription.trim()) return

    setLoading(true)
    setMatchResult(null)

    // Simulate matching process
    setTimeout(() => {
      setMatchResult({
        overallMatch: 68,
        skillsMatch: {
          score: 75,
          matched: ['JavaScript', 'React', 'Node.js', 'REST APIs', 'Git'],
          missing: ['TypeScript', 'GraphQL', 'AWS', 'Docker'],
          additional: ['Python', 'MongoDB'],
        },
        experienceMatch: {
          score: 70,
          required: '3-5 years of software development experience',
          hasRelevant: true,
          gaps: ['Limited experience with cloud platforms', 'No mention of CI/CD pipelines'],
        },
        educationMatch: {
          score: 100,
          required: "Bachelor's degree in Computer Science or related field",
          meetsRequirement: true,
        },
        keywordMatch: {
          score: 65,
          topKeywords: ['Agile', 'Scrum', 'REST', 'Frontend', 'Backend'],
          missingKeywords: ['Microservices', 'CI/CD', 'Kubernetes', 'TDD'],
        },
        recommendations: [
          'Add TypeScript experience to your resume or start learning it',
          'Highlight any cloud platform experience (AWS, GCP, Azure)',
          'Include specific metrics for your achievements',
          'Mention any CI/CD or DevOps experience',
          'Consider adding GraphQL to your skill set',
        ],
        interviewReadiness: 'medium',
      })
      setLoading(false)
    }, 2500)
  }

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'high':
        return 'text-green-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
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
          <h1 className="text-4xl font-bold gradient-text">Resume vs Job Matcher</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your resume and paste a job description to see how well you match the role.
            Get personalized advice on how to improve your chances.
          </p>
        </motion.div>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resume Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleResumeUpload(e.target.files[0])}
                  />

                  <AnimatePresence mode="wait">
                    {!resumeFile ? (
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Drag & drop your resume or click to browse
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resumeInputRef.current?.click()}
                        >
                          Select PDF
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="file"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        <div className="w-12 h-12 mx-auto rounded-lg bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-sm font-medium">{resumeFile.name}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setResumeFile(null)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Description */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Match Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={handleMatch}
            disabled={!resumeFile || !jobDescription.trim() || loading}
            className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 px-8"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Match...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze Match
              </>
            )}
          </Button>
        </motion.div>

        {/* Match Results */}
        <AnimatePresence>
          {matchResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Overall Match */}
              <Card className="glass-card overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#matchGradient)"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56 * (matchResult.overallMatch / 100)} ${
                            2 * Math.PI * 56
                          }`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`text-3xl font-bold ${getScoreColor(matchResult.overallMatch)}`}
                        >
                          {matchResult.overallMatch}%
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold mb-2">Overall Match Score</h2>
                      <p className="text-muted-foreground mb-4">
                        Your resume matches {matchResult.overallMatch}% of the job requirements
                      </p>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <span className="text-sm text-muted-foreground">Interview Readiness:</span>
                        <span className={`font-medium capitalize ${getReadinessColor(matchResult.interviewReadiness)}`}>
                          {matchResult.interviewReadiness}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Skills Match', score: matchResult.skillsMatch.score, icon: Sparkles },
                  {
                    label: 'Experience Match',
                    score: matchResult.experienceMatch.score,
                    icon: Briefcase,
                  },
                  {
                    label: 'Education Match',
                    score: matchResult.educationMatch.score,
                    icon: FileText,
                  },
                  {
                    label: 'Keyword Match',
                    score: matchResult.keywordMatch.score,
                    icon: Sparkles,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass-card">
                      <CardContent className="p-4 text-center">
                        <item.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                        <p className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                          {item.score}%
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Skills Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Skills Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Matched Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.skillsMatch.matched.map((skill) => (
                          <Badge key={skill} className="bg-green-500/20 text-green-400">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Missing Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.skillsMatch.missing.map((skill) => (
                          <Badge key={skill} variant="destructive">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {matchResult.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
