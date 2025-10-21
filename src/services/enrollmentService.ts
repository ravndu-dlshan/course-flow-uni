import { supabase } from '@/lib/supabase';

export const enrollmentService = {
  // Enroll in a course
  async enrollInCourse(courseId: string): Promise<{ error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if already enrolled
      const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('student_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (existing) {
        throw new Error('Already enrolled in this course');
      }

      // Check if course is full
      const { data: course } = await supabase
        .from('courses')
        .select('total_seats, enrolled_seats')
        .eq('id', courseId)
        .single();

      if (course && course.enrolled_seats >= course.total_seats) {
        throw new Error('Course is full');
      }

      // Enroll student
      const { error: enrollError } = await supabase
        .from('enrollments')
        .insert([
          {
            student_id: user.id,
            course_id: courseId,
            status: 'enrolled',
          },
        ]);

      if (enrollError) throw enrollError;

      // Increment enrolled_seats
      const { error: updateError } = await supabase
        .from('courses')
        .update({ enrolled_seats: (course?.enrolled_seats || 0) + 1 })
        .eq('id', courseId);

      if (updateError) throw updateError;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // Drop a course
  async dropCourse(courseId: string): Promise<{ error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update enrollment status to 'dropped'
      const { error: updateError } = await supabase
        .from('enrollments')
        .update({ status: 'dropped' })
        .eq('student_id', user.id)
        .eq('course_id', courseId)
        .eq('status', 'enrolled');

      if (updateError) throw updateError;

      // Decrement enrolled_seats
      const { data: course } = await supabase
        .from('courses')
        .select('enrolled_seats')
        .eq('id', courseId)
        .single();

      if (course && course.enrolled_seats > 0) {
        const { error: decrementError } = await supabase
          .from('courses')
          .update({ enrolled_seats: course.enrolled_seats - 1 })
          .eq('id', courseId);

        if (decrementError) throw decrementError;
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // Get student's enrollments
  async getStudentEnrollments(studentId?: string): Promise<{ data: any[] | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = studentId || user?.id;
      
      if (!userId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          status,
          grade,
          enrolled_at,
          courses:course_id (
            id,
            code,
            name,
            instructor_name,
            credits,
            schedule,
            department,
            description
          )
        `)
        .eq('student_id', userId)
        .eq('status', 'enrolled')
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // Check if student is enrolled in course
  async isEnrolled(courseId: string): Promise<{ enrolled: boolean; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { enrolled: false, error: null };

      const { data, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('student_id', user.id)
        .eq('course_id', courseId)
        .eq('status', 'enrolled')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return { enrolled: !!data, error: null };
    } catch (error) {
      return { enrolled: false, error: error as Error };
    }
  },

  // Get enrollment statistics (for admin)
  async getEnrollmentStats(): Promise<{ data: any | null; error: Error | null }> {
    try {
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('status')
        .eq('status', 'enrolled');

      if (enrollError) throw enrollError;

      const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select('id, total_seats, enrolled_seats');

      if (courseError) throw courseError;

      const totalEnrollments = enrollments?.length || 0;
      const totalCapacity = courses?.reduce((sum, c) => sum + c.total_seats, 0) || 0;
      const totalEnrolled = courses?.reduce((sum, c) => sum + c.enrolled_seats, 0) || 0;

      return {
        data: {
          totalEnrollments,
          totalCapacity,
          totalEnrolled,
          utilizationRate: totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },
};

