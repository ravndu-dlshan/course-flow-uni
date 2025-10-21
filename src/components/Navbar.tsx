import { Link } from 'react-router-dom';
import { GraduationCap, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NavbarProps {
  variant?: 'default' | 'dashboard';
}

export const Navbar = ({ variant = 'default' }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  <Button>Login</Button>
                </Link>
              </div>

              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </>
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
            <Link to="/login" className="block py-2 text-sm font-medium text-foreground hover:text-primary">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
