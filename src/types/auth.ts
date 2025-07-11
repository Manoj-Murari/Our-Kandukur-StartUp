export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: 'user' | 'admin' | 'founder' | 'teacher' | 'mentor' | 'vip' | 'manager'
  tag: 'user' | 'student' | 'admin' | 'founder' | 'teacher' | 'mentor' | 'vip' | 'manager'
  is_student: boolean
  academic_details?: AcademicDetails
  personal_info?: PersonalInfo
  created_at: string
  last_login?: string
}

export interface AcademicDetails {
  institution: string
  course: string
  year: string
  cgpa?: string
  skills: string[]
  certifications: string[]
}

export interface PersonalInfo {
  phone?: string
  address?: string
  date_of_birth?: string
  linkedin?: string
  github?: string
  portfolio?: string
}

export interface Message {
  id: string
  user_id: string
  user_name: string
  user_tag: string
  content: string
  created_at: string
  avatar_url?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: () => void
  signOut: () => void
  isAdmin: boolean
  updateUserTag: (userId: string, tag: string) => Promise<void>
  updateUserRole: (userId: string, role: string) => Promise<void>
}