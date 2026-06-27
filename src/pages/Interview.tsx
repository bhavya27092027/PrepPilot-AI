import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Send, Clock, SkipForward, RotateCcw,
  ArrowLeft, Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { generateQuestion, evaluateAnswer } from '@/lib/ai-service'
import { formatDuration } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import type { Interview, Question, Answer } from '@/types'

interface Message {
  id: string
  role: 'ai' | 'user'
  content: string
  isTyping?: boolean
  isQuestion?: boolean
}

export default function Interview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()

  const [interview, setInterview] = useState<Interview | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<number | null>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Fetch interview data
  useEffect(() => {
    if (!id || !user) return

    async function fetchInterview() {
      try {
        // Fetch interview
        const { data: interviewData, error: interviewError } = await supabase
          .from('interviews')
          .select('*')
          .eq('id', id)
          .eq('user_id', user!.id)
          .single()

        if (interviewError) throw interviewError
        setInterview(interviewData)

        // Fetch questions
        const { data: questionsData } = await supabase
          .from('questions')
          .select('*')
          .eq('interview_id', id)
          .order('order_index', { ascending: true })

        setQuestions(questionsData || [])
        setCurrentQuestionIndex(interviewData.current_question_index)

        // Fetch answers
        const { data: answersData } = await supabase
          .from('answers')
          .select('*')
          .eq('interview_id', id)

        setAnswers(answersData || [])

        // If no questions yet, generate first one
        if (!questionsData || questionsData.length === 0) {
          await generateFirstQuestion(interviewData)
        } else {
          // Rebuild messages from existing Q&A
          const msgs: Message[] = []
          questionsData.forEach((q) => {
            msgs.push({
              id: `q-${q.id}`,
              role: 'ai',
              content: q.question_text,
              isQuestion: true,
            })
            const answer = answersData?.find(a => a.question_id === q.id)
            if (answer) {
              msgs.push({
                id: `a-${answer.id}`,
                role: 'user',
                content: answer.answer_text,
              })
            }
          })
          setMessages(msgs)

          // Set current question index
          const answeredCount = answersData?.length || 0
          if (answeredCount < (questionsData?.length || 0)) {
            setCurrentQuestionIndex(answeredCount)
          }
        }
      } catch (error) {
        console.error('Error fetching interview:', error)
        toast({
          title: 'Error',
          description: 'Failed to load interview',
          variant: 'destructive',
        })
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchInterview()
  }, [id, user!.id])

  async function generateFirstQuestion(interviewData: Interview) {
    setLoading(true)
    setMessages([{ id: 'typing', role: 'ai', content: '', isTyping: true }])

    try {
      const result = await generateQuestion(
        interviewData.job_role,
        interviewData.company,
        interviewData.domain,
        interviewData.difficulty
      )

      // Save question to DB
      const { data: savedQuestion, error } = await supabase
        .from('questions')
        .insert({
          interview_id: id,
          question_text: result.question_text,
          question_type: result.question_type,
          difficulty: result.difficulty,
          order_index: 0,
        })
        .select()
        .single()

      if (error) throw error

      setQuestions([savedQuestion])
      setMessages([
        {
          id: `q-${savedQuestion.id}`,
          role: 'ai',
          content: savedQuestion.question_text,
          isQuestion: true,
        },
      ])
    } catch (error) {
      console.error('Error generating question:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate interview question. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function generateNextQuestion() {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion || !interview) return

    setLoading(true)
    setMessages(prev => [...prev, { id: 'typing', role: 'ai', content: '', isTyping: true }])

    try {
      const result = await generateQuestion(
        interview.job_role as any,
        interview.company as any,
        interview.domain as any,
        interview.difficulty as any
      )

      // Save question
      const { data: savedQuestion, error } = await supabase
        .from('questions')
        .insert({
          interview_id: id,
          question_text: result.question_text,
          question_type: result.question_type,
          difficulty: result.difficulty,
          order_index: currentQuestionIndex + 1,
        })
        .select()
        .single()

      if (error) throw error

      setQuestions(prev => [...prev, savedQuestion])
      setMessages(prev => [
        ...prev.filter(m => m.id !== 'typing'),
        {
          id: `q-${savedQuestion.id}`,
          role: 'ai',
          content: savedQuestion.question_text,
          isQuestion: true,
        },
      ])
      setCurrentQuestionIndex(prev => prev + 1)
      setQuestionStartTime(Date.now())
    } catch (error) {
      console.error('Error generating question:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate next question',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function submitAnswer() {
    if (!currentAnswer.trim() || !questions[currentQuestionIndex] || !interview || submitting) return

    setSubmitting(true)
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000)

    try {
      const question = questions[currentQuestionIndex]

      const evaluation = await evaluateAnswer(
        question,
        currentAnswer,
        interview.domain as any,
        interview.job_role as any,
        timeTaken
      )

      // Save answer
      const { data: savedAnswer, error } = await supabase
        .from('answers')
        .insert({
          question_id: question.id,
          interview_id: id,
          answer_text: currentAnswer,
          time_taken_seconds: timeTaken,
          technical_accuracy: evaluation.technical_accuracy,
          communication: evaluation.communication,
          problem_solving: evaluation.problem_solving,
          clarity: evaluation.clarity,
          confidence: evaluation.confidence,
          completeness: evaluation.completeness,
          overall_score: evaluation.overall_score,
          feedback: evaluation.feedback,
          improvement_suggestions: evaluation.improvement_suggestions,
        })
        .select()
        .single()

      if (error) throw error

      setAnswers(prev => [...prev, savedAnswer])
      setMessages(prev => [
        ...prev,
        {
          id: `a-${savedAnswer.id}`,
          role: 'user',
          content: currentAnswer,
        },
        {
          id: `feedback-${savedAnswer.id}`,
          role: 'ai',
          content: `Score: ${evaluation.overall_score}/100\n\n${evaluation.feedback}`,
        },
      ])
      setCurrentAnswer('')

      // Check if interview is complete
      if (answers.length + 1 >= interview.total_questions) {
        await completeInterview()
      } else {
        // Generate next question after a short delay
        setTimeout(generateNextQuestion, 1500)
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit answer',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function completeInterview() {
    if (!interview || !id) return

    try {
      // Update interview status
      await supabase
        .from('interviews')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', id)

      // Navigate to report
      navigate(`/interview/${id}/report`)
    } catch (error) {
      console.error('Error completing interview:', error)
    }
  }

  async function skipQuestion() {
    if (currentQuestionIndex + 1 < interview?.total_questions!) {
      setCurrentAnswer('')
      await generateNextQuestion()
    } else {
      await completeInterview()
    }
  }

  function retryQuestion() {
    setCurrentAnswer('')
    inputRef.current?.focus()
  }

  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-xl font-medium mb-2">Preparing Your Interview</p>
          <p className="text-muted-foreground">AI is generating your first question...</p>
        </div>
      </div>
    )
  }

  const progress = interview ? ((currentQuestionIndex + (answers.length > currentQuestionIndex ? 1 : 0)) / interview.total_questions) * 100 : 0
  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit Interview</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatDuration(elapsedTime)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Progress value={progress} className="flex-1" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {currentQuestionIndex + 1} / {interview?.total_questions || 0}
            </span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${message.role === 'ai'
                        ? 'bg-gradient-to-br from-primary to-secondary'
                        : 'bg-muted'
                        }`}
                    >
                      {message.role === 'ai' ? (
                        <Brain className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-sm font-medium">You</span>
                      )}
                    </div>

                    <div
                      className={`rounded-2xl p-4 ${message.role === 'ai'
                        ? 'bg-muted/50 border'
                        : 'bg-primary text-primary-foreground'
                        } ${message.isQuestion ? 'border-primary/20 bg-primary/5' : ''}`}
                    >
                      {message.isTyping ? (
                        <div className="flex items-center gap-1 py-2">
                          <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-primary"
                          />
                          <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 rounded-full bg-primary"
                          />
                          <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 rounded-full bg-primary"
                          />
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="glass border-t">
        <div className="max-w-3xl mx-auto px-6 py-4">
          {currentQuestion && answers.length <= currentQuestionIndex && (
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                {answers.length >= currentQuestionIndex && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={retryQuestion}
                      disabled={loading}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Retry
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={skipQuestion}
                      disabled={loading}
                    >
                      <SkipForward className="w-4 h-4 mr-1" />
                      Skip
                    </Button>
                  </>
                )}
              </div>

              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full min-h-[120px] rounded-xl border border-input bg-background p-4 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={submitting || loading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault()
                      submitAnswer()
                    }
                  }}
                />
                <Button
                  onClick={submitAnswer}
                  disabled={!currentAnswer.trim() || submitting || loading}
                  className="absolute bottom-4 right-4"
                  size="sm"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Press Cmd/Ctrl + Enter to submit
              </p>
            </div>
          )}

          {loading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">AI is thinking...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
