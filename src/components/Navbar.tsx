import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  variant?: 'default' | 'dashboard';
}

export const Navbar = ({ variant = 'default' }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="border-b bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">UniPortal</span>
          </Link>

          {variant === 'default' && (
            <>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/catalog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Courses
                </Link>
                {user && profile ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <User className="h-4 w-4" />
                        {profile.full_name || profile.email}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(profile.role === 'student' ? '/student' : '/admin')}>
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/login">
                    <Button>Login</Button>
                  </Link>
                )}
              </div>

              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </>
          )}

          {variant === 'dashboard' && user && profile && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden md:block">
                {profile.full_name || profile.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>

        {mobileMenuOpen && variant === 'default' && (
          <div className="md:hidden py-4 space-y-2">
            <Link to="/" className="block py-2 text-sm font-medium text-foreground hover:text-primary">
              Home
            </Link>
            <Link to="/catalog" className="block py-2 text-sm font-medium text-foreground hover:text-primary">
              Courses
            </Link>
            {user && profile ? (
              <>
                <Link to={profile.role === 'student' ? '/student' : '/admin'} className="block py-2 text-sm font-medium text-foreground hover:text-primary">
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="block py-2 text-sm font-medium text-red-600 w-full text-left">
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="block py-2 text-sm font-medium text-foreground hover:text-primary">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
