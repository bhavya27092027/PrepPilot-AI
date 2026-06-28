import type { Domain, Difficulty, JobRole, Question, Answer } from '@/types'
import { supabase } from "@/lib/supabase";

async function callGemini(prompt: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke("gemini", {
      body: { prompt },
    });

    if (error) {
      console.error(error);
      throw error;
    }

    return data.text;
  } catch (error) {
    console.error("Edge Function Error:", error);
    throw new Error("Failed to generate Gemini content");
  }
}

export async function generateQuestion(
  company: string,
  domain: Domain,
  difficulty: Difficulty,
  interview_type: "technical" | "behavioral" | "mixed"
): Promise<Omit<Question, "id" | "interview_id" | "created_at">> {

  // Mixed interview → randomly choose a domain
  if (interview_type === "mixed") {

    const technicalDomains: Domain[] = [
      "dsa",
      "system_design",
      "machine_learning",
      "react",
      "nodejs",
    ];

    const random = Math.random();

    if (random < 0.7) {
      domain =
        technicalDomains[
        Math.floor(Math.random() * technicalDomains.length)
        ];
    } else {
      domain = "behavioral";
    }
  }

  // Gemini domains
  if (
    domain === "react" ||
    domain === "nodejs" ||
    domain === "behavioral" ||
    domain === "product_strategy"
  ) {

    const prompt = `
You are an expert interviewer.

Generate ONE ${difficulty} ${domain.replace("_", " ")} interview question.

Company: ${company}

Rules:
- Return ONLY the interview question.
- No numbering.
- No markdown.
- No explanation.
- Make it realistic.
`;

    const question = await callGemini(prompt);

    return {
      question_text: question.trim(),
      question_type:
        domain === "behavioral"
          ? "behavioral"
          : "technical",
      difficulty,
      order_index: 0,
      follow_up_for: null,
    };
  }

  const companyMap: Record<string, string> = {
    google: "Google",
    amazon: "Amazon",
    microsoft: "Microsoft",
    meta: "Meta",
    adobe: "Adobe",
    flipkart: "Flipkart",
    uber: "Uber",
    zomato: "Zomato",
    general: "General",
  };

  const mappedCompany =
    companyMap[company.toLowerCase()] ?? company;

  const domainMap: Record<Domain, string> = {
    react: "React",
    nodejs: "Node.js",
    system_design: "System Design",
    dsa: "Data Structures & Algorithms",
    machine_learning: "Machine Learning",
    product_strategy: "Product Strategy",
    behavioral: "Behavioral",
  };

  const difficultyMap: Record<Difficulty, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  console.log({
    company: mappedCompany,
    domain: domainMap[domain],
    difficulty: difficultyMap[difficulty],
  });

  let { data, error } = await supabase
    .from("question_bank")
    .select("question_text, question_type")
    .eq("company", mappedCompany)
    .eq("domain", domainMap[domain])
    .eq("difficulty", difficultyMap[difficulty]);

  console.log(data?.length);
  console.log(data);

  if (error) throw error;

  // fallback to General company
  if (!data || data.length === 0) {

    const result = await supabase
      .from("question_bank")
      .select("question_text, question_type")
      .eq("company", "General")
      .eq("domain", domainMap[domain])
      .eq("difficulty", difficultyMap[difficulty]);

    if (result.error) throw result.error;

    data = result.data;

    if (!data || data.length === 0) {
      throw new Error("No questions found.");
    }
  }

  const random =
    data[Math.floor(Math.random() * data.length)];

  return {
    question_text: random.question_text,

    question_type:
      interview_type === "behavioral"
        ? "behavioral"
        : "technical",

    difficulty,
    order_index: 0,
    follow_up_for: null,
  };
}

