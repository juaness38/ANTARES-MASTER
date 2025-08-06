'use client'

import { useState } from 'react'

export default function SimpleDriverAIChat() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    setResponse('')

    try {
      console.log('🚀 SimpleDriverAIChat - Testing Driver AI directly...')
      
      // Test 1: Health Check
      const healthResponse = await fetch('/api/driver-ai', {
        method: 'GET'
      })
      
      console.log('🏥 Health Check Status:', healthResponse.status)
      
      if (!healthResponse.ok) {
        throw new Error(`Health check failed: ${healthResponse.status}`)
      }
      
      const healthData = await healthResponse.json()
      console.log('✅ Driver AI Health:', healthData)

      // Test 2: Send Message
      const analysisResponse = await fetch('/api/driver-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sequence: message,
          analysis_type: 'blast'
        })
      })

      console.log('📡 Analysis Status:', analysisResponse.status)

      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text()
        throw new Error(`Analysis failed: ${analysisResponse.status} - ${errorText}`)
      }

      const analysisData = await analysisResponse.json()
      console.log('✅ Driver AI Analysis:', analysisData)

      setResponse(JSON.stringify(analysisData, null, 2))

    } catch (error) {
      console.error('❌ Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setResponse(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧬 Simple Driver AI Test</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter protein sequence or test message..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg"
            >
              {loading ? 'Testing...' : 'Test Driver AI'}
            </button>
          </div>
        </form>

        {response && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Response:</h2>
            <pre className="whitespace-pre-wrap text-sm text-green-400">
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
