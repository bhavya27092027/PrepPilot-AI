import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, Trophy, Target, TrendingUp, Star, AlertTriangle,
  BookOpen, CheckCircle2, Download, ArrowLeft, Clock
} from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { formatDate, getScoreColor, formatDuration } from '@/lib/utils'
import { JOB_ROLE_LABELS, DOMAIN_LABELS } from '@/types'
import type { Interview, Question, Answer } from '@/types'
import { useToast } from '@/hooks/use-toast'
import jsPDF from 'jspdf'

export default function InterviewReport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()

  const [interview, setInterview] = useState<Interview | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (!id || !user) return
    fetchReport()
  }, [id, user])

  async function fetchReport() {
    try {
      const { data: interviewData, error: interviewError } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', id)
        .eq('user_id', user!.id)
        .single()

      if (interviewError) throw interviewError
      setInterview(interviewData)

      const { data: questionsData } = await supabase
        .from('questions')
        .select('*')
        .eq('interview_id', id)
        .order('order_index', { ascending: true })

      setQuestions(questionsData || [])

      const { data: answersData } = await supabase
        .from('answers')
        .select('*')
        .eq('interview_id', id)

      setAnswers(answersData || [])
    } catch (error) {
      console.error('Error fetching report:', error)
      toast({
        title: 'Error',
        description: 'Failed to load interview report',
        variant: 'destructive',
      })
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const getRadarData = () => {
    if (!answers.length) return []
    const avg = {
      technical: answers.reduce((sum, a) => sum + a.technical_accuracy, 0) / answers.length,
      communication: answers.reduce((sum, a) => sum + a.communication, 0) / answers.length,
      problemSolving: answers.reduce((sum, a) => sum + a.problem_solving, 0) / answers.length,
      clarity: answers.reduce((sum, a) => sum + a.clarity, 0) / answers.length,
      confidence: answers.reduce((sum, a) => sum + a.confidence, 0) / answers.length,
      completeness: answers.reduce((sum, a) => sum + a.completeness, 0) / answers.length,
    }
    return [
      { subject: 'Technical', value: avg.technical, fullMark: 100 },
      { subject: 'Communication', value: avg.communication, fullMark: 100 },
      { subject: 'Problem Solving', value: avg.problemSolving, fullMark: 100 },
      { subject: 'Clarity', value: avg.clarity, fullMark: 100 },
      { subject: 'Confidence', value: avg.confidence, fullMark: 100 },
      { subject: 'Completeness', value: avg.completeness, fullMark: 100 },
    ]
  }

  const getQuestionData = () => {
    return questions.map((_, idx) => ({
      name: `Q${idx + 1}`,
      score: answers[idx]?.overall_score || 0,
    }))
  }

  async function exportPDF() {
    if (!interview) return
    setExporting(true)

    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()

      // Title
      doc.setFontSize(24)
      doc.setTextColor(99, 102, 241)
      doc.text('InterviewPro AI', pageWidth / 2, 20, { align: 'center' })

      doc.setFontSize(18)
      doc.setTextColor(0, 0, 0)
      doc.text('Interview Report', pageWidth / 2, 30, { align: 'center' })

      // Interview Details
      doc.setFontSize(12)
      doc.text(`Date: ${formatDate(interview.completed_at || interview.created_at)}`, 20, 50)
      doc.text(`Role: ${JOB_ROLE_LABELS[interview.job_role as keyof typeof JOB_ROLE_LABELS]}`, 20, 58)
      doc.text(`Domain: ${DOMAIN_LABELS[interview.domain as keyof typeof DOMAIN_LABELS]}`, 20, 66)
      doc.text(`Difficulty: ${interview.difficulty}`, 20, 74)

      // Overall Score
      doc.setFontSize(16)
      doc.text(`Overall Score: ${interview.overall_score}%`, 20, 90)

      // Section Scores
      doc.setFontSize(12)
      doc.text('Section Scores:', 20, 105)
      doc.text(`Technical: ${interview.technical_score}%`, 25, 113)
      doc.text(`Communication: ${interview.communication_score}%`, 25, 121)
      doc.text(`Problem Solving: ${interview.problem_solving_score}%`, 25, 129)

      // Strengths
      doc.text('Strengths:', 20, 145)
      interview.strengths?.forEach((strength, i) => {
        doc.text(`• ${strength}`, 25, 153 + i * 8)
      })

      // Weaknesses
      const weaknessStart = 145 + (interview.strengths?.length || 0) * 8 + 10
      doc.text('Areas to Improve:', 20, weaknessStart)
      interview.weaknesses?.forEach((weakness, i) => {
        doc.text(`• ${weakness}`, 25, weaknessStart + 8 + i * 8)
      })

      // Learning Plan
      const learningStart = weaknessStart + (interview.weaknesses?.length || 0) * 8 + 20
      doc.text('Personalized Learning Plan:', 20, learningStart)
      interview.learning_plan?.forEach((item, i) => {
        doc.text(`${i + 1}. ${item}`, 25, learningStart + 8 + i * 8)
      })

      // Questions and Answers
      const qaStart = learningStart + (interview.learning_plan?.length || 0) * 8 + 20
      let currentY = qaStart

      doc.text('Questions & Answers:', 20, currentY)
      currentY += 10

      questions.forEach((q, i) => {
        const answer = answers[i]
        if (currentY > 270) {
          doc.addPage()
          currentY = 20
        }

        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        const questionLines = doc.splitTextToSize(`Q${i + 1}: ${q.question_text}`, pageWidth - 50)
        doc.text(questionLines, 25, currentY)
        currentY += questionLines.length * 5 + 5

        doc.setFont('helvetica', 'normal')
        const answerText = answer?.answer_text || 'Not answered'
        const answerLines = doc.splitTextToSize(`A: ${answerText}`, pageWidth - 50)
        doc.text(answerLines, 25, currentY)
        currentY += answerLines.length * 5 + 5

        if (answer) {
          doc.text(`Score: ${answer.overall_score}% - ${answer.feedback}`, 25, currentY)
          currentY += 10
        }
      })

      doc.save(`interview-report-${id}.pdf`)
      toast({
        title: 'Success',
        description: 'Report exported as PDF',
      })
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast({
        title: 'Error',
        description: 'Failed to export PDF',
        variant: 'destructive',
      })
    } finally {
      setExporting(false)
    }
  }

  async function exportJSON() {
    if (!interview) return

    const reportData = {
      interview: {
        id: interview.id,
        role: JOB_ROLE_LABELS[interview.job_role as keyof typeof JOB_ROLE_LABELS],
        domain: DOMAIN_LABELS[interview.domain as keyof typeof DOMAIN_LABELS],
        difficulty: interview.difficulty,
        type: interview.interview_type,
        status: interview.status,
        overall_score: interview.overall_score,
        technical_score: interview.technical_score,
        communication_score: interview.communication_score,
        problem_solving_score: interview.problem_solving_score,
        strengths: interview.strengths,
        weaknesses: interview.weaknesses,
        learning_plan: interview.learning_plan,
        suggested_resources: interview.suggested_resources,
        date: interview.completed_at || interview.created_at,
      },
      questions: questions.map((q, i) => ({
        question: q.question_text,
        type: q.question_type,
        difficulty: q.difficulty,
        answer: answers[i]?.answer_text || 'Not answered',
        score: answers[i]?.overall_score,
        feedback: answers[i]?.feedback,
        improvement_suggestions: answers[i]?.improvement_suggestions,
      })),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `interview-report-${id}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: 'Success',
      description: 'Report exported as JSON',
    })
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!interview) return null

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold">Interview Report</h1>
          <p className="text-muted-foreground mt-2">
            {JOB_ROLE_LABELS[interview.job_role as keyof typeof JOB_ROLE_LABELS]} • {DOMAIN_LABELS[interview.domain as keyof typeof DOMAIN_LABELS]} • {formatDate(interview.completed_at || interview.created_at)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportJSON}>
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={exportPDF} disabled={exporting}>
            {exporting ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export PDF
          </Button>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card glass className="text-center p-6">
            <Trophy className="w-8 h-8 mx-auto mb-3 text-primary" />
            <p className="text-muted-foreground text-sm">Overall Score</p>
            <p className={`text-4xl font-bold ${getScoreColor(interview.overall_score || 0)}`}>
              {interview.overall_score}%
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card glass className="text-center p-6">
            <Target className="w-8 h-8 mx-auto mb-3 text-secondary" />
            <p className="text-muted-foreground text-sm">Technical</p>
            <p className={`text-4xl font-bold ${getScoreColor(interview.technical_score || 0)}`}>
              {interview.technical_score}%
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card glass className="text-center p-6">
            <TrendingUp className="w-8 h-8 mx-auto mb-3 text-accent" />
            <p className="text-muted-foreground text-sm">Communication</p>
            <p className={`text-4xl font-bold ${getScoreColor(interview.communication_score || 0)}`}>
              {interview.communication_score}%
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card glass className="text-center p-6">
            <Brain className="w-8 h-8 mx-auto mb-3 text-primary" />
            <p className="text-muted-foreground text-sm">Problem Solving</p>
            <p className={`text-4xl font-bold ${getScoreColor(interview.problem_solving_score || 0)}`}>
              {interview.problem_solving_score}%
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card glass>
            <CardHeader>
              <CardTitle>Skill Radar</CardTitle>
              <CardDescription>Performance across all dimensions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={getRadarData()}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" className="text-xs" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke="hsl(239, 84%, 67%)"
                      fill="hsl(239, 84%, 67%)"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card glass>
            <CardHeader>
              <CardTitle>Question-wise Scores</CardTitle>
              <CardDescription>Performance on each question</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getQuestionData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {getQuestionData().map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#f59e0b' : '#ef4444'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {interview.strengths?.length ? interview.strengths.map((strength, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>{strength}</span>
                </div>
              )) : (
                <p className="text-muted-foreground">No specific strengths identified</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {interview.weaknesses?.length ? interview.weaknesses.map((weakness, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <span>{weakness}</span>
                </div>
              )) : (
                <p className="text-muted-foreground">Great job! No significant weaknesses.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Learning Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card glass>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Personalized Learning Plan
            </CardTitle>
            <CardDescription>Actionable steps to improve your interview performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {interview.learning_plan?.map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <p className="flex-1">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Questions & Answers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card glass>
          <CardHeader>
            <CardTitle>Questions & Answers</CardTitle>
            <CardDescription>Detailed breakdown of each question</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, i) => {
              const answer = answers[i]
              return (
                <div key={question.id} className="p-6 rounded-xl bg-muted/30 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          question.question_type === 'technical'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-secondary/20 text-secondary'
                        }`}>
                          {question.question_type}
                        </span>
                        <span>Question {i + 1}</span>
                      </div>
                      <p className="font-medium">{question.question_text}</p>
                    </div>
                    {answer && (
                      <div className={`text-2xl font-bold ${getScoreColor(answer.overall_score)}`}>
                        {answer.overall_score}%
                      </div>
                    )}
                  </div>

                  <div className="pl-4 border-l-2 border-border">
                    <p className="text-sm text-muted-foreground mb-1">Your Answer:</p>
                    <p className="text-sm">{answer?.answer_text || 'Not answered'}</p>
                  </div>

                  {answer && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-6 gap-2 text-xs">
                        {[
                          { label: 'Technical', value: answer.technical_accuracy },
                          { label: 'Communication', value: answer.communication },
                          { label: 'Problem Solving', value: answer.problem_solving },
                          { label: 'Clarity', value: answer.clarity },
                          { label: 'Confidence', value: answer.confidence },
                          { label: 'Completeness', value: answer.completeness },
                        ].map((metric) => (
                          <div key={metric.label} className="text-center">
                            <div className={`font-bold ${getScoreColor(metric.value)}`}>
                              {metric.value}
                            </div>
                            <div className="text-muted-foreground">{metric.label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 rounded-lg bg-background">
                        <p className="text-sm font-medium mb-1">Feedback:</p>
                        <p className="text-sm text-muted-foreground">{answer.feedback}</p>
                      </div>

                      {answer.improvement_suggestions?.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Improvement Tips:</p>
                          <ul className="text-sm text-muted-foreground list-disc pl-4">
                            {answer.improvement_suggestions.map((tip, j) => (
                              <li key={j}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Time: {formatDuration(answer.time_taken_seconds)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Start New Interview */}
      <div className="flex justify-center">
        <Link to="/interview/setup">
          <Button variant="gradient" size="lg">
            <Brain className="w-5 h-5 mr-2" />
            Start New Interview
          </Button>
        </Link>
      </div>
    </div>
  )
}
