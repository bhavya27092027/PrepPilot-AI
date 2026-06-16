-- Create answers table
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  answer_text TEXT NOT NULL,
  time_taken_seconds INTEGER DEFAULT 0,
  technical_accuracy NUMERIC(5,2) DEFAULT 0,
  communication NUMERIC(5,2) DEFAULT 0,
  problem_solving NUMERIC(5,2) DEFAULT 0,
  clarity NUMERIC(5,2) DEFAULT 0,
  confidence NUMERIC(5,2) DEFAULT 0,
  completeness NUMERIC(5,2) DEFAULT 0,
  overall_score NUMERIC(5,2) DEFAULT 0,
  feedback TEXT DEFAULT '',
  improvement_suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "select_own_answers" ON answers FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM interviews WHERE interviews.id = answers.interview_id AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "insert_own_answers" ON answers FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM interviews WHERE interviews.id = answers.interview_id AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "update_own_answers" ON answers FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM interviews WHERE interviews.id = answers.interview_id AND interviews.user_id = auth.uid()
    )
  );

-- Create index
CREATE INDEX idx_answers_interview_id ON answers(interview_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);