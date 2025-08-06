/**
 * Chat Component para AstroFlora Driver AI
 * Componente React con manejo robusto de errores y integración completa
 */

import React, { useState, useEffect, useRef } from 'react';

const ChatComponent = ({ 
  config = null, 
  onMessageSent = null, 
  onResponseReceived = null,
  className = '',
  placeholder = 'Escribe tu mensaje para AstroFlora Driver AI...'
}) => {
  // Estados del componente
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [apiService, setApiService] = useState(null);
  const [error, setError] = useState(null);
  
  // Referencias
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Inicializar servicio API
  useEffect(() => {
    const initializeAPI = async () => {
      try {
        // Verificar que AstrofloraAPI esté disponible
        if (typeof window !== 'undefined' && window.AstrofloraAPI) {
          const service = new window.AstrofloraAPI();
          setApiService(service);
          
          // Verificar conectividad inicial
          const status = await service.getConnectionStatus();
          setConnectionStatus(status.isOnline ? 'connected' : 'disconnected');
          
          if (!status.isOnline) {
            setError('No se pudo conectar con el backend');
          }
        } else {
          setError('Servicio de API no disponible');
          setConnectionStatus('error');
        }
      } catch (err) {
        console.error('Error inicializando API:', err);
        setError('Error de inicialización');
        setConnectionStatus('error');
      }
    };

    initializeAPI();
  }, []);

  // Auto-scroll al final de mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Enviar mensaje
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !apiService) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);
    setError(null);

    // Agregar mensaje del usuario
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);

    // Callback para mensaje enviado
    if (onMessageSent) {
      onMessageSent(newUserMessage);
    }

    try {
      // Enviar mensaje al backend
      const response = await apiService.sendMessage(userMessage);
      
      // Crear mensaje de respuesta
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.response || 'Sin respuesta',
        timestamp: response.timestamp || new Date().toISOString(),
        metadata: response.metadata || {},
        endpoint: response.endpoint
      };

      setMessages(prev => [...prev, botMessage]);

      // Callback para respuesta recibida
      if (onResponseReceived) {
        onResponseReceived(botMessage, response);
      }

      // Verificar si es una respuesta de error
      if (response.error || response.originalError) {
        setError(`Error del servidor: ${response.originalError || 'Error desconocido'}`);
      }

    } catch (err) {
      console.error('Error enviando mensaje:', err);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `Error: ${err.message}`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Limpiar chat
  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  // Test de conectividad
  const testConnection = async () => {
    if (!apiService) return;
    
    setIsLoading(true);
    try {
      const results = await apiService.runConnectivityTest();
      console.log('Test de conectividad:', results);
      
      const testMessage = {
        id: Date.now(),
        type: 'system',
        content: `Test de conectividad completado: ${results.summary.passed}/${results.summary.total} endpoints OK`,
        timestamp: new Date().toISOString(),
        metadata: results
      };
      
      setMessages(prev => [...prev, testMessage]);
      setConnectionStatus(results.summary.passed > 0 ? 'connected' : 'disconnected');
    } catch (err) {
      setError(`Error en test: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar indicador de estado
  const renderStatusIndicator = () => {
    const statusColors = {
      checking: '#fbbf24',
      connected: '#10b981',
      disconnected: '#ef4444',
      error: '#dc2626'
    };

    const statusTexts = {
      checking: 'Verificando...',
      connected: 'Conectado',
      disconnected: 'Desconectado',
      error: 'Error'
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
        <div 
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: statusColors[connectionStatus] || '#6b7280'
          }}
        />
        <span style={{ color: statusColors[connectionStatus] || '#6b7280' }}>
          {statusTexts[connectionStatus] || 'Desconocido'}
        </span>
      </div>
    );
  };

  // Renderizar mensaje
  const renderMessage = (message) => {
    const isUser = message.type === 'user';
    const isError = message.type === 'error';
    const isSystem = message.type === 'system';

    const messageStyle = {
      marginBottom: '16px',
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start'
    };

    const bubbleStyle = {
      maxWidth: '70%',
      padding: '12px 16px',
      borderRadius: '18px',
      backgroundColor: isUser ? '#007bff' : 
                     isError ? '#fee2e2' : 
                     isSystem ? '#f3f4f6' : '#ffffff',
      color: isUser ? '#ffffff' : 
             isError ? '#dc2626' : 
             isSystem ? '#6b7280' : '#000000',
      border: isUser ? 'none' : '1px solid #e5e7eb',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
    };

    return (
      <div key={message.id} style={messageStyle}>
        <div style={bubbleStyle}>
          <div style={{ marginBottom: '4px' }}>
            {message.content}
          </div>
          <div style={{ 
            fontSize: '10px', 
            opacity: 0.7,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
            {message.endpoint && (
              <span style={{ fontSize: '9px' }}>via {message.endpoint}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`astroflora-chat ${className}`} style={{
      display: 'flex',
      flexDirection: 'column',
      height: '500px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
            AstroFlora Driver AI
          </h3>
          {renderStatusIndicator()}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={testConnection}
            disabled={isLoading}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            Test
          </button>
          <button
            onClick={clearChat}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#fef2f2',
          borderBottom: '1px solid #fecaca',
          color: '#dc2626',
          fontSize: '12px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: '#f9fafb'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px',
            marginTop: '40px'
          }}>
            👋 ¡Hola! Soy AstroFlora Driver AI.<br/>
            Pregúntame sobre análisis moleculares, microambientes o cualquier consulta científica.
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        
        {isLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#6b7280',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#6b7280',
                  animation: 'pulse 1.5s ease-in-out infinite 0.5s'
                }} />
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#6b7280',
                  animation: 'pulse 1.5s ease-in-out infinite 1s'
                }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading || connectionStatus === 'error'}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: (isLoading || connectionStatus === 'error') ? '#f9fafb' : '#ffffff'
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || connectionStatus === 'error'}
            style={{
              padding: '12px 20px',
              backgroundColor: '#007bff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              opacity: (!inputValue.trim() || isLoading || connectionStatus === 'error') ? 0.5 : 1
            }}
          >
            {isLoading ? '...' : 'Enviar'}
          </button>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% {
            opacity: 0.5;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatComponent;
