# UniPortal - University Course Registration System

A modern, full-featured university course registration and management system built with React, TypeScript, and Supabase.

## 🎓 Features

- **Authentication System**: Secure login and registration with role-based access (Student, Faculty, Admin)
- **Student Dashboard**: View enrolled courses, GPA, credits, and browse available courses
- **Admin Dashboard**: Manage courses, view enrollment statistics, and monitor system usage
- **Course Catalog**: Browse and search courses with advanced filtering
- **Real-time Enrollment**: Students can enroll in and drop courses with seat availability tracking
- **Protected Routes**: Role-based access control for different user types
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great!)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
cd course-flow-uni
npm install
```

### 2. Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized
3. Go to **Settings → API** in your Supabase dashboard
4. Copy your **Project URL** and **anon/public key**

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase credentials.

### 4. Set Up the Database

Open the SQL Editor in your Supabase dashboard and run the complete SQL script from `SUPABASE_SETUP.md`. This will:

- Create all necessary tables (profiles, courses, enrollments, student_profiles)
- Set up Row Level Security (RLS) policies
- Create automatic triggers for user signup
- Add indexes for performance

See the detailed `SUPABASE_SETUP.md` file for the complete SQL script.

### 5. (Optional) Seed Sample Data

You can add sample courses by running this SQL in your Supabase SQL Editor:

```sql
INSERT INTO courses (code, name, instructor_name, credits, total_seats, enrolled_seats, schedule, department, description)
VALUES
  ('CS101', 'Introduction to Computer Science', 'Dr. Sarah Johnson', 3, 30, 0, 'MWF 9:00-10:00 AM', 'Computer Science', 'Fundamental concepts of programming and problem-solving using computers.'),
  ('CS201', 'Data Structures and Algorithms', 'Dr. Michael Chen', 4, 25, 0, 'TTh 11:00-12:30 PM', 'Computer Science', 'Advanced data structures, algorithm design and analysis.'),
  ('MATH150', 'Calculus I', 'Prof. Emily Rodriguez', 4, 35, 0, 'MWF 10:00-11:00 AM', 'Mathematics', 'Limits, derivatives, and applications of differential calculus.'),
  ('PHYS120', 'General Physics I', 'Dr. James Wilson', 4, 30, 0, 'TTh 2:00-3:30 PM', 'Physics', 'Mechanics, thermodynamics, and wave motion.'),
  ('ENG200', 'Technical Writing', 'Dr. Amanda White', 3, 20, 0, 'MW 1:00-2:30 PM', 'English', 'Professional and technical communication skills.');
```

### 6. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 👥 User Roles

### Student

- View enrolled courses and academic stats
- Browse course catalog
- Enroll in and drop courses
- View course details and availability

### Faculty/Admin

- View system-wide statistics
- Monitor all courses and enrollments
- Access comprehensive dashboard

## 🔐 Authentication Flow

1. **Sign Up**: New users can register with email, password, name, and role
2. **Email Verification**: Supabase sends verification email (check Supabase Auth settings)
3. **Sign In**: Users sign in with email and password
4. **Protected Routes**: Users are redirected based on their role
5. **Session Management**: Persistent sessions with automatic refresh

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── CourseCard.tsx
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── pages/              # Page components
│   ├── Login.tsx
│   ├── StudentDashboard.tsx
│   ├── AdminDashboard.tsx
│   └── CourseCatalog.tsx
├── services/           # API service layer
│   ├── courseService.ts
│   ├── enrollmentService.ts
│   └── studentService.ts
├── types/              # TypeScript types
│   ├── index.ts
│   └── database.ts
└── lib/                # Utilities
    ├── supabase.ts
    └── utils.ts
```

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Students can only access their own data
- Admins and faculty have elevated permissions
- Secure password hashing via Supabase Auth
- Protected API routes with authentication

## 🎨 Customization

### Theme

The application uses CSS variables for theming. Modify `src/index.css` to customize colors.

### Components

All UI components are from shadcn/ui and can be customized in `src/components/ui/`

## 📚 Key Features Explained

### Course Enrollment

- Real-time seat availability tracking
- Automatic enrollment count updates
- Prevent over-enrollment with seat limits

### Dashboard Analytics

- Student: Personal GPA, credits, enrolled courses
- Admin: System-wide statistics, course utilization

### Search & Filter

- Search courses by name, code, or instructor
- Filter by department and credit hours
- Real-time results

## 🐛 Troubleshooting

### "Missing Supabase environment variables" error

- Make sure your `.env` file exists and has the correct variables
- Restart the development server after creating/modifying `.env`

### Authentication not working

- Check that you've run the database setup SQL
- Verify your Supabase URL and anon key are correct
- Check Supabase Auth settings (Email provider should be enabled)

### RLS Policies errors

- Ensure you've run all the SQL from `SUPABASE_SETUP.md`
- Check Supabase logs for specific policy errors

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, please open an issue in the repository.
