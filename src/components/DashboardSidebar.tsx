import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Calendar, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItem {
  title: string;
  href: string;
  icon: any;
}

const studentItems: SidebarItem[] = [
  { title: 'Dashboard', href: '/student', icon: Home },
  { title: 'Browse Courses', href: '/catalog', icon: BookOpen },
  { title: 'My Schedule', href: '/student/schedule', icon: Calendar },
  { title: 'Profile', href: '/student/profile', icon: User },
];

export const DashboardSidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className="w-64 bg-card border-r min-h-screen p-6">
      <nav className="space-y-2">
        {studentItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};
