'use client';

import React, { useState } from 'react';
import MCPStatus from './MCPStatus';

interface AstroFloraChatProps {
  className?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AstroFloraChat({ className = "" }: AstroFloraChatProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/astroflora-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (response.ok) {
        const responseText = await response.text();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseText
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Error de conexión. Por favor, intenta de nuevo.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-t-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🧬</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">AstroFlora AI</h3>
              <p className="text-green-100 text-xs">Asistente Biológico Inteligente</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MCPStatus className="bg-white/20 border-white/30" />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              {isExpanded ? '−' : '+'}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      {isExpanded && (
        <div className="p-4">
          {/* Messages Area */}
          <div className="h-80 overflow-y-auto mb-4 space-y-3 bg-gray-50 rounded-lg p-3">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🌱</div>
                <p className="text-gray-600 text-sm">
                  ¡Hola! Soy AstroFlora AI, tu asistente para biología, genética y biotecnología.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Pregúntame sobre análisis BLAST, predicción de estructuras, o cualquier tema científico.
                </p>
              </div>
            ) : (
              messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center text-xs text-green-600 mb-1">
                        <span className="mr-1">🤖</span> AstroFlora AI
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">Analizando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Pregunta sobre biología, genética, BLAST..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '⏳' : '🚀'}
            </button>
          </form>

          {/* Quick Actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setInput('¿Cómo funciona el análisis BLAST?')}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
            >
              📊 Análisis BLAST
            </button>
            <button
              onClick={() => setInput('¿Qué es la predicción de estructura proteica?')}
              className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
            >
              🧬 Predicción Estructura
            </button>
            <button
              onClick={() => setInput('¿Cómo se hace anotación de proteínas?')}
              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
            >
              🔬 Anotación Proteica
            </button>
          </div>
        </div>
      )}

      {/* Collapsed State */}
      {!isExpanded && (
        <div className="p-4 text-center">
          <div className="text-2xl mb-2">🌿</div>
          <p className="text-gray-600 text-sm">
            Chat con AstroFlora AI
          </p>
          <p className="text-gray-500 text-xs">
            Haz clic en + para empezar
          </p>
        </div>
      )}
    </div>
  );
}
