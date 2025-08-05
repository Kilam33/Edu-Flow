/*
  # Initial Database Schema

  1. New Tables
    - `profiles` - User profiles linked to Supabase Auth
    - `courses` - Course information
    - `lessons` - Individual lessons within courses
    - `notes` - User notes for specific lessons
    - `enrollments` - User enrollment in courses with roles

  2. Security
    - Enable RLS on all tables
    - Add appropriate security policies for each table
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  bio TEXT
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published courses are viewable by everyone"
  ON courses
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Creators can see their own unpublished courses"
  ON courses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Creators can insert courses"
  ON courses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Creators can update their courses"
  ON courses
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Creators can delete their courses"
  ON courses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  order INT DEFAULT 0,
  video_url TEXT,
  content JSONB
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published course lessons are viewable by everyone"
  ON lessons
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lessons.course_id
      AND courses.is_published = true
    )
  );

CREATE POLICY "Creators can see all their course lessons"
  ON lessons
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lessons.course_id
      AND courses.user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can insert lessons"
  ON lessons
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lessons.course_id
      AND courses.user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can update their lessons"
  ON lessons
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lessons.course_id
      AND courses.user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can delete their lessons"
  ON lessons
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lessons.course_id
      AND courses.user_id = auth.uid()
    )
  );

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  content JSONB NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notes"
  ON notes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
  ON notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create enrollments table for course access
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'student'
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments"
  ON enrollments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Course creators can view all enrollments for their courses"
  ON enrollments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = enrollments.course_id
      AND courses.user_id = auth.uid()
    )
  );

CREATE POLICY "Course creators can manage enrollments"
  ON enrollments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = enrollments.course_id
      AND courses.user_id = auth.uid()
    )
  );

-- Function to create a profile when a user signs up
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, updated_at)
  VALUES (new.id, new.email, '', now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create a profile when a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();