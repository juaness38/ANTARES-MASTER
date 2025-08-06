/**
 * 🤖 JARVIS CHAT COMPONENT
 * Chat inteligente conectado al estado global y Jarvis Driver AI
 * Ejecuta comandos automáticamente en las visualizaciones
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDriverAIState, useDriverAIActions } from '../../lib/astroflora-store';
import { jarvisClient } from '../../lib/jarvis-client';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  commands?: any[];
  confidence?: number;
}

export default function JarvisChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '🤖 **Jarvis Online** - Asistente Científico de Astroflora\n\nSoy tu copiloto científico inteligente. Puedo:\n- 🧬 Analizar secuencias de proteínas\n- 📊 Controlar visualizaciones moleculares\n- 🧪 Asistir en protocolos experimentales\n- 📈 Interpretar datos científicos\n\n¿En qué experimento te ayudo hoy?',
      timestamp: new Date(),
      confidence: 1.0
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 🎯 CONECTAR AL ESTADO GLOBAL
  const { isOnline, processingCommand } = useDriverAIState();
  const { setOnline, addMessage, setProcessing } = useDriverAIActions();

  // 🔄 Sistema de auto-scroll ULTRA SIMPLE - Sin interferencias
  const forceScrollToBottom = React.useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      // Scroll directo sin animaciones
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // 🔄 Auto-scroll después de nuevos mensajes
  useEffect(() => {
    if (messages.length > 0) {
      // Cancelar timeout anterior
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
      
      // Scroll después de que el DOM se actualice
      autoScrollTimeoutRef.current = setTimeout(() => {
        forceScrollToBottom();
      }, 100);
    }
    
    return () => {
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, [messages.length, forceScrollToBottom]);

  // 🔄 Health check inicial - Solo una vez
  useEffect(() => {
    let mounted = true;
    
    const checkHealth = async () => {
      try {
        const healthy = await jarvisClient.healthCheck();
        if (mounted) {
          setOnline(healthy);
        }
      } catch (error) {
        console.error('🚨 Jarvis health check failed:', error);
        if (mounted) {
          setOnline(false);
        }
      }
    };

    checkHealth();
    return () => { mounted = false; };
  }, [setOnline]);

  /**
   * 🔧 HELPER PARA MANEJAR CAMBIOS EN EL INPUT - VERSIÓN ULTRA SIMPLE
   */
  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  /**
   * 🔧 HELPER PARA MANEJAR TECLAS - VERSIÓN ULTRA SIMPLE
   */
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading && isOnline) {
        // Trigger form submit
        const form = e.currentTarget.closest('form');
        if (form) {
          form.requestSubmit();
        }
      }
    }
  }, [input, isLoading, isOnline]);

  /**
   * 🔧 HELPER PARA ESTABLECER TEXTO SUGERIDO
   */
  const setSuggestedText = React.useCallback((text: string) => {
    setInput(text);
  }, []);

  /**
   * 🏥 VERIFICAR SALUD DE JARVIS
   */
  const checkJarvisHealth = async () => {
    try {
      const healthy = await jarvisClient.healthCheck();
      setOnline(healthy);
    } catch (error) {
      console.error('🚨 Jarvis health check failed:', error);
      setOnline(false);
    }
  };

  /**
   * 📤 ENVIAR MENSAJE A JARVIS - Optimizado
   */
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevenir propagación de eventos
    
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    const currentInput = input.trim();
    
    // Limpiar input inmediatamente para mejor UX
    setInput('');
    
    // Agregar mensaje del usuario inmediatamente
    setMessages(prev => [...prev, userMessage]);
    addMessage(userMessage);
    
    // Forzar scroll cuando el usuario envía mensaje
    setTimeout(() => {
      forceScrollToBottom();
    }, 50);
    
    setIsLoading(true);
    setProcessing(true);

    try {
      console.log('🤖 Sending message to Jarvis:', currentInput);
      
      // Procesar con Jarvis (incluye ejecución automática de comandos)
      const response = await jarvisClient.process(currentInput);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        commands: response.commands,
        confidence: response.confidence
      };

      // Agregar respuesta de Jarvis
      setMessages(prev => [...prev, assistantMessage]);
      addMessage(assistantMessage);

      console.log('✅ Jarvis response processed:', {
        commandsExecuted: response.commands?.length || 0,
        confidence: response.confidence
      });

    } catch (error) {
      console.error('🚨 Jarvis error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `🚨 **Error de Conexión con Jarvis**\n\n${error instanceof Error ? error.message : 'Error desconocido'}\n\nVerificando conexión con Driver AI...`,
        timestamp: new Date(),
        confidence: 0
      };

      setMessages(prev => [...prev, errorMessage]);
      addMessage(errorMessage);

      // Reintentar health check
      setTimeout(checkJarvisHealth, 2000);

    } finally {
      setIsLoading(false);
      setProcessing(false);
    }
  };

  /**
   * 🎨 RENDERIZAR MENSAJE - Optimizado con memo
   */
  const renderMessage = React.useCallback((message: ChatMessage) => (
    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg transition-all duration-200 ${
        message.role === 'user' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-800 text-white border border-gray-700'
      }`}>
        {/* Avatar y info */}
        <div className="flex items-center mb-2">
          <div className="text-lg mr-2">
            {message.role === 'user' ? '👤' : '🤖'}
          </div>
          <div className="text-sm opacity-75">
            {message.role === 'user' ? 'Usuario' : 'Jarvis'}
            {message.confidence !== undefined && (
              <span className="ml-2 text-xs">
                ({(message.confidence * 100).toFixed(0)}%)
              </span>
            )}
          </div>
        </div>

        {/* Contenido del mensaje */}
        <div className="whitespace-pre-wrap text-sm">
          {message.content}
        </div>

        {/* Comandos ejecutados */}
        {message.commands && message.commands.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="text-xs text-gray-400 mb-1">
              Comandos ejecutados: {message.commands.length}
            </div>
            <div className="flex flex-wrap gap-1">
              {message.commands.map((cmd, idx) => (
                <span key={idx} className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                  {cmd.type}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs opacity-50 mt-2">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  ), []);

  return (
    <div 
      className="jarvis-chat-container h-full bg-gray-900 text-white flex flex-col" 
      style={{ position: 'relative', zIndex: 10, isolation: 'isolate' }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="jarvis-header bg-gray-800 p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🤖</div>
            <div>
              <h2 className="text-xl font-bold">Jarvis</h2>
              <p className="text-sm text-gray-400">Asistente Científico IA</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Status de procesamiento */}
            {processingCommand && (
              <div className="flex items-center space-x-2 text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-sm">Ejecutando comando...</span>
              </div>
            )}
            
            {/* Status de conexión */}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isOnline 
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 text-white'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-green-200' : 'bg-red-200'
              }`}></div>
              <span>{isOnline ? 'Driver AI: Online' : 'Driver AI: Offline'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Área de mensajes - VERSIÓN SIMPLIFICADA */}
      <div 
        ref={messagesContainerRef}
        className="jarvis-messages flex-1 p-4 space-y-4" 
        style={{ 
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 300px)',
          scrollBehavior: 'auto', // Cambiado a auto para evitar conflictos
          WebkitOverflowScrolling: 'touch'
        }}
        onScroll={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {messages.map(renderMessage)}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-sm text-gray-400">Jarvis está procesando...</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Botón simple para ir al final */}
        <button
          onClick={() => {
            forceScrollToBottom();
          }}
          className="fixed bottom-24 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all"
          title="Ir al final de la conversación"
        >
          ⬇️
        </button>
      </div>

      {/* Input de mensaje - VERSIÓN RADICAL SIMPLIFICADA */}
      <div className="jarvis-input p-4 border-t border-gray-700 bg-gray-900 flex-shrink-0">
        <form 
          onSubmit={sendMessage}
          className="flex space-x-2"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje a Jarvis..."
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
            disabled={isLoading || !isOnline}
            rows={1}
            style={{ 
              resize: 'none',
              minHeight: '44px',
              maxHeight: '120px'
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !isOnline}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200"
          >
            {isLoading ? '⏳' : '🚀'}
          </button>
        </form>
        
        {!isOnline && (
          <div className="mt-2 text-center text-red-400 text-sm">
            ⚠️ Driver AI desconectado. Verificando conexión...
          </div>
        )}
        
        {/* Botón de diagnóstico */}
        <div className="mt-2 text-center">
          <button
            onClick={() => {
              const script = document.createElement('script');
              script.src = '/diagnostico.js';
              document.head.appendChild(script);
            }}
            className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-800"
          >
            🔧 Activar Diagnóstico
          </button>
        </div>
      </div>

      {/* Footer con sugerencias */}
      <div className="jarvis-footer bg-gray-800 p-3 text-xs text-gray-400 border-t border-gray-700 flex-shrink-0">
        <div className="flex justify-center space-x-4 flex-wrap">
          <span 
            className="cursor-pointer hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSuggestedText("analizar secuencia MALVRD");
            }}
          >
            💡 Prueba: "analizar secuencia MALVRD..."
          </span>
          <span 
            className="cursor-pointer hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSuggestedText("cargar estructura 1CRN");
            }}
          >
            🧬 "cargar estructura 1CRN"
          </span>
          <span 
            className="cursor-pointer hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSuggestedText("protocolo PCR");
            }}
          >
            🧪 "protocolo PCR"
          </span>
        </div>
      </div>
    </div>
  );
}
