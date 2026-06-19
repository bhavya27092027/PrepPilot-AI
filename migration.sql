-- InterviewPro AI - Complete Database Schema
-- Generated: 2026-06-16
--
-- This migration contains all tables, constraints, indexes, and RLS policies
-- for the AI-powered Career Coach Platform.

-- ============================================================================
-- USER PROFILES
-- Extends Supabase auth.users with additional profile information
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    total_interviews INTEGER DEFAULT 0,
    average_score NUMERIC DEFAULT 0,
    best_score NUMERIC DEFAULT 0,
    practice_streak INTEGER DEFAULT 0,
    last_practice_date DATE,
    strong_areas TEXT[] DEFAULT '{}',
    weak_areas TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- RLS Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_profile" ON public.user_profiles
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_profile" ON public.user_profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_profile" ON public.user_profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- INTERVIEWS
-- Stores interview session data
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_role TEXT NOT NULL,
    domain TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    interview_type TEXT NOT NULL,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    current_question_index INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 5,
    overall_score NUMERIC,
    technical_score NUMERIC,
    communication_score NUMERIC,
    problem_solving_score NUMERIC,
    strengths TEXT[] DEFAULT '{}',
    weaknesses TEXT[] DEFAULT '{}',
    learning_plan TEXT[] DEFAULT '{}',
    suggested_resources JSONB DEFAULT '[]',
    started_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON public.interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON public.interviews(status);
CREATE INDEX IF NOT EXISTS idx_interviews_created_at ON public.interviews(created_at DESC);

-- RLS Policies
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_interviews" ON public.interviews
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_interviews" ON public.interviews
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_interviews" ON public.interviews
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_interviews" ON public.interviews
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- QUESTIONS
-- Stores interview questions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('technical', 'behavioral')),
    difficulty TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    follow_up_for UUID REFERENCES public.questions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_questions_interview_id ON public.questions(interview_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON public.questions(interview_id, order_index);

-- RLS Policies
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_questions" ON public.questions
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.interviews
            WHERE interviews.id = questions.interview_id
            AND interviews.user_id = auth.uid()
        )
    );

CREATE POLICY "insert_own_questions" ON public.questions
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.interviews
            WHERE interviews.id = questions.interview_id
            AND interviews.user_id = auth.uid()
        )
    );

-- ============================================================================
-- ANSWERS
-- Stores user answers with AI-evaluated scores
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    time_taken_seconds INTEGER DEFAULT 0,
    technical_accuracy NUMERIC DEFAULT 0,
    communication NUMERIC DEFAULT 0,
    problem_solving NUMERIC DEFAULT 0,
    clarity NUMERIC DEFAULT 0,
    confidence NUMERIC DEFAULT 0,
    completeness NUMERIC DEFAULT 0,
    overall_score NUMERIC DEFAULT 0,
    feedback TEXT DEFAULT '',
    improvement_suggestions TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_interview_id ON public.answers(interview_id);

-- RLS Policies
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_answers" ON public.answers
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.interviews
            WHERE interviews.id = answers.interview_id
            AND interviews.user_id = auth.uid()
        )
    );

CREATE POLICY "insert_own_answers" ON public.answers
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.interviews
            WHERE interviews.id = answers.interview_id
            AND interviews.user_id = auth.uid()
        )
    );

CREATE POLICY "update_own_answers" ON public.answers
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.interviews
            WHERE interviews.id = answers.interview_id
            AND interviews.user_id = auth.uid()
        )
    );

-- ============================================================================
-- USER STATS (Gamification)
-- Stores XP, levels, and streak data
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    interviews_completed INTEGER DEFAULT 0,
    resumes_analyzed INTEGER DEFAULT 0,
    voice_interviews_completed INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_stats" ON public.user_stats
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_stats" ON public.user_stats
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_stats" ON public.user_stats
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- ACHIEVEMENTS (Reference Table - No RLS)
-- Defines all possible achievements
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 0,
    requirement_type TEXT NOT NULL,
    requirement_value INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- USER ACHIEVEMENTS
-- Junction table tracking earned achievements
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, achievement_id)
);

