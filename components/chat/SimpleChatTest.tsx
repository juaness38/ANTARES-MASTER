/**
 * 🧪 CHAT DE PRUEBA SIMPLE
 * Versión minimalista para debugging
 */

'use client';

import React, { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function SimpleChatTest() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '🤖 Hola! Soy un chat de prueba simple. Envía un mensaje para testear.'
    }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    const botReply: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Echo: ${input.trim()}`
    };

    setMessages(prev => [...prev, userMessage, botReply]);
    setInput('');
  };

  return (
    <div 
      className="simple-chat-test h-full bg-gray-900 text-white flex flex-col"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">🧪 Chat de Prueba Simple</h2>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 p-4 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-sm px-4 py-2 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje de prueba..."
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            onClick={(e) => e.stopPropagation()}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