export async function evaluateAnswer(
  question: Question,
  answer: string,
  domain: Domain,
  role: JobRole,
  timeTaken: number
): Promise<Omit<Answer, "id" | "question_id" | "interview_id" | "created_at">> {

  const prompt = `You are an expert interview evaluator for a ${role.replace(/_/g, " ")} position.

Question: ${question.question_text}
Domain: ${domain.replace(/_/g, " ")}
Difficulty: ${question.difficulty}

Candidate's Answer:
"${answer}"

Time taken: ${Math.floor(timeTaken / 60)} minutes ${timeTaken % 60} seconds

Evaluate the answer on these criteria (score 0-100 for each):
1. Technical Accuracy
2. Communication
3. Problem Solving
4. Clarity
5. Confidence
6. Completeness

Return valid JSON:
{
  "technical_accuracy": 0,
  "communication": 0,
  "problem_solving": 0,
  "clarity": 0,
  "confidence": 0,
  "completeness": 0,
  "overall_score": 0,
  "feedback": "",
  "improvement_suggestions": []
}
`;

  let response = "";

  try {
    response = await callGemini(prompt);
  } catch (err) {
    console.log("Gemini unavailable. Using fallback evaluation.");

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
      feedback:
        "Evaluation temporarily unavailable. Using fallback scoring.",
      improvement_suggestions: [
        "Practice more coding questions",
        "Explain your thought process clearly",
      ],
    };
  }

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      return {
        answer_text: answer,
        time_taken_seconds: timeTaken,
        ...parsed,
      };
    }
  } catch (err) {
    console.log("Invalid Gemini JSON. Using fallback.");
  }

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
    feedback:
      "Evaluation temporarily unavailable. Using fallback scoring.",
    improvement_suggestions: [
      "Practice more coding questions",
      "Explain your thought process clearly",
    ],
  };
}


export async function generateInterviewReport(
  role: JobRole,
  domain: Domain,
  questions: Question[],
  answers: Answer[]
): Promise<{
  overall_score: number;
  technical_score: number;
  communication_score: number;
  problem_solving_score: number;
  strengths: string[];
  weaknesses: string[];
  learning_plan: string[];
  suggested_resources: Array<{
    title: string;
    url: string;
    type: string;
  }>;
}> {

  const qaSummary = questions.map((q, i) => ({
    question: q.question_text,
    answer: answers[i]?.answer_text || "Not answered",
    score: answers[i]?.overall_score || 0,
    feedback: answers[i]?.feedback || "",
  }));

  const prompt = `You are an expert interview coach.

Role: ${role.replace(/_/g, " ")}
Domain: ${domain.replace(/_/g, " ")}

Q&A Summary:

${qaSummary
      .map(
        (qa, i) => `
Q${i + 1}: ${qa.question}
Score: ${qa.score}
Feedback: ${qa.feedback}
`
      )
      .join("\n")}

Return valid JSON:
{
  "overall_score":0,
  "technical_score":0,
  "communication_score":0,
  "problem_solving_score":0,
  "strengths":[],
  "weaknesses":[],
  "learning_plan":[],
  "suggested_resources":[]
}
`;

  let response = "";

  try {
    response = await callGemini(prompt);
  } catch (err) {
    console.log("Gemini unavailable. Using fallback report.");

    const avgAll = Math.round(
      answers.reduce((sum, a) => sum + a.overall_score, 0) /
      (answers.length || 1)
    );

    return {
      overall_score: avgAll,
      technical_score: avgAll,
      communication_score: avgAll,
      problem_solving_score: avgAll,
      strengths: [
        "Completed the interview",
        "Attempted all questions",
        "Consistent participation",
      ],
      weaknesses: [
        "Detailed AI report unavailable",
        "Need more practice",
        "Improve communication",
      ],
      learning_plan: [
        "Practice DSA daily",
        "Review core concepts",
        "Solve mock interviews",
        "Build more projects",
      ],
      suggested_resources: [
        {
          title: "LeetCode",
          url: "https://leetcode.com",
          type: "practice",
        },
        {
          title: "NeetCode",
          url: "https://neetcode.io",
          type: "video",
        },
        {
          title: "MDN",
          url: "https://developer.mozilla.org",
          type: "article",
        },
      ],
    };
  }

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.log("Invalid Gemini JSON. Using fallback report.");
  }

  const avgAll = Math.round(
    answers.reduce((sum, a) => sum + a.overall_score, 0) /
    (answers.length || 1)
  );

  return {
    overall_score: avgAll,
    technical_score: avgAll,
    communication_score: avgAll,
    problem_solving_score: avgAll,
    strengths: [
      "Completed the interview",
      "Showed effort in answering questions",
    ],
    weaknesses: [
      "Need more practice",
      "Improve communication",
    ],
    learning_plan: [
      "Review core concepts",
      "Practice daily",
      "Build projects",
      "Take mock interviews",
    ],
    suggested_resources: [
      {
        title: "MDN",
        url: "https://developer.mozilla.org",
        type: "article",
      },
      {
        title: "LeetCode",
        url: "https://leetcode.com",
        type: "practice",
      },
      {
        title: "NeetCode",
        url: "https://neetcode.io",
        type: "video",
      },
    ],
  };
}
