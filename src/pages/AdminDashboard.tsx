import { Navbar } from '@/components/Navbar';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Plus, UserPlus, Settings } from 'lucide-react';
import { mockCourses, mockStudents, mockFaculty } from '@/data/mockData';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const recentActivities = [
    { id: 1, action: 'New student registration', user: 'John Doe', time: '5 minutes ago' },
    { id: 2, action: 'Course enrollment', user: 'Jane Smith', course: 'CS101', time: '15 minutes ago' },
    { id: 3, action: 'Course added', course: 'MATH250', time: '1 hour ago' },
    { id: 4, action: 'Faculty member added', user: 'Dr. Brown', time: '2 hours ago' },
  ];

  const handleAction = (action: string) => {
    toast.success(`${action} feature coming soon!`);
  };

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Students"
              value={mockStudents.length}
              icon={GraduationCap}
              description="+12% from last month"
            />
            <StatCard
              title="Total Courses"
              value={mockCourses.length}
              icon={BookOpen}
              description="Across 4 departments"
            />
            <StatCard
              title="Total Faculty"
              value={mockFaculty.length}
              icon={Users}
              description="Active instructors"
            />
          </div>

          {/* Quick Actions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                className="h-auto py-6 justify-start gap-4"
                onClick={() => handleAction('Add Course')}
              >
                <Plus className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Add Course</div>
                  <div className="text-xs opacity-90">Create new course</div>
                </div>
              </Button>

              <Button
                className="h-auto py-6 justify-start gap-4"
                onClick={() => handleAction('Add Student')}
              >
                <UserPlus className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Add Student</div>
                  <div className="text-xs opacity-90">Register new student</div>
                </div>
              </Button>

              <Button
                className="h-auto py-6 justify-start gap-4"
                onClick={() => handleAction('System Settings')}
              >
                <Settings className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Settings</div>
                  <div className="text-xs opacity-90">Configure system</div>
                </div>
              </Button>
            </div>
          </section>

          {/* Recent Activities */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start justify-between py-3 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.user && `${activity.user} `}
                          {activity.course && `- ${activity.course}`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
