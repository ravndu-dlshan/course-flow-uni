import { useState } from 'react';
import { Course } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Calendar, Award } from 'lucide-react';
import { toast } from 'sonner';
import { enrollmentService } from '@/services/enrollmentService';

interface CourseCardProps {
  course: Course;
  enrolled?: boolean;
  onEnrollmentChange?: () => void;
}

export const CourseCard = ({ course, enrolled = false, onEnrollmentChange }: CourseCardProps) => {
  const [loading, setLoading] = useState(false);
  const availableSeats = course.totalSeats - course.enrolledSeats;
  const isFull = availableSeats <= 0;

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const { error } = await enrollmentService.enrollInCourse(course.id);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(`Successfully enrolled in ${course.code}!`);
        if (onEnrollmentChange) onEnrollmentChange();
      }
    } catch (error) {
      toast.error('Failed to enroll in course');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async () => {
    setLoading(true);
    try {
      const { error } = await enrollmentService.dropCourse(course.id);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(`Dropped ${course.code}`);
        if (onEnrollmentChange) onEnrollmentChange();
      }
    } catch (error) {
      toast.error('Failed to drop course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full hover:shadow-[var(--shadow-card-hover)] transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{course.code}</CardTitle>
            <CardDescription className="mt-1">{course.name}</CardDescription>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10">
            <Award className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-primary">{course.credits} Credits</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{course.instructor}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{course.schedule}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4" />
          <span className={isFull ? 'text-destructive font-medium' : 'text-muted-foreground'}>
            {availableSeats} / {course.totalSeats} seats available
          </span>
        </div>

        {!enrolled ? (
          <Button 
            className="w-full mt-4" 
            disabled={isFull || loading}
            onClick={handleEnroll}
          >
            {loading ? 'Enrolling...' : isFull ? 'Full' : 'Enroll'}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={handleUnenroll}
            disabled={loading}
          >
            {loading ? 'Dropping...' : 'Drop Course'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
