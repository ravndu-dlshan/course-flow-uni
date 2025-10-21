# QuickStart Guide - UniPortal

## Get Started in 5 Minutes! ⚡

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Supabase

1. **Create Account**: Go to https://supabase.com and create a free account
2. **Create Project**: Click "New Project" and fill in the details
3. **Wait**: Let Supabase initialize your database (~2 minutes)

### Step 3: Get Your Credentials

In your Supabase dashboard:

1. Go to **Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string under "Project API keys")

### Step 4: Create `.env` File

Create a file named `.env` in your project root:

```env
VITE_SUPABASE_URL=paste_your_project_url_here
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

### Step 5: Set Up Database

1. In Supabase, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the `SUPABASE_SETUP.md` file in this project
4. Copy the entire SQL script (from `-- Enable UUID extension` to the end)
5. Paste it into the SQL Editor
6. Click **Run** or press `Ctrl+Enter`
7. Wait for "Success. No rows returned" message

### Step 6: (Optional) Add Sample Courses

In the same SQL Editor, run this:

```sql
INSERT INTO courses (code, name, instructor_name, credits, total_seats, schedule, department, description)
VALUES
  ('CS101', 'Introduction to Computer Science', 'Dr. Sarah Johnson', 3, 30, 'MWF 9:00-10:00 AM', 'Computer Science', 'Fundamental concepts of programming.'),
  ('MATH150', 'Calculus I', 'Prof. Emily Rodriguez', 4, 35, 'MWF 10:00-11:00 AM', 'Mathematics', 'Limits and derivatives.'),
  ('PHYS120', 'General Physics I', 'Dr. James Wilson', 4, 30, 'TTh 2:00-3:30 PM', 'Physics', 'Mechanics and thermodynamics.');
```

### Step 7: Start the App

```bash
npm run dev
```

Open http://localhost:5173 in your browser! 🎉

## Your First Login

### Create an Account

1. Click **Login** button
2. Click **Need an account? Sign Up**
3. Choose your role (Student, Faculty, or Admin)
4. Fill in your details:
   - Full Name: Your name
   - Email: Any email (doesn't need to be real for testing)
   - Password: At least 6 characters
5. Click **Sign Up**

### Sign In

After creating an account, you can sign in:

1. Enter your email and password
2. Click **Sign In**
3. You'll be redirected to your dashboard!

## What You Can Do

### As a Student 👨‍🎓

- View your enrolled courses
- See your GPA and total credits
- Browse and enroll in available courses
- Drop courses you don't want

### As Admin/Faculty 👨‍💼

- View all system statistics
- See all courses and enrollment data
- Monitor capacity utilization
- Access comprehensive reports

## Tips

- **Email Verification**: By default, Supabase requires email verification. To disable this for testing:

  1. Go to **Authentication** → **Settings** in Supabase
  2. Turn off "Enable email confirmations"

- **Reset Database**: If you want to start fresh, just re-run the SQL script from Step 5

- **Multiple Users**: You can create multiple accounts with different roles to test all features

## Need Help?

Check `README.md` for detailed documentation or `SUPABASE_SETUP.md` for database schema details.

## Common Issues

**"Missing Supabase environment variables"**
→ Make sure your `.env` file exists and has both variables

**Can't sign up**
→ Check that you ran the database setup SQL completely

**Courses not showing**
→ Run the sample data SQL from Step 6

---

**Happy coding! 🚀**
