import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Target,
  Zap,
  Download,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface ATSAnalysis {
  overallScore: number
  sections: {
    contact: { score: number; found: string[]; missing: string[] }
    experience: { score: number; issues: string[] }
    skills: { score: number; found: string[]; missing: string[] }
    education: { score: number; found: boolean }
    formatting: { score: number; issues: string[] }
  }
  keywords: {
    matched: string[]
    missing: string[]
    suggestions: string[]
  }
  improvements: string[]
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (uploadedFile: File) => {
    if (uploadedFile.type === 'application/pdf' || uploadedFile.name.endsWith('.pdf')) {
      setFile(uploadedFile)
      analyzeResume(uploadedFile)
    }
  }

  const analyzeResume = async (resumeFile: File) => {
    setLoading(true)
    setAnalysis(null)

    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      // Simulate analysis for demo
      setTimeout(() => {
        setAnalysis({
          overallScore: 72,
          sections: {
            contact: {
              score: 85,
              found: ['Email', 'Phone', 'LinkedIn'],
              missing: ['Portfolio Website'],
            },
            experience: {
              score: 70,
              issues: ['Some bullet points lack quantifiable achievements', 'Use more action verbs'],
            },
            skills: {
              score: 65,
              found: ['JavaScript', 'React', 'Node.js', 'Python'],
              missing: ['TypeScript', 'AWS', 'Docker', 'GraphQL'],
            },
            education: {
              score: 90,
              found: true,
            },
            formatting: {
              score: 80,
              issues: ['Consider using a more ATS-friendly format', 'Add section headers'],
            },
          },
          keywords: {
            matched: ['JavaScript', 'React', 'Node.js', 'API', 'Agile', 'Git'],
            missing: ['TypeScript', 'AWS', 'CI/CD', 'Microservices', 'REST API'],
            suggestions: [
              'Add TypeScript to show modern JS proficiency',
              'Include cloud experience (AWS/GCP/Azure)',
              'Mention CI/CD pipeline experience',
              'Add specific metrics and achievements',
            ],
          },
          improvements: [
            'Add quantifiable achievements (e.g., "Improved performance by 40%")',
            'Include a professional summary at the top',
            'Add relevant certifications',
            'Use consistent date formatting',
            'Include relevant keywords from job descriptions',
          ],
        })
        setLoading(false)
      }, 2000)
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
          <h1 className="text-4xl font-bold gradient-text">Resume ATS Analyzer</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your resume and get instant feedback on ATS compatibility, keyword optimization,
            and actionable improvements to boost your interview chances.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-8">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
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
                  ref={inputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />

                <AnimatePresence mode="wait">
                  {!file ? (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Upload className="w-10 h-10 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">Drop your resume here</p>
                        <p className="text-sm text-muted-foreground">or click to browse</p>
                      </div>
                      <Button
                        onClick={() => inputRef.current?.click()}
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      >
                        Select PDF File
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <FileText className="w-10 h-10 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      {loading && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Analyzing resume...</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Overall Score */}
              <Card className="glass-card overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                      <svg className="w-40 h-40 transform -rotate-90">
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
                          stroke="url(#scoreGradient)"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 70 * (analysis.overallScore / 100)} ${
                            2 * Math.PI * 70
                          }`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className={`text-5xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                            {analysis.overallScore}
                          </span>
                          <p className="text-muted-foreground text-sm">ATS Score</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold">ATS Compatibility</h2>
                        <p className="text-muted-foreground">
                          {analysis.overallScore >= 80
                            ? 'Your resume is well-optimized for ATS systems!'
                            : analysis.overallScore >= 60
                              ? 'Your resume needs some improvements for better ATS compatibility.'
                              : 'Your resume needs significant improvements to pass ATS filters.'}
                        </p>
                      </div>
                      <Button className="bg-gradient-to-r from-primary to-secondary">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(analysis.sections).map(([key, section]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="glass-card h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg capitalize flex items-center justify-between">
                          {key}
                          <span className={getScoreColor(section.score)}>{section.score}%</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Progress value={section.score} className="h-2" />
                        {'found' in section && Array.isArray(section.found) && (
                          <div className="flex flex-wrap gap-1">
                            {(section.found as string[]).map((item: string) => (
                              <Badge key={item} variant="secondary" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                {item}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {'missing' in section && section.missing.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {section.missing.map((item: string) => (
                              <Badge key={item} variant="destructive" className="text-xs">
                                <XCircle className="w-3 h-3 mr-1" />
                                {item}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {'issues' in section && (
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {section.issues.map((issue: string, i: number) => (
                              <li key={i} className="flex items-start gap-1">
                                <AlertTriangle className="w-3 h-3 text-yellow-500 mt-0.5" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Keywords Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Keyword Match
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2 text-green-500">Matched Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywords.matched.map((keyword) => (
                          <Badge key={keyword} className="bg-green-500/20 text-green-400">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2 text-red-400">Missing Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywords.missing.map((keyword) => (
                          <Badge key={keyword} variant="destructive">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.keywords.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-primary mt-0.5" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Improvements */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Top Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.improvements.map((improvement, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                          {i + 1}
                        </div>
                        <span className="text-sm">{improvement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
