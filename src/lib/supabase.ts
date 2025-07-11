import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      opportunities: {
        Row: {
          id: number
          title: string
          company: string
          location: string
          type: string
          status: string
          deadline: string
          description: string
          requirements: string[]
          stipend: string
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          company: string
          location: string
          type: string
          status?: string
          deadline: string
          description: string
          requirements: string[]
          stipend: string
        }
        Update: {
          title?: string
          company?: string
          location?: string
          type?: string
          status?: string
          deadline?: string
          description?: string
          requirements?: string[]
          stipend?: string
        }
      }
      announcements: {
        Row: {
          id: number
          title: string
          content: string
          type: string
          priority: string
          created_at: string
          expires_at: string | null
        }
        Insert: {
          title: string
          content: string
          type?: string
          priority?: string
          expires_at?: string | null
        }
        Update: {
          title?: string
          content?: string
          type?: string
          priority?: string
          expires_at?: string | null
        }
      }
      team_members: {
        Row: {
          id: number
          name: string
          role: string
          location: string
          phone: string
          email: string
          linkedin: string | null
          instagram: string | null
          resume_url: string | null
          created_at: string
        }
        Insert: {
          name: string
          role: string
          location: string
          phone: string
          email: string
          linkedin?: string | null
          instagram?: string | null
          resume_url?: string | null
        }
        Update: {
          name?: string
          role?: string
          location?: string
          phone?: string
          email?: string
          linkedin?: string | null
          instagram?: string | null
          resume_url?: string | null
        }
      }
    }
  }
}