-- RLS Policies
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_achievements" ON public.user_achievements
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_achievements" ON public.user_achievements
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RESUMES
-- Stores uploaded resumes and analysis results
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT,
    raw_text TEXT,
    parsed_data JSONB DEFAULT '{}',
    ats_score INTEGER DEFAULT 0,
    keywords_found TEXT[] DEFAULT '{}',
    keywords_missing TEXT[] DEFAULT '{}',
    weak_bullet_points TEXT[] DEFAULT '{}',
    improvement_suggestions TEXT[] DEFAULT '{}',
    analysis_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);

-- RLS Policies
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_resumes" ON public.resumes
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_resumes" ON public.resumes
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_resumes" ON public.resumes
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_resumes" ON public.resumes
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- JOB DESCRIPTIONS
-- Stores job descriptions for matching
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.job_descriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT,
    description TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    required_keywords TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_id ON public.job_descriptions(user_id);

-- RLS Policies
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_job_descriptions" ON public.job_descriptions
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_job_descriptions" ON public.job_descriptions
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_job_descriptions" ON public.job_descriptions
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- RESUME MATCHES
-- Stores resume-to-job matching results
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.resume_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    job_description_id UUID NOT NULL REFERENCES public.job_descriptions(id) ON DELETE CASCADE,
    match_score INTEGER DEFAULT 0,
    matching_skills TEXT[] DEFAULT '{}',
    missing_skills TEXT[] DEFAULT '{}',
    matching_keywords TEXT[] DEFAULT '{}',
    missing_keywords TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_resume_matches_user_id ON public.resume_matches(user_id);

-- RLS Policies
ALTER TABLE public.resume_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_matches" ON public.resume_matches
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_matches" ON public.resume_matches
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- COMPANY INTERVIEW TEMPLATES (Reference Table - No RLS)
-- Pre-defined interview templates for companies
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.company_interview_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL UNIQUE,
    company_slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    description TEXT,
    focus_areas TEXT[] NOT NULL,
    question_patterns JSONB NOT NULL,
    difficulty_weight JSONB DEFAULT '{"easy": 0.3, "medium": 0.5, "hard": 0.2}',
    tips TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- COACHING PLANS
-- Personalized 30-day improvement roadmaps
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.coaching_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    goals TEXT[] DEFAULT '{}',
    daily_tasks JSONB DEFAULT '[]',
    focus_areas TEXT[] DEFAULT '{}',
    duration_days INTEGER DEFAULT 30,
    current_day INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    progress_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.coaching_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_plans" ON public.coaching_plans
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_plans" ON public.coaching_plans
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_plans" ON public.coaching_plans
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- LEARNING RESOURCES (Reference Table - No RLS)
-- Curated learning materials
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('article', 'video', 'course', 'book', 'practice')),
    topic TEXT NOT NULL,
    difficulty TEXT DEFAULT 'intermediate',
    duration_minutes INTEGER,
    rating NUMERIC DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- INTERVIEW TRANSCRIPTS
-- Stores voice interview transcripts for replay
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.interview_transcripts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
    messages JSONB DEFAULT '[]',
    question_feedback JSONB DEFAULT '[]',
    voice_recording_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.interview_transcripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_transcripts" ON public.interview_transcripts
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.interviews
            WHERE interviews.id = interview_transcripts.interview_id
            AND interviews.user_id = auth.uid()
        )
    );

CREATE POLICY "insert_own_transcripts" ON public.interview_transcripts
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.interviews
            WHERE interviews.id = interview_transcripts.interview_id
            AND interviews.user_id = auth.uid()
        )
    );

CREATE POLICY "update_own_transcripts" ON public.interview_transcripts
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.interviews
            WHERE interviews.id = interview_transcripts.interview_id
            AND interviews.user_id = auth.uid()
        )
    );

