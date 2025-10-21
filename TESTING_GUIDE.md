# Testing Guide - UniPortal Supabase Integration

## 🧪 Complete Testing Checklist

This guide will help you verify that everything is working correctly.

## Prerequisites

Before testing, ensure you've completed:

- ✅ Installed dependencies (`npm install`)
- ✅ Created Supabase project
- ✅ Set up `.env` file with credentials
- ✅ Run database setup SQL
- ✅ Added sample courses (optional but recommended)
- ✅ Started the dev server (`npm run dev`)

## Test Scenario 1: Student Registration & Login

### 1. Create Student Account

1. Open http://localhost:5173
2. Click **Login** button
3. Click **Need an account? Sign Up**
4. Select **Student** role
5. Fill in:
   - Full Name: `Test Student`
   - Email: `student@test.com`
   - Password: `test123`
6. Click **Sign Up**

**Expected Result:**

- ✅ Success message appears
- ✅ Form switches to login mode (or you may need to verify email first)

### 2. Sign In as Student

1. Enter email: `student@test.com`
2. Enter password: `test123`
3. Click **Sign In**

**Expected Result:**

- ✅ Success message
- ✅ Redirected to `/student` (Student Dashboard)
- ✅ Navbar shows your name and Sign Out button

### 3. Verify Student Dashboard

Check that you see:

- ✅ Welcome message with your name
- ✅ Three stat cards (Enrolled Courses: 0, Total Credits: 0, GPA: 0.00)
- ✅ "My Courses" section (empty with helpful message)
- ✅ "Available Courses" section with courses from database

### 4. Test Course Enrollment

1. Scroll to "Available Courses"
2. Click **Enroll** on a course
3. Wait for confirmation

**Expected Result:**

- ✅ "Successfully enrolled" toast message
- ✅ Course moves to "My Courses" section
- ✅ Stats update (Enrolled Courses: 1, Credits increase)
- ✅ Course disappears from "Available Courses"
- ✅ Seat count decreases on other course cards

### 5. Test Course Drop

1. In "My Courses", click **Drop Course**
2. Wait for confirmation

**Expected Result:**

- ✅ "Dropped" toast message
- ✅ Course removed from "My Courses"
- ✅ Stats update (back to 0)
- ✅ Course reappears in "Available Courses"

### 6. Test Search Feature

1. In "Available Courses", type in search box
2. Try searching by:
   - Course code (e.g., "CS101")
   - Course name (e.g., "Computer")
   - Instructor (e.g., "Johnson")

**Expected Result:**

- ✅ Results filter in real-time
- ✅ Only matching courses show

### 7. Test Sign Out

1. Click **Sign Out** button in navbar
2. Confirm sign out

**Expected Result:**

- ✅ Redirected to home page
- ✅ Navbar shows "Login" button again
- ✅ Cannot access `/student` directly (redirects to login)

## Test Scenario 2: Admin Account

### 1. Create Admin Account

1. Return to login page
2. Click **Sign Up**
3. Select **Admin** role
4. Use different email: `admin@test.com`
5. Password: `admin123`
6. Sign up and sign in

**Expected Result:**

- ✅ Redirected to `/admin` (Admin Dashboard)

### 2. Verify Admin Dashboard

Check that you see:

- ✅ Welcome message
- ✅ Four stat cards showing system-wide data
- ✅ "Courses Overview" table with all courses
- ✅ Enrollment counts for each course
- ✅ Red highlight for full courses

### 3. Verify Different Data

- ✅ Admin sees ALL students count (not just their own data)
- ✅ Shows total system enrollments
- ✅ Shows capacity utilization percentage

## Test Scenario 3: Course Catalog

### 1. Test Public Access

1. Sign out if logged in
2. Click **Courses** in navbar

**Expected Result:**

- ✅ Can view catalog without being logged in
- ✅ All courses display
- ✅ Search and filters work

### 2. Test Enrollment from Catalog

1. Sign in as student
2. Go to **Courses**
3. Enroll in a course from catalog

**Expected Result:**

- ✅ Can enroll from catalog page
- ✅ Button shows loading state
- ✅ Success message appears

### 3. Test Department Filter

1. Open Department dropdown
2. Select a specific department

**Expected Result:**

- ✅ Only courses from that department show
- ✅ Count updates correctly

### 4. Test Credits Filter

1. Open Credits dropdown
2. Select "3 Credits" or "4 Credits"

**Expected Result:**

- ✅ Only courses with that credit amount show

## Test Scenario 4: Protected Routes

### 1. Test Student Route Protection

1. Sign out
2. Try to navigate to `/student` directly

**Expected Result:**

- ✅ Redirected to `/login` page
- ✅ Cannot access dashboard without login

### 2. Test Admin Route Protection

