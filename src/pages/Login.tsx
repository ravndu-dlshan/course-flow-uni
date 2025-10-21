import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, BookOpen, Settings } from 'lucide-react';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles = [
    { type: 'student' as UserRole, label: 'Student', icon: GraduationCap },
    { type: 'faculty' as UserRole, label: 'Faculty', icon: BookOpen },
    { type: 'admin' as UserRole, label: 'Admin', icon: Settings },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        if (!selectedRole) {
          toast.error('Please select a role');
          return;
        }
        
        const { error } = await signUp(email, password, fullName, selectedRole);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created! Please check your email to verify your account.');
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Welcome back!');
          // Navigation will be handled by the auth state change
          navigate('/');
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
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
            {!selectedRole && isSignUp ? (
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
                <div className="text-center pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsSignUp(false);
                      setSelectedRole(null);
                    }}
                    className="text-sm"
                  >
                    Already have an account? Sign In
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                {selectedRole && isSignUp && (
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
                )}

                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                )}

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
                    placeholder={isSignUp ? "Min 6 characters" : ""}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </span>
                  ) : (
                    <>
                      {isSignUp 
                        ? `Sign Up as ${selectedRole ? roles.find(r => r.type === selectedRole)?.label : ''}` 
                        : 'Sign In'}
                    </>
                  )}
                </Button>

                <div className="text-center space-y-2 text-sm">
                  {!isSignUp && (
                    <a href="#" className="text-primary hover:underline block">
                      Forgot Password?
                    </a>
                  )}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setSelectedRole(null);
                      setEmail('');
                      setPassword('');
                      setFullName('');
                    }}
                    className="text-primary hover:underline"
                  >
                    {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                  </Button>
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
