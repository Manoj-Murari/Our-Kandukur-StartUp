import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { User, AuthContextType } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // User doesn't exist, create profile
        await createUserProfile(authUser)
      } else if (data) {
        setUser(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const createUserProfile = async (authUser: SupabaseUser) => {
    try {
      const newUser: Partial<User> = {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.full_name || authUser.email!.split('@')[0],
        avatar_url: authUser.user_metadata?.avatar_url,
        role: 'user',
        tag: 'user',
        is_student: false,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([newUser])
        .select()
        .single()

      if (error) throw error
      setUser(data)
    } catch (error) {
      console.error('Error creating user profile:', error)
    }
  }

  const signIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const updateUserTag = async (userId: string, tag: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ tag })
        .eq('id', userId)

      if (error) throw error
      
      if (user && user.id === userId) {
        setUser({ ...user, tag: tag as any })
      }
    } catch (error) {
      console.error('Error updating user tag:', error)
      throw error
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role })
        .eq('id', userId)

      if (error) throw error
      
      if (user && user.id === userId) {
        setUser({ ...user, role: role as any })
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'founder'

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin,
    updateUserTag,
    updateUserRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}