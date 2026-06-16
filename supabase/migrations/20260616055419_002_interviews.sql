-- Create interviews table
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_role TEXT NOT NULL,
  domain TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  interview_type TEXT NOT NULL,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  current_question_index INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 5,
  overall_score NUMERIC(5,2),
  technical_score NUMERIC(5,2),
  communication_score NUMERIC(5,2),
  problem_solving_score NUMERIC(5,2),
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  learning_plan TEXT[] DEFAULT '{}',
  suggested_resources JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "select_own_interviews" ON interviews FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_interviews" ON interviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_interviews" ON interviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_interviews" ON interviews FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Create index
CREATE INDEX idx_interviews_user_id ON interviews(user_id);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_interviews_created_at ON interviews(created_at DESC);