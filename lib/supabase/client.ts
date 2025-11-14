import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Hardcoded values - will work even without environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tzlvskksfkyprqzlwurt.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bHZza2tzZmt5cHJxemx3dXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDQ5NjUsImV4cCI6MjA3ODUyMDk2NX0.TpQtZL5l7aXk65Y2XnIqtwRuQ8A8Dem4RrXEhBprvmc'

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}
