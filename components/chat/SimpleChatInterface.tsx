'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function SimpleChatInterface() {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      console.log('🔑 Enter pressed, calling handleSubmit directly')
      handleSubmitMessage()
    }
  }

  const handleSubmitMessage = async () => {
    console.log('🚀 handleSubmitMessage called', { input, isLoading })
    
    if (!input.trim() || isLoading) {
      console.log('❌ Submit blocked:', { inputEmpty: !input.trim(), isLoading })
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setIsLoading(true)

    console.log('📤 Enviando mensaje:', currentInput)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: currentInput
            }
          ]
        }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      // Crear mensaje del asistente
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: ''
      }

      setMessages(prev => [...prev, assistantMessage])

      // Leer el stream de respuesta
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            assistantMessage.content += chunk
            
            setMessages(prev => 
              prev.map(msg => 
                msg.id === assistantMessage.id 
                  ? { ...msg, content: assistantMessage.content }
                  : msg
              )
            )
          }
        } finally {
          reader.releaseLock()
        }
      }
    } catch (error) {
      console.error('Error en el chat:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Lo siento, ocurrió un error. Por favor intenta de nuevo.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-8">
            <div className="text-6xl mb-4">🧬</div>
            <h2 className="text-2xl font-bold mb-2">Astroflora AI</h2>
            <p>Sistema Científico Avanzado - Listo para asistirte</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl backdrop-blur-sm border ${
                message.role === 'user'
                  ? 'bg-blue-600/30 border-blue-400/30 text-white'
                  : 'bg-white/10 border-white/20 text-slate-100'
              }`}
            >
              <div className="text-sm font-medium mb-1 opacity-70">
                {message.role === 'user' ? '👤 Usuario' : '🤖 Astroflora AI'}
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-slate-300">Astroflora AI está pensando...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmitMessage(); }} className="p-4 border-t border-white/10">
        <div className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregunta sobre astrobiología, docking molecular..."
            className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSubmitMessage}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm"
          >
            {isLoading ? '⏳' : '🚀'}
          </button>
        </div>
      </form>
    </div>
  )
}
