import type { Domain, Difficulty, InterviewType, JobRole, Question, Answer } from '@/types'
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

async function callGemini(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);

    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate Gemini content");
  }
}

function getRoleDescription(role: JobRole): string {
  const descriptions: Record<JobRole, string> = {
    software_engineer: 'a Software Engineer position',
    frontend_developer: 'a Frontend Developer position',
    backend_developer: 'a Backend Developer position',
    full_stack_developer: 'a Full Stack Developer position',
    data_analyst: 'a Data Analyst position',
    product_manager: 'a Product Manager position',
    data_scientist: 'a Data Scientist position',
  }
  return descriptions[role]
}

function getDifficultyInstruction(difficulty: Difficulty): string {
  const instructions: Record<Difficulty, string> = {
    beginner: 'Keep questions straightforward and fundamental. Focus on core concepts and basic problem-solving.',
    intermediate: 'Ask moderately challenging questions that require deeper understanding and practical application.',
    advanced: 'Ask complex questions that test advanced knowledge, system design thinking, and edge cases.',
  }
  return instructions[difficulty]
}

export async function generateQuestion(
  role: JobRole,
  domain: Domain,
  difficulty: Difficulty,
  type: InterviewType,
  previousQA?: { question: string; answer: string }[]
): Promise<Omit<Question, 'id' | 'interview_id' | 'created_at'>> {
  const prompt = `You are an expert technical interviewer for ${getRoleDescription(role)}.

Generate ONE interview question about ${domain.replace(/_/g, ' ')}.
Difficulty: ${difficulty}
${getDifficultyInstruction(difficulty)}
Type: ${type === 'behavioral' ? 'behavioral/situational question' : type === 'technical' ? 'technical question' : 'either technical or behavioral question'}

${previousQA && previousQA.length > 0 ? `
Context from previous Q&A:
${previousQA.map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`).join('\n')}

Generate a relevant follow-up question that builds on the previous discussion.
` : 'Generate an opening question that sets up the interview.'}

Return the question as plain text, no markdown, no quotes.

Also indicate if this is a technical or behavioral question by appending either [TECHNICAL] or [BEHAVIORAL] at the end.`

  const response = await callGemini(prompt)
  const isTechnical = response.includes('[TECHNICAL]')
  const questionText = response.replace(/\[TECHNICAL\]|\[BEHAVIORAL\]/g, '').trim()

  return {
    question_text: questionText,
    question_type: isTechnical ? 'technical' : 'behavioral',
    difficulty,
    order_index: previousQA?.length || 0,
    follow_up_for: previousQA && previousQA.length > 0 ? 'previous' : null,
  }
}

export async function evaluateAnswer(
  question: Question,
  answer: string,
  domain: Domain,
  role: JobRole,
  timeTaken: number
): Promise<Omit<Answer, 'id' | 'question_id' | 'interview_id' | 'created_at'>> {
  const prompt = `You are an expert interview evaluator for a ${role.replace(/_/g, ' ')} position.

Question: ${question.question_text}
Domain: ${domain.replace(/_/g, ' ')}
Difficulty: ${question.difficulty}

Candidate's Answer:
"${answer}"

Time taken: ${Math.floor(timeTaken / 60)} minutes ${timeTaken % 60} seconds

Evaluate the answer on these criteria (score 0-100 for each):
1. Technical Accuracy: Is the answer technically correct?
2. Communication: Is it well-structured and clear?
3. Problem Solving: Does it show analytical thinking?
4. Clarity: Is it easy to understand?
5. Confidence: Does it convey confidence?
6. Completeness: Does it fully address the question?

Also provide:
- An overall score (0-100)
- Brief feedback (2-3 sentences)
- 2-3 specific improvement suggestions

Return as valid JSON:
{
  "technical_accuracy": <score>,
  "communication": <score>,
  "problem_solving": <score>,
  "clarity": <score>,
  "confidence": <score>,
  "completeness": <score>,
  "overall_score": <score>,
  "feedback": "<feedback>",
  "improvement_suggestions": ["<suggestion1>", "<suggestion2>"]
}`

  const response = await callGemini(prompt)

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    // Fall through to defaults
  }

  // Fallback scoring
  return {
    answer_text: answer,
    time_taken_seconds: timeTaken,
    technical_accuracy: 70,
    communication: 70,
    problem_solving: 70,
    clarity: 70,
    confidence: 70,
    completeness: 70,
    overall_score: 70,
    feedback: 'Answer recorded. Detailed feedback will be available after the interview.',
    improvement_suggestions: ['Review the core concepts', 'Practice explaining your thought process'],
  }
}

export async function generateInterviewReport(
  role: JobRole,
  domain: Domain,
  questions: Question[],
  answers: Answer[]
): Promise<{
  overall_score: number
  technical_score: number
  communication_score: number
  problem_solving_score: number
  strengths: string[]
  weaknesses: string[]
  learning_plan: string[]
  suggested_resources: Array<{ title: string; url: string; type: string }>
}> {
  const qaSummary = questions.map((q, i) => ({
    question: q.question_text,
    answer: answers[i]?.answer_text || 'Not answered',
    score: answers[i]?.overall_score || 0,
    feedback: answers[i]?.feedback || '',
  }))

  const prompt = `You are an expert interview coach. Analyze this completed interview.

Role: ${role.replace(/_/g, ' ')}
Domain: ${domain.replace(/_/g, ' ')}

Q&A Summary:
${qaSummary.map((qa, i) => `
Q${i + 1}: ${qa.question}
Score: ${qa.score}/100
Feedback: ${qa.feedback}
`).join('\n')}

Average Score: ${Math.round(answers.reduce((sum, a) => sum + a.overall_score, 0) / answers.length)}

Provide:
1. Overall technical score average (0-100)
2. Communication score average (0-100)
3. Problem-solving score average (0-100)
4. Top 3 strengths observed
5. Top 3 areas for improvement
6. Personalized 4-week learning plan (4 specific items)
7. 3 recommended learning resources (include actual URLs to free resources)

Return as valid JSON:
{
  "overall_score": <round(avg of all scores)>,
  "technical_score": <average of technical_accuracy scores>,
  "communication_score": <average of communication scores>,
  "problem_solving_score": <average of problem_solving scores>,
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
  "learning_plan": ["<week1>", "<week2>", "<week3>", "<week4>"],
  "suggested_resources": [
    {"title": "<title>", "url": "<url>", "type": "article|video|course"},
    {"title": "<title>", "url": "<url>", "type": "article|video|course"},
    {"title": "<title>", "url": "<url>", "type": "article|video|course"}
  ]
}`

  const response = await callGemini(prompt)

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    // Fall through to defaults
  }

  // Fallback
  const avgAll = Math.round(answers.reduce((sum, a) => sum + a.overall_score, 0) / answers.length)

  return {
    overall_score: avgAll,
    technical_score: avgAll,
    communication_score: avgAll,
    problem_solving_score: avgAll,
    strengths: ['Completed the interview', 'Showed effort in answering questions'],
    weaknesses: ['Areas identified for improvement in detailed feedback'],
    learning_plan: ['Review core concepts', 'Practice regularly', 'Seek feedback', 'Build projects'],
    suggested_resources: [
      { title: 'Documentation', url: 'https://developer.mozilla.org', type: 'article' },
      { title: 'YouTube Tutorials', url: 'https://youtube.com', type: 'video' },
      { title: 'Online Course', url: 'https://coursera.org', type: 'course' },
    ],
  }
}
