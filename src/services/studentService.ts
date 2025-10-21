import { supabase } from '@/lib/supabase';

export const studentService = {
  // Get student profile
  async getStudentProfile(userId?: string): Promise<{ data: any | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) throw new Error('Not authenticated');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (profileError) throw profileError;

      const { data: studentProfile, error: studentError } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (studentError && studentError.code !== 'PGRST116') throw studentError;

      return {
        data: {
          ...profile,
          gpa: studentProfile?.gpa || 0,
          total_credits: studentProfile?.total_credits || 0,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // Update student profile
  async updateStudentProfile(gpa?: number, totalCredits?: number): Promise<{ error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updates: any = {};
      if (gpa !== undefined) updates.gpa = gpa;
      if (totalCredits !== undefined) updates.total_credits = totalCredits;

      const { error } = await supabase
        .from('student_profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // Get all students (admin only)
  async getAllStudents(): Promise<{ data: any[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          student_profiles (
            gpa,
            total_credits
          )
        `)
        .eq('role', 'student')
        .order('email');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // Get student dashboard stats
  async getStudentDashboardStats(): Promise<{ data: any | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get enrolled courses count
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('course_id, courses(credits)')
        .eq('student_id', user.id)
        .eq('status', 'enrolled');

      if (enrollError) throw enrollError;

      const enrolledCourses = enrollments?.length || 0;
      const totalCredits = enrollments?.reduce((sum: number, e: any) => {
        return sum + (e.courses?.credits || 0);
      }, 0) || 0;

      // Get student profile for GPA
      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('gpa')
        .eq('user_id', user.id)
        .single();

      return {
        data: {
          enrolledCourses,
          totalCredits,
          gpa: studentProfile?.gpa || 0,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },
};

