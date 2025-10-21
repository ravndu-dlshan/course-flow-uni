import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { courseService } from '@/services/courseService';
import { studentService } from '@/services/studentService';
import { enrollmentService } from '@/services/enrollmentService';
import { Course } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    utilizationRate: 0,
  });
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load courses
      const { data: coursesData, error: coursesError } = await courseService.getAllCourses();
      if (coursesError) throw coursesError;
      if (coursesData) {
        setCourses(coursesData);
        setStats((prev) => ({ ...prev, totalCourses: coursesData.length }));
      }

      // Load students
      const { data: studentsData, error: studentsError } = await studentService.getAllStudents();
      if (studentsError) throw studentsError;
      if (studentsData) {
        setStats((prev) => ({ ...prev, totalStudents: studentsData.length }));
      }

      // Load enrollment stats
      const { data: enrollmentStats, error: enrollError } = await enrollmentService.getEnrollmentStats();
      if (enrollError) throw enrollError;
      if (enrollmentStats) {
        setStats((prev) => ({
          ...prev,
          totalEnrollments: enrollmentStats.totalEnrollments,
          utilizationRate: enrollmentStats.utilizationRate,
        }));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: string) => {
    toast.success(`${action} feature coming soon!`);
  };

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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar variant="dashboard" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={GraduationCap}
            />
            <StatCard
              title="Total Courses"
              value={stats.totalCourses}
              icon={BookOpen}
            />
            <StatCard
              title="Total Enrollments"
              value={stats.totalEnrollments}
              icon={Users}
            />
            <StatCard
              title="Capacity Utilization"
              value={`${stats.utilizationRate.toFixed(1)}%`}
              icon={TrendingUp}
            />
          </div>

          {/* Courses Overview */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Courses Overview</h2>
            <Card>
              <CardHeader>
                <CardTitle>All Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Enrollment</TableHead>
                      <TableHead className="text-right">Credits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.code}</TableCell>
                          <TableCell>{course.name}</TableCell>
                          <TableCell>{course.instructor}</TableCell>
                          <TableCell>{course.department}</TableCell>
                          <TableCell>
                            <span className={course.enrolledSeats >= course.totalSeats ? 'text-red-600 font-medium' : ''}>
                              {course.enrolledSeats}/{course.totalSeats}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{course.credits}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No courses available. Add courses to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
