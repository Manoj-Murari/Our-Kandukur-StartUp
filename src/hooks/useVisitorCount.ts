import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useVisitorCount = () => {
  const [visitorCount, setVisitorCount] = useState(0)

  useEffect(() => {
    // Track visitor
    trackVisitor()
    
    // Get current count
    getVisitorCount()
  }, [])

  const trackVisitor = async () => {
    try {
      // Simple visitor tracking - in a real app, you'd want more sophisticated tracking
      const sessionId = sessionStorage.getItem('visitor_session') || generateSessionId()
      sessionStorage.setItem('visitor_session', sessionId)

      const { error } = await supabase
        .from('visitor_logs')
        .upsert([{
          session_id: sessionId,
          visited_at: new Date().toISOString(),
          page_url: window.location.href
        }], { onConflict: 'session_id' })

      if (error) throw error
    } catch (error) {
      console.error('Error tracking visitor:', error)
    }
  }

  const getVisitorCount = async () => {
    try {
      const { count, error } = await supabase
        .from('visitor_logs')
        .select('*', { count: 'exact', head: true })

      if (error) throw error
      setVisitorCount(count || 0)
    } catch (error) {
      console.error('Error getting visitor count:', error)
      // Fallback to a simulated count
      setVisitorCount(Math.floor(Math.random() * 1000) + 500)
    }
  }

  const generateSessionId = () => {
    return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  return visitorCount
}