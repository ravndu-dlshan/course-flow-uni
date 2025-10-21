import { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Navbar } from '@/components/Navbar';
import { StatCard } from '@/components/StatCard';
import { CourseCard } from '@/components/CourseCard';
import { BookOpen, Award, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { studentService } from '@/services/studentService';
import { courseService } from '@/services/courseService';
import { enrollmentService } from '@/services/enrollmentService';
import { Course } from '@/types';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ enrolledCourses: 0, totalCredits: 0, gpa: 0 });
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load stats
      const { data: statsData, error: statsError } = await studentService.getStudentDashboardStats();
      if (statsError) throw statsError;
      if (statsData) setStats(statsData);

      // Load enrolled courses
      const { data: enrollmentsData, error: enrollError } = await enrollmentService.getStudentEnrollments();
      if (enrollError) throw enrollError;
      if (enrollmentsData) {
        const courses = enrollmentsData.map((e: any) => ({
          id: e.courses.id,
          code: e.courses.code,
          name: e.courses.name,
          instructor: e.courses.instructor_name,
          credits: e.courses.credits,
          schedule: e.courses.schedule,
          department: e.courses.department,
          description: e.courses.description,
          totalSeats: 0,
          enrolledSeats: 0,
        }));
        setEnrolledCourses(courses);
      }

      // Load all courses
      const { data: allCoursesData, error: coursesError } = await courseService.getAllCourses();
      if (coursesError) throw coursesError;
      if (allCoursesData) {
        // Filter out already enrolled courses
        const enrolledIds = enrollmentsData?.map((e: any) => e.courses.id) || [];
        const available = allCoursesData.filter((c) => !enrolledIds.includes(c.id));
        setAvailableCourses(available);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const filteredAvailableCourses = availableCourses.filter(course => 
    searchQuery === '' || 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar variant="dashboard" />
      
      <div className="flex flex-1">
        <DashboardSidebar />

        <main className="flex-1 p-8 bg-background">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name || 'Student'}!</h1>
              <p className="text-muted-foreground">Here's your academic overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Enrolled Courses"
                value={stats.enrolledCourses}
                icon={BookOpen}
              />
              <StatCard
                title="Total Credits"
                value={stats.totalCredits}
                icon={Award}
              />
              <StatCard
                title="Current GPA"
                value={stats.gpa.toFixed(2)}
                icon={TrendingUp}
              />
            </div>

            {/* My Courses Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">My Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.length > 0 ? (
                  enrolledCourses.map((course) => (
                    <CourseCard key={course.id} course={course} enrolled={true} onEnrollmentChange={loadDashboardData} />
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full">No enrolled courses yet. Browse available courses below to get started!</p>
                )}
              </div>
            </section>

            {/* Available Courses Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Available Courses</h2>
                <Input
                  placeholder="Search courses..."
                  className="max-w-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAvailableCourses.length > 0 ? (
                  filteredAvailableCourses.map((course) => (
                    <CourseCard key={course.id} course={course} onEnrollmentChange={loadDashboardData} />
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full">No courses found matching your search.</p>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
