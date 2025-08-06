'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatService, ChatMessage } from '../../lib/chat-service'

export default function EnhancedEliteAstroFloraChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [driverAIStatus, setDriverAIStatus] = useState<boolean>(false)
  const [systemStats, setSystemStats] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Inicializar ChatService
  const [chatService] = useState(() => new ChatService(
    process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    { 
      fallbackToOpenAI: true,
      enableDriverAI: true 
    }
  ))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Verificar estado del Driver AI al cargar
  useEffect(() => {
    checkDriverAIStatus()
    loadSystemStats()
  }, [])

  const checkDriverAIStatus = async () => {
    try {
      console.log('🔍 Checking Driver AI status...')
      const isHealthy = await chatService.checkDriverAIHealth()
      console.log('🏥 Health check result:', isHealthy)
      setDriverAIStatus(isHealthy)
    } catch (error) {
      console.error('❌ Error checking Driver AI status:', error)
      setDriverAIStatus(false)
    }
  }

  const loadSystemStats = async () => {
    try {
      const stats = await chatService.getSystemStats()
      setSystemStats(stats)
    } catch (error) {
      console.error('Error loading system stats:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setIsLoading(true)

    console.log('🚀 EnhancedChat - Sending message:', currentInput.substring(0, 100))
    console.log('🔍 Driver AI Status in component:', driverAIStatus)
    console.log('🧬 ChatService instance:', chatService)

    try {
      const response = await chatService.sendMessage(
        currentInput,
        messages,
        'frontend-user'
      )

      console.log('✅ Response received:', response)
      setMessages(prev => [...prev, response])

    } catch (error) {
      console.error('❌ Error sending message:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `🚨 Error al procesar mensaje: ${error instanceof Error ? error.message : 'Error desconocido'}\n\nPor favor verifica que Driver AI esté disponible y prueba nuevamente.`,
        timestamp: new Date(),
        source: 'openai'
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatMessageContent = (message: ChatMessage) => {
    const lines = message.content.split('\n')
    return lines.map((line, index) => {
      if (line.startsWith('##')) {
        return <h3 key={index} className="text-lg font-bold text-cyan-300 mt-3 mb-2">{line.replace('##', '').trim()}</h3>
      } else if (line.startsWith('#')) {
        return <h2 key={index} className="text-xl font-bold text-green-300 mt-4 mb-2">{line.replace('#', '').trim()}</h2>
      } else if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 text-gray-200">{line.replace('- ', '').trim()}</li>
      } else if (line.trim() === '') {
        return <br key={index} />
      } else {
        return <p key={index} className="text-gray-200 mb-2">{line}</p>
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header con Status */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-gray-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🧬</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AstroFlora Elite Chat</h1>
              <p className="text-sm text-gray-400">Driver AI Integration • ANTARES 7.1</p>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
              driverAIStatus 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${driverAIStatus ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>Driver AI: {driverAIStatus ? 'Online' : 'Offline'}</span>
            </div>
            
            <button 
              onClick={() => { checkDriverAIStatus(); loadSystemStats(); }}
              className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
              title="Refresh Status"
            >
              <span className="text-gray-300">🔄</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-200px)]">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧬</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">AstroFlora Elite Chat</h2>
            <p className="text-gray-400 mb-6">Sistema científico avanzado con Driver AI Integration</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4">
                <h3 className="text-cyan-300 font-semibold mb-2">🔬 Análisis Científico</h3>
                <p className="text-sm text-gray-300">Análisis de proteínas, docking molecular, simulaciones</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4">
                <h3 className="text-green-300 font-semibold mb-2">🧬 Bioinformática</h3>
                <p className="text-sm text-gray-300">BLAST, alineamiento, análisis filogenético</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4">
                <h3 className="text-blue-300 font-semibold mb-2">🪐 Astrobiología</h3>
                <p className="text-sm text-gray-300">Extremófilos, biosignaturas, habitabilidad</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4">
                <h3 className="text-purple-300 font-semibold mb-2">💊 Diseño de Fármacos</h3>
                <p className="text-sm text-gray-300">ADMET, farmacología, química medicinal</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-[80%] rounded-2xl p-4 shadow-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600/90 to-blue-600/90 backdrop-blur-xl border border-cyan-500/30'
                    : message.source === 'driver-ai'
                    ? 'bg-gradient-to-r from-purple-800/90 to-blue-800/90 backdrop-blur-xl border border-purple-600/30'
                    : 'bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-600/30'
                }`}>
                  
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        message.source === 'driver-ai' 
                          ? 'bg-purple-500/30 border border-purple-400/50' 
                          : 'bg-green-500/30 border border-green-400/50'
                      }`}>
                        {message.source === 'driver-ai' ? '🤖' : '🧬'}
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-200">
                        {message.source === 'driver-ai' ? 'Driver AI' : 'AstroFlora AI'}
                      </span>
                      {message.confidence && (
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          {Math.round(message.confidence * 100)}%
                        </span>
                      )}
                      {message.processing_time && (
                        <span className="text-xs text-gray-400">
                          {message.processing_time}ms
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="text-white">
                    {formatMessageContent(message)}
                  </div>

                  {/* Recommendations */}
                  {message.recommendations && message.recommendations.length > 0 && (
                    <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/20">
                      <h4 className="text-sm font-semibold text-cyan-300 mb-2">💡 Recomendaciones:</h4>
                      <ul className="space-y-1">
                        {message.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm text-gray-200 flex items-start">
                            <span className="text-cyan-400 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Classification info for development */}
                  {message.classification && process.env.NODE_ENV === 'development' && (
                    <div className="mt-2 text-xs text-gray-400 border-t border-white/10 pt-2">
                      Type: {message.classification.type} | Domain: {message.classification.domain} | 
                      Confidence: {Math.round(message.classification.confidence * 100)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[80%] bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-purple-500/30 border border-purple-400/50 rounded-full flex items-center justify-center text-xs">
                      🤖
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wide text-purple-200">
                      {driverAIStatus ? 'Driver AI' : 'AstroFlora AI'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-cyan-300 animate-pulse">
                      {driverAIStatus ? 'Procesando con Driver AI...' : 'Analizando datos científicos...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700/50 bg-black/20">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={driverAIStatus 
                ? "Pregunta científica para Driver AI..." 
                : "Pregunta sobre astrobiología, docking molecular, análisis de compuestos..."
              }
              className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent placeholder-gray-400 pr-12"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                driverAIStatus 
                  ? 'bg-gradient-to-r from-purple-400 to-blue-500' 
                  : 'bg-gradient-to-r from-cyan-400 to-blue-500'
              }`}>
                <span className="text-xs">{driverAIStatus ? '🤖' : '⚡'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  driverAIStatus ? 'bg-purple-400' : 'bg-green-400'
                }`}></div>
                <span>{driverAIStatus ? 'Driver AI activo' : 'Sistema científico activo'}</span>
              </div>
              
              {systemStats && (
                <span className="text-gray-500">
                  Última verificación: {new Date(systemStats.lastHealthCheck).toLocaleTimeString()}
                </span>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`px-6 py-2 hover:scale-105 disabled:scale-100 text-white rounded-xl transition-all duration-300 font-medium text-sm shadow-lg ${
                driverAIStatus
                  ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700'
              } disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Enviando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{driverAIStatus ? '🤖' : '🚀'}</span>
                  <span>Enviar</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
