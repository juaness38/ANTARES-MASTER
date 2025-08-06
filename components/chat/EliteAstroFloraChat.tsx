'use client'

import { useState, useRef, useEffect } from 'react'
import chatService from '../../src/services/chatService.js'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  metadata?: {
    model_used?: string
    confidence?: number
    timestamp?: string
  }
}

export default function EliteAstroFloraChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      // 🚀 USAR EL NUEVO CHAT SERVICE
      console.log('🤖 Procesando mensaje con Astroflora AI:', currentInput)
      
      const response = await chatService.processMessage(currentInput)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        metadata: {
          model_used: response.model_used,
          confidence: response.confidence,
          timestamp: response.timestamp
        }
      }

      setMessages(prev => [...prev, assistantMessage])
      
    } catch (error) {
      console.error('❌ Error en chat:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Error: ${error instanceof Error ? error.message : 'No se pudo procesar tu solicitud. Verifica la conexión con el backend.'}`
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900/95 via-blue-900/30 to-purple-900/20 backdrop-blur-xl border border-cyan-500/20 rounded-2xl">
      {/* Header Elite */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-black/20 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-xl">🧬</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Astroflora AI
            </h3>
            <p className="text-xs text-gray-400">Sistema Científico Avanzado</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-medium">ONLINE</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-gray-800/30">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
              <div className="text-4xl mb-4">🌌</div>
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Bienvenido a Astroflora AI
              </h3>
              <p className="text-gray-400 text-sm max-w-sm">
                Pregunta sobre astrobiología, docking molecular, análisis de compuestos o investigación científica avanzada
              </p>
              
              {/* Sugerencias rápidas */}
              <div className="mt-6 space-y-2">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Ejemplos:</div>
                <div className="space-y-1 text-xs">
                  <div className="bg-blue-500/10 px-3 py-1 rounded-full text-blue-300 border border-blue-500/20">
                    "¿Cómo funciona el docking molecular?"
                  </div>
                  <div className="bg-purple-500/10 px-3 py-1 rounded-full text-purple-300 border border-purple-500/20">
                    "Analiza este compuesto químico"
                  </div>
                  <div className="bg-green-500/10 px-3 py-1 rounded-full text-green-300 border border-green-500/20">
                    "Búsqueda de vida extraterrestre"
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } mb-4`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-xl border border-blue-500/30'
                      : 'bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-600/30'
                  } rounded-2xl p-4 shadow-2xl`}
                >
                  <div className={`flex items-center space-x-2 mb-2 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      message.role === 'user' 
                        ? 'bg-blue-500/30 border border-blue-400/50' 
                        : 'bg-green-500/30 border border-green-400/50'
                    }`}>
                      {message.role === 'user' ? '👤' : '🧬'}
                    </div>
                    <span className={`text-xs font-medium uppercase tracking-wide ${
                      message.role === 'user' ? 'text-blue-200' : 'text-green-200'
                    }`}>
                      {message.role === 'user' ? 'Usuario' : 'Astroflora AI'}
                    </span>
                  </div>
                  <div className="text-sm leading-relaxed text-white whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[80%] bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-green-500/30 border border-green-400/50 rounded-full flex items-center justify-center text-xs">
                      🧬
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wide text-green-200">
                      Astroflora AI
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-cyan-300 animate-pulse">Analizando datos científicos...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700/50 bg-black/20 rounded-b-2xl">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre astrobiología, docking molecular, análisis de compuestos..."
              className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent placeholder-gray-400 pr-12"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-xs">⚡</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span>Sistema científico activo</span>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 font-medium text-sm transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Enviando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>🚀</span>
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
