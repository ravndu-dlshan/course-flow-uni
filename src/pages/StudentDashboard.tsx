import { useState } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Navbar } from '@/components/Navbar';
import { StatCard } from '@/components/StatCard';
import { CourseCard } from '@/components/CourseCard';
import { BookOpen, Award, TrendingUp } from 'lucide-react';
import { mockCourses, mockStudents } from '@/data/mockData';
import { Input } from '@/components/ui/input';

const StudentDashboard = () => {
  const student = mockStudents[0];
  const [searchQuery, setSearchQuery] = useState('');

  const enrolledCourses = mockCourses.filter(course => 
    student.enrolledCourses.includes(course.id)
  );

  const availableCourses = mockCourses.filter(course => 
    !student.enrolledCourses.includes(course.id) &&
    (searchQuery === '' || 
     course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     course.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar variant="dashboard" />
      
      <div className="flex flex-1">
        <DashboardSidebar />

        <main className="flex-1 p-8 bg-background">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {student.name}!</h1>
              <p className="text-muted-foreground">Here's your academic overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Enrolled Courses"
                value={student.enrolledCourses.length}
                icon={BookOpen}
              />
              <StatCard
                title="Total Credits"
                value={student.credits}
                icon={Award}
              />
              <StatCard
                title="Current GPA"
                value={student.gpa.toFixed(2)}
                icon={TrendingUp}
              />
            </div>

            {/* My Courses Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">My Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseCard key={course.id} course={course} enrolled={true} />
                ))}
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
                {availableCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
