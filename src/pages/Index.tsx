import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, Users, Settings, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const portals = [
    {
      title: 'Student Portal',
      description: 'Browse courses, manage enrollments, and view your schedule',
      icon: GraduationCap,
      href: '/student',
      color: 'text-primary',
    },
    {
      title: 'Faculty Portal',
      description: 'Manage your courses, view enrolled students, and track progress',
      icon: BookOpen,
      href: '/faculty',
      color: 'text-accent',
    },
    {
      title: 'Admin Portal',
      description: 'Oversee system operations, manage users, and configure courses',
      icon: Settings,
      href: '/admin',
      color: 'text-primary',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[hsl(var(--gradient-hero))]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Welcome to <span className="text-primary">UniPortal</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Your comprehensive university course registration and management system. 
              Streamline enrollment, manage schedules, and access everything you need in one place.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/catalog">
                <Button size="lg">
                  Browse Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Cards Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Access Your Portal</h2>
            <p className="text-muted-foreground">Choose your role to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portals.map((portal) => {
              const Icon = portal.icon;
              return (
                <Link key={portal.href} to={portal.href}>
                  <Card className="h-full hover:shadow-[var(--shadow-card-hover)] transition-all hover:scale-105 cursor-pointer">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className={`h-6 w-6 ${portal.color}`} />
                      </div>
                      <CardTitle>{portal.title}</CardTitle>
                      <CardDescription>{portal.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="w-full justify-between group">
                        Enter Portal
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose UniPortal?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Registration</h3>
              <p className="text-muted-foreground">
                Enroll in courses with just a few clicks and manage your entire schedule effortlessly.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Course Management</h3>
              <p className="text-muted-foreground">
                Browse comprehensive course catalogs with detailed information and real-time availability.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Success</h3>
              <p className="text-muted-foreground">
                Track your academic progress and access all the tools you need to succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