-- ============================================================================
-- SEED DATA: Achievements
-- ============================================================================
INSERT INTO public.achievements (key, name, description, icon, category, xp_reward, requirement_type, requirement_value)
VALUES
    -- Bronze tier
    ('first_interview', 'First Steps', 'Complete your first interview', 'Rocket', 'beginner', 50, 'interviews', 1),
    ('streak_3', 'On Fire', 'Maintain a 3-day practice streak', 'Flame', 'streak', 75, 'streak', 3),
    ('complete_5', 'Getting Started', 'Complete 5 interviews', 'Target', 'interviews', 100, 'interviews', 5),
    ('score_70', 'Above Average', 'Score 70% or higher in an interview', 'Medal', 'score', 75, 'score', 70),
    -- Silver tier
    ('streak_7', 'Week Warrior', 'Maintain a 7-day practice streak', 'Flame', 'streak', 150, 'streak', 7),
    ('complete_20', 'Dedicated Learner', 'Complete 20 interviews', 'Star', 'interviews', 200, 'interviews', 20),
    ('score_85', 'Excellence Seeker', 'Score 85% or higher in 3 interviews', 'Trophy', 'score', 175, 'score_count', 3),
    ('all_roles', 'Versatile', 'Practice interviews for 3 different roles', 'Zap', 'diversity', 150, 'roles', 3),
    -- Gold tier
    ('streak_30', 'Monthly Master', 'Maintain a 30-day practice streak', 'Crown', 'streak', 500, 'streak', 30),
    ('complete_50', 'Interview Expert', 'Complete 50 interviews', 'Trophy', 'interviews', 400, 'interviews', 50),
    ('score_95', 'Perfectionist', 'Score 95% or higher in an interview', 'Star', 'score', 350, 'score', 95),
    ('all_domains', 'Knowledge Seeker', 'Master all interview domains', 'Target', 'domains', 450, 'domains', 4),
    -- Platinum tier
    ('streak_100', 'Legendary Dedication', 'Maintain a 100-day practice streak', 'Crown', 'streak', 1000, 'streak', 100),
    ('complete_200', 'Interview Legend', 'Complete 200 interviews', 'Trophy', 'interviews', 1500, 'interviews', 200),
    ('top_10', 'Elite Performer', 'Reach top 10 on the leaderboard', 'Medal', 'leaderboard', 2000, 'leaderboard', 10)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- SEED DATA: Company Interview Templates
-- ============================================================================
INSERT INTO public.company_interview_templates (company_name, company_slug, description, focus_areas, question_patterns, tips)
VALUES
    ('Google', 'google', 'Rigorous technical interviews with coding challenges',
     ARRAY['DSA', 'System Design', 'Behavioral'],
     '{"behavioral_weight": 0.2, "technical_weight": 0.8, "focus_behavioral": true}'::jsonb,
     ARRAY['Think out loud during coding', 'Focus on edge cases', 'Discuss trade-offs']),
    ('Amazon', 'amazon', 'Behavioral-focused interviews with Leadership Principles',
     ARRAY['Leadership Principles', 'System Design', 'Coding'],
     '{"behavioral_weight": 0.4, "technical_weight": 0.6, "star_method": true}'::jsonb,
     ARRAY['Use STAR method for behavioral', 'Know all 16 Leadership Principles', 'Quantify your impact']),
    ('Microsoft', 'microsoft', 'Balanced technical and behavioral interviews',
     ARRAY['Algorithms', 'System Design', 'Growth Mindset'],
     '{"behavioral_weight": 0.3, "technical_weight": 0.7, "growth_mindset": true}'::jsonb,
     ARRAY['Demonstrate growth mindset', 'Show collaboration skills', 'Be prepared for design questions']),
    ('Meta', 'meta', 'Fast-paced technical interviews',
     ARRAY['DSA', 'System Design', 'Behavioral'],
     '{"behavioral_weight": 0.2, "technical_weight": 0.8, "speed_focus": true}'::jsonb,
     ARRAY['Practice speed coding', 'Focus on optimization', 'Know your data structures cold']),
    ('Adobe', 'adobe', 'Creative technical interviews with design focus',
     ARRAY['Algorithms', 'UI Engineering', 'Design'],
     '{"behavioral_weight": 0.25, "technical_weight": 0.75, "design_focus": true}'::jsonb,
     ARRAY['Brush up on UI concepts', 'Be ready for design discussions', 'Know creative problem solving']),
    ('Flipkart', 'flipkart', 'Indian e-commerce giant with focus on scalable systems',
     ARRAY['DSA', 'System Design', 'Problem Solving'],
     '{"behavioral_weight": 0.2, "technical_weight": 0.8, "scalability": true}'::jsonb,
     ARRAY['Focus on scalability', 'Know distributed systems basics', 'Practice coding on whiteboard']),
    ('Zomato', 'zomato', 'Food-tech company with product mindset',
     ARRAY['Backend', 'System Design', 'Product'],
     '{"behavioral_weight": 0.35, "technical_weight": 0.65, "product_sense": true}'::jsonb,
     ARRAY['Think about user experience', 'Know product metrics', 'Understand food-tech challenges']),
    ('Uber', 'uber', 'Real-time systems and distributed architecture',
     ARRAY['Distributed Systems', 'Mobile', 'Real-time'],
     '{"behavioral_weight": 0.2, "technical_weight": 0.8, "distributed_focus": true}'::jsonb,
     ARRAY['Master distributed systems', 'Know real-time architecture patterns', 'Understand geo spatial data'])