1. Sign in as student (not admin)
2. Try to navigate to `/admin`

**Expected Result:**

- ✅ Redirected away (to home page)
- ✅ Students cannot access admin dashboard

### 3. Test Role-Based Access

1. Sign in as admin
2. Navigate to `/student`

**Expected Result:**

- ✅ Admin redirected to `/admin` (not allowed in student area)

## Test Scenario 5: Data Persistence

### 1. Test Session Persistence

1. Sign in as student
2. Enroll in 2-3 courses
3. Refresh the page (F5)

**Expected Result:**

- ✅ Still logged in
- ✅ Enrolled courses still show
- ✅ Stats are correct

### 2. Test Multiple Sessions

1. Open a new incognito/private window
2. Sign in as admin
3. Return to first window (still signed in as student)

**Expected Result:**

- ✅ Each session maintains its own user
- ✅ No interference between sessions

### 3. Test Database Consistency

1. As student, enroll in a course
2. Sign out
3. Sign in as admin
4. Check the course in the admin table

**Expected Result:**

- ✅ Enrollment count reflects student's enrollment
- ✅ Data is consistent across user roles

## Test Scenario 6: Error Handling

### 1. Test Invalid Login

1. Try signing in with wrong password

**Expected Result:**

- ✅ Error message shows
- ✅ User stays on login page
- ✅ No console errors

### 2. Test Duplicate Email

1. Try signing up with existing email

**Expected Result:**

- ✅ Error message about duplicate email
- ✅ Helpful error toast

### 3. Test Full Course

1. In Supabase SQL Editor, manually set a course's `enrolled_seats = total_seats`
2. Try to enroll in that course

**Expected Result:**

- ✅ "Course is full" error message
- ✅ Cannot enroll

### 4. Test Network Error

1. Turn off internet or stop Supabase
2. Try to load dashboard

**Expected Result:**

- ✅ Error message shows
- ✅ Graceful degradation

## Test Scenario 7: Real-time Updates

### 1. Test Seat Availability Updates

1. Sign in as student
2. Note current seat count on a course
3. Enroll in the course
4. Check seat count

**Expected Result:**

- ✅ Seat count decreases by 1
- ✅ All instances of the course show updated count

### 2. Test Multi-User Enrollment

1. Student enrolls in course (seats go from 30 to 29)
2. In Supabase dashboard, check `courses` table

**Expected Result:**

- ✅ Database shows `enrolled_seats = 29`
- ✅ Can verify in real-time

## Debugging Checklist

If something doesn't work:

### Check Environment Variables

```bash
# In terminal, check if .env is loaded
cat .env  # Mac/Linux
type .env  # Windows
```

### Check Supabase Connection

1. Open browser console (F12)
2. Go to Network tab
3. Try enrolling in a course
4. Look for requests to `supabase.co`

**What to look for:**

- ✅ Requests should return 200/201 status
- ❌ 401/403 means auth issues
- ❌ 400 means validation errors

### Check Database

In Supabase:

1. Go to Table Editor
2. Check `enrollments` table after enrolling
3. Should see new row with your student_id

### Check Browser Console

Look for errors:

- ❌ "Missing Supabase environment variables" → Check .env
- ❌ "Cannot read property of undefined" → Database schema issue
- ❌ "RLS policy violation" → Check RLS policies

### Check Supabase Logs

In Supabase Dashboard:

1. Go to Logs → PostgreSQL logs
2. Look for recent errors
3. Check for policy violations

## Success Criteria ✅

Your integration is fully working if:

- ✅ Can create accounts for all roles
- ✅ Login works with correct credentials
- ✅ Protected routes redirect properly
- ✅ Student can enroll/drop courses
- ✅ Admin sees system statistics
- ✅ Course catalog loads and filters
- ✅ Seat counts update correctly
- ✅ Data persists across refreshes
- ✅ Search functionality works
- ✅ No console errors
- ✅ Graceful error handling

## Performance Check

### Expected Load Times

- Login: < 1 second
- Dashboard initial load: 1-2 seconds
- Course enrollment: < 1 second
- Search/filter: Instant (< 100ms)

If slower:

- Check internet connection
- Verify Supabase region (closer is faster)
- Check browser network throttling is off

## Next Steps After Testing

Once all tests pass:

1. ✅ Your integration is complete!
2. Consider adding more sample data
3. Customize the UI/branding
4. Add more features (see INTEGRATION_SUMMARY.md)
5. Deploy to production (Vercel, Netlify, etc.)

## Need Help?

1. Check QUICKSTART.md for setup issues
2. Review SUPABASE_SETUP.md for database issues
3. Read INTEGRATION_SUMMARY.md for architecture details
4. Check Supabase documentation
5. Look for errors in browser console and Supabase logs

---

**Happy Testing! 🧪**
