import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, Calendar, Search, Filter, Download,
  TrendingUp, Clock, FileText, BarChart3
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { formatDate, getScoreColor } from '@/lib/utils'
import { JOB_ROLE_LABELS, DOMAIN_LABELS } from '@/types'
import type { Interview } from '@/types'
import jsPDF from 'jspdf'

interface InterviewWithStats extends Interview {
  question_count: number
}

export default function History() {
  const { user } = useAuth()

  const [interviews, setInterviews] = useState<InterviewWithStats[]>([])
  const [filteredInterviews, setFilteredInterviews] = useState<InterviewWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterDomain, setFilterDomain] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date')

  useEffect(() => {
    if (user) fetchInterviews()
  }, [user])

  useEffect(() => {
    let filtered = [...interviews]

    // Search
    if (searchQuery) {
      filtered = filtered.filter(i =>
        i.job_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.domain.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(i => i.job_role === filterRole)
    }

    // Filter by domain
    if (filterDomain !== 'all') {
      filtered = filtered.filter(i => i.domain === filterDomain)
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      return (b.overall_score || 0) - (a.overall_score || 0)
    })

    setFilteredInterviews(filtered)
  }, [interviews, searchQuery, filterRole, filterDomain, sortBy])

  async function fetchInterviews() {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*, questions(count)')
        .eq('user_id', user!.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedData = (data || []).map(i => ({
        ...i,
        question_count: (i as unknown as { questions: { count: number }[] }).questions?.[0]?.count || 0,
      }))

      setInterviews(formattedData)
      setFilteredInterviews(formattedData)
    } catch (error) {
      console.error('Error fetching interviews:', error)
    } finally {
      setLoading(false)
    }
  }

  async function exportAllPDF() {
    if (!filteredInterviews.length) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFontSize(24)
    doc.setTextColor(99, 102, 241)
    doc.text('InterviewPro AI', pageWidth / 2, 20, { align: 'center' })

    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.text('Interview History', pageWidth / 2, 30, { align: 'center' })

    let y = 45

    filteredInterviews.forEach((interview, index) => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`Interview ${index + 1}`, 20, y)
      y += 8

      doc.setFont('helvetica', 'normal')
      doc.text(`Date: ${formatDate(interview.created_at)}`, 25, y)
      y += 6
      doc.text(`Role: ${JOB_ROLE_LABELS[interview.job_role as keyof typeof JOB_ROLE_LABELS]}`, 25, y)
      y += 6
      doc.text(`Domain: ${DOMAIN_LABELS[interview.domain as keyof typeof DOMAIN_LABELS]}`, 25, y)
      y += 6
      doc.text(`Score: ${interview.overall_score}%`, 25, y)
      y += 15
    })

    doc.save('interview-history.pdf')
  }

  function exportAllJSON() {
    const data = filteredInterviews.map(interview => ({
      id: interview.id,
      role: JOB_ROLE_LABELS[interview.job_role as keyof typeof JOB_ROLE_LABELS],
      domain: DOMAIN_LABELS[interview.domain as keyof typeof DOMAIN_LABELS],
      difficulty: interview.difficulty,
      type: interview.interview_type,
      score: interview.overall_score,
      technical_score: interview.technical_score,
      communication_score: interview.communication_score,
      problem_solving_score: interview.problem_solving_score,
      total_questions: interview.total_questions,
      date: interview.created_at,
    }))

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'interview-history.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const roles = [...new Set(interviews.map(i => i.job_role))]
  const domains = [...new Set(interviews.map(i => i.domain))]

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Interview History</h1>
          <p className="text-muted-foreground">Review your past interview sessions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportAllJSON} disabled={!filteredInterviews.length}>
            <FileText className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={exportAllPDF} disabled={!filteredInterviews.length}>
            <Download className="w-4 h-4 mr-2" />
            Export All PDF
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card glass className="p-4 text-center">
          <Brain className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{interviews.length}</p>
          <p className="text-sm text-muted-foreground">Total Interviews</p>
        </Card>
        <Card glass className="p-4 text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-secondary" />
          <p className="text-2xl font-bold">
            {interviews.length > 0
              ? Math.round(interviews.reduce((sum, i) => sum + (i.overall_score || 0), 0) / interviews.length)
              : 0}%
          </p>
          <p className="text-sm text-muted-foreground">Average Score</p>
        </Card>
        <Card glass className="p-4 text-center">
          <BarChart3 className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
          <p className="text-2xl font-bold">
            {interviews.length > 0 ? Math.max(...interviews.map(i => i.overall_score || 0)) : 0}%
          </p>
          <p className="text-sm text-muted-foreground">Best Score</p>
        </Card>
        <Card glass className="p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold">
            {interviews.reduce((sum, i) => sum + i.total_questions, 0)}
          </p>
          <p className="text-sm text-muted-foreground">Questions Answered</p>
        </Card>
      </div>

      {/* Filters */}
      <Card glass>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search interviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>
                    {JOB_ROLE_LABELS[role as keyof typeof JOB_ROLE_LABELS]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDomain} onValueChange={setFilterDomain}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Domains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domains.map(domain => (
                  <SelectItem key={domain} value={domain}>
                    {DOMAIN_LABELS[domain as keyof typeof DOMAIN_LABELS]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'score')}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">By Date</SelectItem>
                <SelectItem value="score">By Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Interview List */}
      <div className="space-y-4">
        {filteredInterviews.length > 0 ? (
          filteredInterviews.map((interview, index) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/interview/${interview.id}/report`}>
                <Card glass className="group hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {JOB_ROLE_LABELS[interview.job_role as keyof typeof JOB_ROLE_LABELS]}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {DOMAIN_LABELS[interview.domain as keyof typeof DOMAIN_LABELS]} • {interview.total_questions} questions
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Technical</p>
                            <p className={`font-medium ${getScoreColor(interview.technical_score || 0)}`}>
                              {interview.technical_score}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Communication</p>
                            <p className={`font-medium ${getScoreColor(interview.communication_score || 0)}`}>
                              {interview.communication_score}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Problem Solving</p>
                            <p className={`font-medium ${getScoreColor(interview.problem_solving_score || 0)}`}>
                              {interview.problem_solving_score}%
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`text-3xl font-bold ${getScoreColor(interview.overall_score || 0)}`}>
                            {interview.overall_score}%
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(interview.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {interviews.length === 0
                ? 'No interviews yet. Start your first interview!'
                : 'No interviews match your filters'}
            </p>
            {interviews.length === 0 && (
              <Link to="/interview/setup">
                <Button variant="gradient" className="mt-4">
                  Start Interview
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
