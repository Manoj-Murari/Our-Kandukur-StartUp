import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Opportunity = Database['public']['Tables']['opportunities']['Row']

export const useOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOpportunities = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOpportunities(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOpportunities()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('opportunities')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'opportunities' },
        () => {
          fetchOpportunities()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { opportunities, loading, error, refetch: fetchOpportunities }
}