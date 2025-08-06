'use client'

import { useState } from 'react'

/**
 * 🧪 TEST CHAT DIRECTO - PRUEBA LA NUEVA ARQUITECTURA
 * Este componente hace conexión directa al backend para validar la funcionalidad
 */

export default function TestChatDirect() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('unknown')

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://3.85.5.222:8001/api/health')
      if (response.ok) {
        const data = await response.json()
        setConnectionStatus('✅ Conectado')
        setResponse(`Salud del backend: ${JSON.stringify(data, null, 2)}`)
      } else {
        setConnectionStatus('❌ Error de conexión')
        setResponse(`Error: ${response.status}`)
      }
    } catch (error) {
      setConnectionStatus('❌ Sin conexión')
      setResponse(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
    setIsLoading(false)
  }

  const sendMessage = async () => {
    if (!message.trim()) return
    
    setIsLoading(true)
    setResponse('Enviando mensaje...')
    
    try {
      console.log('🌐 Enviando al backend:', message)
      
      const response = await fetch('http://3.85.5.222:8001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          message: message,
          session_id: `test_${Date.now()}`
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ Respuesta recibida:', data)
      
      setResponse(JSON.stringify(data, null, 2))
      
    } catch (error) {
      console.error('❌ Error:', error)
      setResponse(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
    
    setIsLoading(false)
  }

  const testAnalyze = async () => {
    setIsLoading(true)
    setResponse('Probando análisis...')
    
    try {
      const testSequence = "ATCGATCGATCG"
      
      const response = await fetch('http://3.85.5.222:8001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          sequence: testSequence,
          analysis_type: 'basic'
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ Análisis completado:', data)
      
      setResponse(JSON.stringify(data, null, 2))
      
    } catch (error) {
      console.error('❌ Error en análisis:', error)
      setResponse(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400">
        🧪 Test Chat Directo - ANTARES Backend
      </h2>

      {/* Estado de Conexión */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-semibold">Estado de Conexión:</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            connectionStatus.includes('✅') ? 'bg-green-500/20 text-green-400' : 
            connectionStatus.includes('❌') ? 'bg-red-500/20 text-red-400' : 
            'bg-gray-500/20 text-gray-400'
          }`}>
            {connectionStatus}
          </span>
        </div>
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium"
        >
          {isLoading ? '⏳ Probando...' : '🔍 Probar Conexión'}
        </button>
      </div>

      {/* Envío de Mensaje */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">💬 Enviar Mensaje</h3>
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !message.trim()}
            className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 px-6 py-2 rounded-lg font-medium"
          >
            {isLoading ? '⏳' : '🚀'}
          </button>
        </div>
      </div>

      {/* Botones de Prueba */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">🧬 Pruebas Adicionales</h3>
        <div className="flex gap-3">
          <button
            onClick={testAnalyze}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium"
          >
            🧪 Probar Análisis
          </button>
          <button
            onClick={() => setMessage('¿Qué puedes hacer por mí?')}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium"
          >
            ❓ Mensaje de Prueba
          </button>
        </div>
      </div>

      {/* Respuesta */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">📝 Respuesta del Backend</h3>
        <pre className="bg-black p-4 rounded-lg overflow-auto text-sm text-green-400 whitespace-pre-wrap">
          {response || 'Sin respuesta aún...'}
        </pre>
      </div>

      {/* Información del Backend */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg text-sm">
        <h4 className="font-semibold mb-2">🔧 Información del Backend</h4>
        <p><strong>URL:</strong> http://3.85.5.222:8001</p>
        <p><strong>Endpoints:</strong></p>
        <ul className="ml-4 list-disc text-gray-300">
          <li>/api/health - Estado del sistema</li>
          <li>/api/chat - Procesamiento de mensajes</li>
          <li>/api/analyze - Análisis de secuencias</li>
        </ul>
      </div>
    </div>
  )
}
