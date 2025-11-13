'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function TestConnectionPage() {
  const [status, setStatus] = useState<string>('Testing...')
  const [error, setError] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<any>({})

  useEffect(() => {
    async function testConnection() {
      try {
        // Check environment variables
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        setEnvVars({
          url: supabaseUrl ? 'Set' : 'Missing',
          key: supabaseKey ? 'Set' : 'Missing',
          urlValue: supabaseUrl || 'undefined',
          keyLength: supabaseKey?.length || 0
        })

        if (!supabaseUrl || !supabaseKey) {
          setError('Environment variables not set!')
          setStatus('Failed')
          return
        }

        // Try to create client
        const supabase = createClient()

        // Try to get session
        const { data, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          setError(`Session error: ${sessionError.message}`)
          setStatus('Failed')
          return
        }

        setStatus('Success! Supabase is connected.')
      } catch (err: any) {
        setError(err.message || 'Unknown error')
        setStatus('Failed')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-4">
          <h2 className="text-xl font-semibold mb-4">Status: <span className={status === 'Success! Supabase is connected.' ? 'text-green-400' : 'text-red-400'}>{status}</span></h2>

          {error && (
            <div className="bg-red-900/50 border border-red-500 p-4 rounded mb-4">
              <p className="font-semibold">Error:</p>
              <p className="font-mono text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold mb-2">Environment Variables:</h3>
            <p>NEXT_PUBLIC_SUPABASE_URL: <span className={envVars.url === 'Set' ? 'text-green-400' : 'text-red-400'}>{envVars.url}</span></p>
            <p className="text-sm text-gray-400 break-all">Value: {envVars.urlValue}</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: <span className={envVars.key === 'Set' ? 'text-green-400' : 'text-red-400'}>{envVars.key}</span></p>
            <p className="text-sm text-gray-400">Length: {envVars.keyLength} characters</p>
          </div>
        </div>

        <a href="/signup" className="text-blue-400 hover:underline">← Back to Signup</a>
      </div>
    </div>
  )
}
