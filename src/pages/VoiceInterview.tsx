import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Mic,
  MicOff,
  Volume2,
  Send,
  Loader2,
  MessageSquare,
  Brain,
  RotateCcw,
  Square,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Message {
  id: string
  role: 'ai' | 'user'
  content: string
  timestamp: Date
}

export default function VoiceInterview() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewComplete, setInterviewComplete] = useState(false)

  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      synthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      setCurrentTranscript(interimTranscript || finalTranscript)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [])

  const generateAIResponse = useCallback(async () => {
    setIsProcessing(true)

    // Simulate AI question generation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const questions = [
      "Tell me about yourself and your experience with software development.",
      "Can you describe a challenging technical problem you solved recently?",
      "How do you approach debugging issues in production?",
      "What's your experience with version control and collaboration?",
      "Can you explain your approach to writing clean, maintainable code?",
    ]

    const response = questions[questionCount % questions.length]

    setIsProcessing(false)
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'ai',
        content: response,
        timestamp: new Date(),
      },
    ])
    setQuestionCount((prev) => prev + 1)
    speak(response)
  }, [questionCount, speak])

  const submitAnswer = useCallback(() => {
    if (!currentTranscript.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content: currentTranscript,
        timestamp: new Date(),
      },
    ])
    setCurrentTranscript('')

    if (questionCount >= 4) {
      setInterviewComplete(true)
      stopListening()
    } else {
      setTimeout(generateAIResponse, 500)
    }
  }, [currentTranscript, questionCount, generateAIResponse, stopListening])

  const startInterview = useCallback(() => {
    setInterviewStarted(true)
    setMessages([])
    setQuestionCount(0)
    setInterviewComplete(false)
    setTimeout(generateAIResponse, 500)
  }, [generateAIResponse])

  const stopInterview = useCallback(() => {
    stopListening()
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setInterviewComplete(true)
  }, [stopListening])

  const resetInterview = useCallback(() => {
    setMessages([])
    setCurrentTranscript('')
    setQuestionCount(0)
    setInterviewStarted(false)
    setInterviewComplete(false)
    stopListening()
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [stopListening])

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold gradient-text">AI Voice Interview</h1>
          <p className="text-muted-foreground">
            Practice your interview skills with our AI interviewer. Speak naturally and get instant
            feedback.
          </p>
        </motion.div>

        {/* AI Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <div className="relative">
            <motion.div
              className={`w-32 h-32 rounded-full flex items-center justify-center ${
                isSpeaking
                  ? 'bg-gradient-to-br from-primary via-secondary to-accent'
                  : isListening
                    ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500'
                    : 'bg-gradient-to-br from-muted via-muted to-muted'
              }`}
              animate={{
                scale: isSpeaking ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: isSpeaking ? Infinity : 0,
              }}
            >
              <Brain className="w-16 h-16 text-white" />
            </motion.div>
            {(isSpeaking || isListening) && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>

        {/* Status */}
        {interviewStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isSpeaking ? 'bg-primary animate-pulse' : 'bg-muted'
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {isSpeaking ? 'AI Speaking...' : 'AI Silent'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isListening ? 'bg-green-500 animate-pulse' : 'bg-muted'
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {isListening ? 'Listening...' : 'Mic Off'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Question {Math.min(questionCount + 1, 5)} of 5
            </div>
          </motion.div>
        )}

        {/* Progress */}
        {interviewStarted && (
          <Progress value={(questionCount / 5) * 100} className="h-2" />
        )}

        {/* Chat Messages */}
        {interviewStarted && messages.length > 0 && (
          <Card className="glass-card">
            <CardContent className="p-4 max-h-80 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[80%] ${
                      msg.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'ai'
                          ? 'bg-gradient-to-br from-primary to-secondary'
                          : 'bg-gradient-to-br from-green-500 to-emerald-500'
                      }`}
                    >
                      {msg.role === 'ai' ? (
                        <Brain className="w-4 h-4 text-white" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        msg.role === 'ai' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Current Transcript */}
        {isListening && currentTranscript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-lg text-muted-foreground italic">"{currentTranscript}"</p>
          </motion.div>
        )}

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          {!interviewStarted ? (
            <Button
              size="lg"
              onClick={startInterview}
              className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 px-8"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Voice Interview
            </Button>
          ) : interviewComplete ? (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-xl bg-green-500/20 text-green-400">
                Interview complete! Great job practicing your interview skills.
              </div>
              <Button
                size="lg"
                onClick={resetInterview}
                className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Start New Interview
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                variant={isListening ? 'destructive' : 'default'}
                onClick={isListening ? stopListening : startListening}
                className={isListening ? '' : 'bg-gradient-to-r from-primary to-secondary'}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Start Speaking
                  </>
                )}
              </Button>
              {currentTranscript && (
                <Button size="lg" onClick={submitAnswer} variant="outline">
                  <Send className="w-5 h-5 mr-2" />
                  Submit Answer
                </Button>
              )}
              <Button size="lg" variant="ghost" onClick={stopInterview}>
                <Square className="w-5 h-5 mr-2" />
                End Interview
              </Button>
            </div>
          )}
        </motion.div>

        {/* Instructions */}
        {!interviewStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">How it works:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-primary" />
                    AI interviewer will speak questions aloud
                  </li>
                  <li className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-primary" />
                    Click &quot;Start Speaking&quot; and answer the question
                  </li>
                  <li className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-primary" />
                    Submit your answer when done
                  </li>
                  <li className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    AI generates the next question dynamically
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
