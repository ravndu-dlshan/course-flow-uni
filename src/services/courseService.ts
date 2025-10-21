import { supabase } from '@/lib/supabase';
import { Course } from '@/types';

export const courseService = {
  // Get all courses
  async getAllCourses(): Promise<{ data: Course[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('code');

      if (error) throw error;

      // Map database fields to Course type
      const courses: Course[] = (data || []).map((course) => ({
        id: course.id,
        code: course.code,
        name: course.name,
        instructor: course.instructor_name,
        credits: course.credits,
        totalSeats: course.total_seats,
        enrolledSeats: course.enrolled_seats,
        schedule: course.schedule,
        department: course.department,
        description: course.description,
      }));

      return { data: courses, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // Get courses by department
  async getCoursesByDepartment(department: string): Promise<{ data: Course[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('department', department)
        .order('code');

      if (error) throw error;

      const courses: Course[] = (data || []).map((course) => ({
        id: course.id,
        code: course.code,
        name: course.name,
        instructor: course.instructor_name,
        credits: course.credits,
        totalSeats: course.total_seats,
        enrolledSeats: course.enrolled_seats,
        schedule: course.schedule,
        department: course.department,
        description: course.description,
      }));

      return { data: courses, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // Get course by ID
  async getCourseById(id: string): Promise<{ data: Course | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const course: Course = {
        id: data.id,
        code: data.code,
        name: data.name,
        instructor: data.instructor_name,
        credits: data.credits,
        totalSeats: data.total_seats,
        enrolledSeats: data.enrolled_seats,
        schedule: data.schedule,
        department: data.department,
        description: data.description,
      };

      return { data: course, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // Create a new course (admin/faculty only)
  async createCourse(course: Omit<Course, 'id' | 'enrolledSeats'>): Promise<{ data: Course | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([
          {
            code: course.code,
            name: course.name,
            instructor_name: course.instructor,
            credits: course.credits,
            total_seats: course.totalSeats,
            schedule: course.schedule,
            department: course.department,
            description: course.description,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const newCourse: Course = {
        id: data.id,
        code: data.code,
        name: data.name,
        instructor: data.instructor_name,
        credits: data.credits,
        totalSeats: data.total_seats,
        enrolledSeats: data.enrolled_seats,
        schedule: data.schedule,
        department: data.department,
        description: data.description,
      };

      return { data: newCourse, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // Update course
  async updateCourse(id: string, updates: Partial<Course>): Promise<{ error: Error | null }> {
    try {
      const dbUpdates: any = {};
      if (updates.code) dbUpdates.code = updates.code;
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.instructor) dbUpdates.instructor_name = updates.instructor;
      if (updates.credits) dbUpdates.credits = updates.credits;
      if (updates.totalSeats !== undefined) dbUpdates.total_seats = updates.totalSeats;
      if (updates.enrolledSeats !== undefined) dbUpdates.enrolled_seats = updates.enrolledSeats;
      if (updates.schedule) dbUpdates.schedule = updates.schedule;
      if (updates.department) dbUpdates.department = updates.department;
      if (updates.description) dbUpdates.description = updates.description;

      const { error } = await supabase
        .from('courses')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // Delete course
  async deleteCourse(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },
};

