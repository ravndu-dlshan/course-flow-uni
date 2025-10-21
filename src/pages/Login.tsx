import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, BookOpen, Settings } from 'lucide-react';
import { UserRole } from '@/types';

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roles = [
    { type: 'student' as UserRole, label: 'Student', icon: GraduationCap },
    { type: 'faculty' as UserRole, label: 'Faculty', icon: BookOpen },
    { type: 'admin' as UserRole, label: 'Admin', icon: Settings },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - redirect based on role
    if (selectedRole === 'student') {
      navigate('/student');
    } else if (selectedRole === 'faculty') {
      navigate('/faculty');
    } else if (selectedRole === 'admin') {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[hsl(var(--gradient-hero))] px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your portal</CardDescription>
          </CardHeader>

          <CardContent>
            {!selectedRole ? (
              <div className="space-y-4">
                <Label>Select Your Role</Label>
                <div className="grid grid-cols-3 gap-4">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.type}
                        onClick={() => setSelectedRole(role.type)}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-accent/50 transition-all"
                      >
                        <Icon className="h-8 w-8 text-primary" />
                        <span className="text-sm font-medium">{role.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-center mb-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setSelectedRole(null)}
                    className="text-sm text-muted-foreground"
                  >
                    ← Change Role
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Sign In as {roles.find(r => r.type === selectedRole)?.label}
                </Button>

                <div className="text-center space-y-2 text-sm">
                  <a href="#" className="text-primary hover:underline block">
                    Forgot Password?
                  </a>
                  <a href="#" className="text-primary hover:underline block">
                    Create Account
                  </a>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
