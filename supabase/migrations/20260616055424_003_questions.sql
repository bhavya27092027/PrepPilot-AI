-- Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('technical', 'behavioral')),
  difficulty TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  follow_up_for UUID REFERENCES questions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "select_own_questions" ON questions FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM interviews WHERE interviews.id = questions.interview_id AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "insert_own_questions" ON questions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM interviews WHERE interviews.id = questions.interview_id AND interviews.user_id = auth.uid()
    )
  );

-- Create index
CREATE INDEX idx_questions_interview_id ON questions(interview_id);
CREATE INDEX idx_questions_order ON questions(interview_id, order_index);