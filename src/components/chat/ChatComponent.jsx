import React, { useState, useEffect, useRef } from 'react';
import chatService from './chatService';
import './ChatComponent.css';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('conectando');
  const messagesEndRef = useRef(null);
  
  // Verificar conexión al cargar
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await chatService.checkConnection();
      setConnectionStatus(isConnected ? 'disponible' : 'desconectado');
    };
    
    checkConnection();
    
    // Mensaje de bienvenida
    setMessages([
      {
        text: "Hola, soy Astroflora. Puedo ayudarte con análisis bioinformáticos, proteínas y más. ¿En qué puedo asistirte?",
        timestamp: new Date().toISOString(),
        source: 'astroflora',
        type: 'welcome'
      }
    ]);
  }, []);
  
  // Mantener scroll al fondo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage = {
      text: inputText,
      timestamp: new Date().toISOString(),
      source: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    try {
      // Enviar a API y obtener respuesta
      const response = await chatService.sendMessage(inputText);
      
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error:', error);
      // Mensaje de error
      setMessages(prev => [...prev, {
        text: `Error: ${error.message || 'No se pudo procesar tu solicitud'}`,
        timestamp: new Date().toISOString(),
        source: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSpecialCommands = (text) => {
    // Detectar comandos especiales como análisis de proteínas
    if (text.toLowerCase().includes('analiza proteína') || 
        text.toLowerCase().includes('analiza secuencia')) {
      return true;
    }
    return false;
  };
  
  return (
    <div className="astroflora-chat-container">
      <div className="chat-header">
        <div className="chat-title">
          <span className="icon">🧬</span>
          <span>Asistente Astroflora</span>
        </div>
        <div className={`status-badge ${connectionStatus}`}>
          Modo {connectionStatus}
        </div>
      </div>
      
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.source} ${msg.success === false ? 'error' : ''}`}
          >
            {msg.source === 'astroflora' && <div className="avatar">🧪</div>}
            <div className="message-content">
              <div className="message-text">{msg.text}</div>
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message astroflora loading">
            <div className="avatar">🧪</div>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="input-container" onSubmit={handleSubmit}>
        <input 
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Escribe un mensaje..."
          disabled={isLoading || connectionStatus === 'desconectado'}
          className="message-input"
        />
        <button 
          type="submit" 
          disabled={isLoading || !inputText.trim() || connectionStatus === 'desconectado'}
          className="send-button"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;
