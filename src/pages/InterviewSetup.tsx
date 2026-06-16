import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, ChevronRight, Check, ArrowLeft, Clock, Layers, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { JOB_ROLES, DOMAINS, DIFFICULTIES, INTERVIEW_TYPES, QUESTION_COUNTS, DOMAINS_BY_ROLE } from '@/lib/constants'
import type { JobRole, Domain, Difficulty, InterviewType } from '@/types'

const steps = [
  { id: 'role', title: 'Select Role', description: 'Choose your target position' },
  { id: 'domain', title: 'Choose Domain', description: 'Pick your interview topic' },
  { id: 'difficulty', title: 'Set Difficulty', description: 'Select challenge level' },
  { id: 'type', title: 'Interview Type', description: 'Technical or behavioral' },
  { id: 'questions', title: 'Question Count', description: 'How many questions' },
]

export default function InterviewSetup() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [config, setConfig] = useState({
    job_role: '' as JobRole | '',
    domain: '' as Domain | '',
    difficulty: 'intermediate' as Difficulty,
    interview_type: 'technical' as InterviewType,
    num_questions: 5,
  })

  const filteredDomains = config.job_role
    ? DOMAINS.filter(d => DOMAINS_BY_ROLE[config.job_role]?.includes(d.value))
    : DOMAINS

  useEffect(() => {
    if (config.job_role && filteredDomains.length > 0 && !filteredDomains.find(d => d.value === config.domain)) {
      setConfig(prev => ({ ...prev, domain: filteredDomains[0].value as Domain }))
    }
  }, [config.job_role])

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!config.job_role
      case 1: return !!config.domain
      case 2: return true
      case 3: return true
      case 4: return true
      default: return false
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      startInterview()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    } else {
      navigate('/dashboard')
    }
  }

  const startInterview = async () => {
    setLoading(true)
    try {
      // Create interview in database
      const { data: interview, error } = await supabase
        .from('interviews')
        .insert({
          user_id: user!.id,
          job_role: config.job_role,
          domain: config.domain,
          difficulty: config.difficulty,
          interview_type: config.interview_type,
          total_questions: config.num_questions,
          status: 'in_progress',
        })
        .select()
        .single()

      if (error) throw error
      if (interview) {
        navigate(`/interview/${interview.id}`)
      }
    } catch (error) {
      console.error('Error starting interview:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Interview Setup</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Configure Your Interview</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Customize your practice session to match your career goals
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                    index < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 bg-muted rounded-full">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: index < currentStep ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="font-medium">{steps[currentStep].title}</p>
            <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
              {currentStep === 0 && (
                <div className="grid md:grid-cols-2 gap-4">
                  {JOB_ROLES.map((role) => (
                    <motion.div
                      key={role.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        glass
                        className={`cursor-pointer transition-all ${
                          config.job_role === role.value
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setConfig(prev => ({ ...prev, job_role: role.value as JobRole }))}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <Brain className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-lg">{role.label}</p>
                              </div>
                            </div>
                            {config.job_role === role.value && (
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredDomains.map((domain) => (
                    <motion.div
                      key={domain.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        glass
                        className={`cursor-pointer transition-all ${
                          config.domain === domain.value
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setConfig(prev => ({ ...prev, domain: domain.value as Domain }))}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                                <Layers className="w-6 h-6 text-white" />
                              </div>
                              <p className="font-semibold text-lg">{domain.label}</p>
                            </div>
                            {config.domain === domain.value && (
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  {DIFFICULTIES.map((difficulty) => (
                    <motion.div
                      key={difficulty.value}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Card
                        glass
                        className={`cursor-pointer transition-all ${
                          config.difficulty === difficulty.value
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setConfig(prev => ({ ...prev, difficulty: difficulty.value as Difficulty }))}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-lg">{difficulty.label}</p>
                              <p className="text-muted-foreground">{difficulty.description}</p>
                            </div>
                            {config.difficulty === difficulty.value && (
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid md:grid-cols-3 gap-4">
                  {INTERVIEW_TYPES.map((type) => (
                    <motion.div
                      key={type.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        glass
                        className={`cursor-pointer transition-all ${
                          config.interview_type === type.value
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setConfig(prev => ({ ...prev, interview_type: type.value as InterviewType }))}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
                            <Brain className="w-8 h-8 text-white" />
                          </div>
                          <p className="font-semibold text-lg mb-2">{type.label}</p>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                          {config.interview_type === type.value && (
                            <div className="mt-4 w-8 h-8 rounded-full bg-primary mx-auto flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <p className="text-center text-muted-foreground">
                    Select the number of questions for your interview
                  </p>
                  <div className="flex justify-center gap-4">
                    {QUESTION_COUNTS.map((count) => (
                      <motion.div
                        key={count}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card
                          glass
                          className={`cursor-pointer transition-all ${
                            config.num_questions === count
                              ? 'ring-2 ring-primary bg-primary/5'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setConfig(prev => ({ ...prev, num_questions: count }))}
                        >
                          <CardContent className="p-8 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
                              <Clock className="w-10 h-10 text-white" />
                            </div>
                            <p className="text-3xl font-bold">{count}</p>
                            <p className="text-sm text-muted-foreground">questions</p>
                            {config.num_questions === count && (
                              <div className="mt-4 w-8 h-8 rounded-full bg-primary mx-auto flex items-center justify-center">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Summary */}
                  <Card glass className="mt-8">
                    <CardHeader>
                      <CardTitle>Interview Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Role</p>
                          <p className="font-medium">{JOB_ROLES.find(r => r.value === config.job_role)?.label}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Domain</p>
                          <p className="font-medium">{DOMAINS.find(d => d.value === config.domain)?.label}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Difficulty</p>
                          <p className="font-medium capitalize">{config.difficulty}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Questions</p>
                          <p className="font-medium">{config.num_questions}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mt-12"
        >
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 0 ? 'Back to Dashboard' : 'Previous'}
          </Button>

          <Button
            variant="gradient"
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="min-w-[160px]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : currentStep === steps.length - 1 ? (
              <>
                Start Interview
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
