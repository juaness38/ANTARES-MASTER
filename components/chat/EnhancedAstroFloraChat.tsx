'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, FileDown, Bot, User, Download } from 'lucide-react';

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64 or blob URL
}

interface CommandResponse {
  type: 'command';
  action: string;
  parameters: any;
  files?: FileAttachment[];
  status: 'success' | 'error' | 'info';
  message: string;
}

interface ChatResponse {
  type: 'chat';
  message: string;
  files?: FileAttachment[];
}

type ApiResponse = CommandResponse | ChatResponse;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  files?: FileAttachment[];
  commandResponse?: CommandResponse;
}

interface EnhancedAstroFloraChatProps {
  onCommand?: (action: string, parameters: any) => void;
}

export default function EnhancedAstroFloraChat({ onCommand }: EnhancedAstroFloraChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente científico. Puedes pedirme archivos de investigación con comandos simples como "driver pasame los pdb del análisis" o "muéstrame los blast de la proteína X".',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadFile = (file: FileAttachment) => {
    try {
      const blob = new Blob([atob(file.data)], { type: file.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/enhanced-astroflora-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: ApiResponse = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: 'bot',
        timestamp: new Date(),
        files: data.files,
        commandResponse: data.type === 'command' ? data : undefined
      };

      setMessages(prev => [...prev, botMessage]);

      // If it's a command response, notify parent component
      if (data.type === 'command' && onCommand) {
        onCommand(data.action, data.parameters);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, hubo un error procesando tu solicitud. Por favor intenta de nuevo.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex-shrink-0 ${isUser ? 'ml-2' : 'mr-2'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? 'bg-blue-500' : 'bg-gray-500'
            }`}>
              {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
          </div>
          
          <div className={`rounded-lg px-4 py-2 ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            
            {message.files && message.files.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs opacity-75 font-medium">
                  Archivos generados:
                </p>
                {message.files.map((file) => (
                  <div 
                    key={file.id} 
                    className={`flex items-center justify-between p-2 rounded border ${
                      isUser ? 'border-blue-300 bg-blue-400' : 'border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <FileDown className="w-4 h-4" />
                      <div>
                        <p className={`text-xs font-medium ${isUser ? 'text-blue-100' : 'text-gray-700'}`}>
                          {file.name}
                        </p>
                        <p className={`text-xs ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                          {file.type} • {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadFile(file)}
                      className={`p-1 rounded hover:opacity-80 transition-opacity ${
                        isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                      title="Descargar archivo"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {message.commandResponse && (
              <div className="mt-2 p-2 rounded border border-opacity-50">
                <p className="text-xs font-medium opacity-75">
                  Comando ejecutado: {message.commandResponse.action}
                </p>
                <p className={`text-xs mt-1 ${
                  message.commandResponse.status === 'success' ? 'text-green-600' : 
                  message.commandResponse.status === 'error' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  Estado: {message.commandResponse.status}
                </p>
              </div>
            )}
            
            <p className={`text-xs mt-2 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          AstroFlora Research Assistant
        </h3>
        <p className="text-sm text-gray-600">
          Comandos simples para obtener archivos de investigación
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(renderMessage)}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex max-w-[80%]">
              <div className="flex-shrink-0 mr-2">
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej: driver pasame los pdb del análisis..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        <div className="mt-2 text-xs text-gray-500">
          <p>Ejemplos de comandos:</p>
          <p>• "driver pasame los pdb del análisis"</p>
          <p>• "muéstrame los blast de proteína X"</p>
          <p>• "load pdb 1crn"</p>
        </div>
      </div>
    </div>
  );
}
