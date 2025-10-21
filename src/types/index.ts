export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  totalSeats: number;
  enrolledSeats: number;
  schedule: string;
  department: string;
  description: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  credits: number;
  gpa: number;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: string[];
}

export type UserRole = 'student' | 'faculty' | 'admin';
