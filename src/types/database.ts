export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'student' | 'faculty' | 'admin'
          department: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role: 'student' | 'faculty' | 'admin'
          department?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'student' | 'faculty' | 'admin'
          department?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          code: string
          name: string
          instructor_id: string
          instructor_name: string
          credits: number
          total_seats: number
          enrolled_seats: number
          schedule: string
          department: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          instructor_id: string
          instructor_name: string
          credits: number
          total_seats: number
          enrolled_seats?: number
          schedule: string
          department: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          instructor_id?: string
          instructor_name?: string
          credits?: number
          total_seats?: number
          enrolled_seats?: number
          schedule?: string
          department?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          status: 'enrolled' | 'dropped' | 'completed'
          grade: string | null
          enrolled_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          status?: 'enrolled' | 'dropped' | 'completed'
          grade?: string | null
          enrolled_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          status?: 'enrolled' | 'dropped' | 'completed'
          grade?: string | null
          enrolled_at?: string
          updated_at?: string
        }
      }
      student_profiles: {
        Row: {
          id: string
          user_id: string
          gpa: number | null
          total_credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          gpa?: number | null
          total_credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gpa?: number | null
          total_credits?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'student' | 'faculty' | 'admin'
      enrollment_status: 'enrolled' | 'dropped' | 'completed'
    }
  }
}