ON CONFLICT (company_name) DO NOTHING;

-- ============================================================================
-- SEED DATA: Learning Resources
-- ============================================================================
INSERT INTO public.learning_resources (title, description, url, type, topic, difficulty, duration_minutes, rating, tags)
VALUES
    ('System Design Primer', 'Comprehensive guide to system design interviews', 'https://github.com/donnemartin/system-design-primer', 'article', 'System Design', 'intermediate', 120, 4.9, ARRAY['system-design', 'architecture', 'scalability']),
    ('LeetCode Patterns', 'Common patterns for coding interviews', 'https://leetcode.com/explore/learn/', 'practice', 'DSA', 'intermediate', 60, 4.7, ARRAY['algorithms', 'patterns', 'coding']),
    ('Grokking System Design', 'Learn system design fundamentals', 'https://www.designgurus.io/course/grokking-the-system-design-interview', 'course', 'System Design', 'advanced', 480, 4.8, ARRAY['system-design', 'distributed-systems']),
    ('Amazon Leadership Principles', 'Deep dive into Amazon 16 LPs', 'https://www.aboutamazon.com/about-us/leadership-principles', 'article', 'Behavioral', 'beginner', 30, 4.5, ARRAY['amazon', 'behavioral', 'leadership']),
    ('React Interview Questions', 'Common React interview questions and answers', 'https://github.com/sudheerj/reactjs-interview-questions', 'article', 'Frontend', 'intermediate', 90, 4.6, ARRAY['react', 'frontend', 'javascript']),
    ('Big O Notation Guide', 'Understanding time and space complexity', 'https://www.bigocheatsheet.com/', 'article', 'DSA', 'beginner', 45, 4.8, ARRAY['algorithms', 'complexity', 'optimization']),
    ('SQL Interview Prep', 'SQL questions for data roles', 'https://www.sqlshack.com/sql-interview-questions-and-answers/', 'article', 'Backend', 'intermediate', 60, 4.4, ARRAY['sql', 'database', 'backend']),
    ('Behavioral Interview Guide', 'STAR method and behavioral questions', 'https://www.themuse.com/advice/star-method-interview', 'video', 'Behavioral', 'beginner', 25, 4.5, ARRAY['behavioral', 'star', 'soft-skills'])
ON CONFLICT DO NOTHING;

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE OR REPLACE TRIGGER handle_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER handle_user_stats_updated_at
    BEFORE UPDATE ON public.user_stats
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER handle_resumes_updated_at
    BEFORE UPDATE ON public.resumes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER handle_coaching_plans_updated_at
    BEFORE UPDATE ON public.coaching_plans
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- MATERIALIZED VIEW FOR LEADERBOARD (Optional - for performance)
-- ============================================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS public.leaderboard AS
SELECT
    us.user_id,
    up.full_name,
    up.avatar_url,
    us.level,
    us.total_xp,
    us.current_streak,
    RANK() OVER (ORDER BY us.total_xp DESC) as rank
FROM public.user_stats us
JOIN public.user_profiles up ON us.user_id = up.user_id
ORDER BY us.total_xp DESC
LIMIT 100;

-- Refresh leaderboard every hour (requires pg_cron extension)
-- SELECT cron.schedule('refresh_leaderboard', '0 * * * *', 'REFRESH MATERIALIZED VIEW public.leaderboard');
