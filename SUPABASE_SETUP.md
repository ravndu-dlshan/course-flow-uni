# Supabase Setup Guide

This guide will help you set up Supabase for the UniPortal application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Create a new project
4. Note down your project URL and anon key

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory with the following:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings:

- Go to Settings → API
- Copy the Project URL
- Copy the anon/public key

## Step 3: Set Up Database Schema

Run the following SQL in your Supabase SQL Editor (Settings → SQL Editor):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  instructor_id UUID REFERENCES profiles(id),
  instructor_name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  total_seats INTEGER NOT NULL,
  enrolled_seats INTEGER DEFAULT 0,
  schedule TEXT NOT NULL,
  department TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create student_profiles table
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) UNIQUE NOT NULL,
  gpa DECIMAL(3, 2),
  total_credits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) NOT NULL,
  course_id UUID REFERENCES courses(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'dropped', 'completed')),
  grade TEXT,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_courses_department ON courses(department);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_student_profiles_user ON student_profiles(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Only faculty and admin can create courses"
  ON courses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('faculty', 'admin')
    )
  );

CREATE POLICY "Instructors and admins can update their courses"
  ON courses FOR UPDATE
  USING (
    instructor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Student profiles policies
CREATE POLICY "Student profiles are viewable by owner and admin"
  ON student_profiles FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Students can update own profile"
  ON student_profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Enrollments policies
CREATE POLICY "Students can view their own enrollments"
  ON enrollments FOR SELECT
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('faculty', 'admin')
    )
  );

CREATE POLICY "Students can enroll in courses"
  ON enrollments FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can drop their courses"
  ON enrollments FOR UPDATE
  USING (student_id = auth.uid());

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );

  -- If student role, create student profile
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
    INSERT INTO public.student_profiles (user_id)
    VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Seed Sample Data (Optional)

```sql
-- Insert sample courses
INSERT INTO courses (code, name, instructor_name, credits, total_seats, enrolled_seats, schedule, department, description)
VALUES
  ('CS101', 'Introduction to Computer Science', 'Dr. Sarah Johnson', 3, 30, 0, 'MWF 9:00-10:00 AM', 'Computer Science', 'Fundamental concepts of programming and problem-solving using computers.'),
  ('CS201', 'Data Structures and Algorithms', 'Dr. Michael Chen', 4, 25, 0, 'TTh 11:00-12:30 PM', 'Computer Science', 'Advanced data structures, algorithm design and analysis.'),
  ('MATH150', 'Calculus I', 'Prof. Emily Rodriguez', 4, 35, 0, 'MWF 10:00-11:00 AM', 'Mathematics', 'Limits, derivatives, and applications of differential calculus.'),
  ('PHYS120', 'General Physics I', 'Dr. James Wilson', 4, 30, 0, 'TTh 2:00-3:30 PM', 'Physics', 'Mechanics, thermodynamics, and wave motion.'),
  ('ENG200', 'Technical Writing', 'Dr. Amanda White', 3, 20, 0, 'MW 1:00-2:30 PM', 'English', 'Professional and technical communication skills.');
```

## Step 5: Configure Authentication

1. Go to Authentication → Providers in your Supabase dashboard
2. Enable Email authentication
3. Configure email templates if needed
4. (Optional) Enable additional providers like Google, GitHub, etc.

## Step 6: Update Your Application

The application is already configured to use Supabase. Just make sure your `.env` file has the correct credentials.

## Testing

You can now:

1. Sign up new users through the application
2. Users will automatically get a profile created
3. Students can enroll in courses
4. Admins and faculty can manage courses

## Security Notes

- Row Level Security (RLS) is enabled to ensure users can only access their own data
- Students can only view and update their own enrollments
- Faculty and admins have additional permissions for course management
- All passwords are securely hashed by Supabase Auth
