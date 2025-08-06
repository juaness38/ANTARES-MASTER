import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jarvisClient } from "../../../lib/jarvis-client";

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [driverAIStatus, setDriverAIStatus] = useState('checking');
  const bottomRef = useRef(null);

  // Verificar disponibilidad del Driver AI usando el nuevo cliente
  const checkDriverAIStatus = async () => {
    try {
      console.log('🔍 Verificando estado de Driver AI con nuevo cliente...');
      
      const isHealthy = await jarvisClient.checkHealth();
      
      if (isHealthy) {
        console.log('✅ Driver AI disponible (nuevo cliente)');
        setDriverAIStatus('connected');
        return true;
      } else {
        console.warn('⚠️ Driver AI no disponible (nuevo cliente)');
        setDriverAIStatus('error');
        return false;
      }
    } catch (error) {
      console.error('❌ Error al conectar con Driver AI:', error.message);
      setDriverAIStatus('error');
      return false;
    }
  };

  // Función para detectar si un mensaje requiere análisis científico
  const isScientificQuery = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // 1. DETECTAR SECUENCIAS DE AMINOÁCIDOS (más estricto)
    const aminoAcidPattern = /^[ACDEFGHIKLMNPQRSTVWY]{10,}$/i;
    const cleanMessage = message.replace(/\s+/g, '');
    if (aminoAcidPattern.test(cleanMessage) && cleanMessage.length >= 10) {
      console.log('🧬 Secuencia de aminoácidos detectada');
      return true;
    }
    
    // 2. DETECTAR PALABRAS CLAVE CIENTÍFICAS ESPECÍFICAS (más estricto)
    const explicitScientificPhrases = [
      'haz un blast', 'hacer blast', 'analiza la secuencia', 'análisis blast',
      'secuencia de proteína', 'análisis molecular', 'estructura pdb',
      'blast search', 'protein analysis', 'molecular analysis'
    ];
    
    // Buscar frases completas primero
    const hasExplicitPhrase = explicitScientificPhrases.some(phrase => 
      lowerMessage.includes(phrase)
    );
    
    if (hasExplicitPhrase) {
      console.log('🔬 Consulta científica explícita detectada:', hasExplicitPhrase);
      return true;
    }
    
    // 3. PALABRAS CLAVE SOLO SI ESTÁN EN CONTEXTO CIENTÍFICO
    const scientificKeywords = ['blast', 'pdb', 'uniprot', 'genbank'];
    const hasScientificKeyword = scientificKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    // Solo considerar científico si tiene palabras clave MUY específicas
    if (hasScientificKeyword) {
      console.log('🔬 Palabra clave científica específica detectada');
      return true;
    }
    
    // 4. POR DEFECTO: ES CONVERSACIONAL
    console.log('💬 Consulta conversacional detectada');
    return false;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input.trim(), sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (driverAIStatus === 'connected') {
        console.log('🧠 Enviando a Driver AI con nuevo cliente:', userMessage.text);
        
        // ✨ USAR EL NUEVO CLIENTE BASADO EN OSCAR
        const driverResponse = await jarvisClient.process(userMessage.text);
        
        console.log('📥 Respuesta del Driver AI:', driverResponse);
        
        const aiMessage = {
          text: driverResponse.message,
          sender: "bot",
          timestamp: new Date(),
          confidence: driverResponse.confidence,
          commands: driverResponse.commands,
          data: driverResponse.data,
          suggestions: driverResponse.suggestions,
          intention: driverResponse.intention,
          source: 'driver-ai'
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        
        // Ejecutar comandos si los hay
        if (driverResponse.commands && driverResponse.commands.length > 0) {
          console.log('⚡ Ejecutando comandos automáticos:', driverResponse.commands);
          await jarvisClient.executeCommands(driverResponse.commands);
        }
      } else {
        // Sin Driver AI, respuesta simple
        setMessages((prev) => [...prev, { 
          text: `🌿 Astroflora responde: "${userMessage.text}"`, 
          sender: "bot",
          timestamp: new Date(),
          source: 'simple'
        }]);
      }
    } catch (error) {
      console.error('❌ Error en handleSend:', error);
      setMessages((prev) => [...prev, { 
        text: `🚨 Error al procesar mensaje: ${error.message}`, 
        sender: "bot",
        timestamp: new Date(),
        source: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Verificar Driver AI al montar el componente
  useEffect(() => {
    checkDriverAIStatus();
    
    // Verificar cada 30 segundos si está desconectado
    const interval = setInterval(() => {
      if (driverAIStatus !== 'connected') {
        checkDriverAIStatus();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [driverAIStatus]);

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-36 right-20 z-50 flex flex-col items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative px-5 py-2.5 bg-white/70 dark:bg-gray-900/70 text-sm font-semibold text-gray-800 dark:text-white rounded-xl shadow-xl border border-emerald-400/30 backdrop-blur-xl ring-1 ring-white/10"
          >
            <span className="text-emerald-500">Asistente</span> Astroflora
            <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-3 h-3 bg-inherit rotate-45 border border-emerald-400/30 shadow-sm z-[-1]" />
          </motion.div>

          <motion.button
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="relative group p-5 rounded-full bg-gradient-to-br from-emerald-600 via-teal-500 to-green-400 text-white shadow-[0_10px_30px_-5px_rgba(16,185,129,0.5)] border border-emerald-800/40 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300/50 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
            title="Abrir chat"
          >
            <MessageCircle className="w-6 h-6 drop-shadow" />

            <span className="absolute -inset-0.5 rounded-full bg-emerald-500/30 blur-xl opacity-70 group-hover:opacity-90 transition-opacity duration-700 animate-pulse pointer-events-none" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full shadow-md animate-ping opacity-80" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full" />
          </motion.button>
        </div>
      )}

      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full h-full lg:absolute lg:top-[69px] lg:right-0 lg:w-[420px] lg:h-[calc(100%-69px)] bg-white dark:bg-gray-950 z-50 flex flex-col border-t lg:border-t-0 border-gray-200 dark:border-gray-700 shadow-2xl">
          <div
            className="px-6 py-3 bg-gradient-to-r from-emerald-700/30 via-teal-600/20 to-emerald-500/15
             dark:from-emerald-600/40 dark:via-teal-500/30 dark:to-teal-400/15
             border-b border-gray-300 dark:border-gray-700
             flex items-center justify-between shadow-lg backdrop-blur-lg
             animate-fadeInUp select-none"
          >
            <div>
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-gray-900 dark:text-white tracking-wide drop-shadow-md">
                <span
                  aria-hidden="true"
                  className="text-xl animate-pulse text-emerald-400 drop-shadow-lg"
                >
                  {driverAIStatus === 'connected' ? '🧠' : '🌱'}
                </span>
                {driverAIStatus === 'connected' ? 'Driver AI' : 'Asistente'} <span className="text-emerald-400">Astroflora</span>
              </h2>
              <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300 opacity-90">
                {driverAIStatus === 'connected' ? 'Sistema inteligente conectado' : 
                 driverAIStatus === 'checking' ? 'Verificando conexión...' : 'Modo básico disponible'}
                {isLoading && ' • Procesando...'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="group relative flex items-center justify-center p-3 rounded-full
               text-gray-600 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500
               focus:ring-offset-2 focus:ring-offset-transparent
               transition-shadow duration-400 shadow-md hover:shadow-2xl
               active:scale-95 active:shadow-inner
               before:absolute before:inset-0 before:rounded-full before:bg-red-500 before:opacity-0
               before:transition before:duration-500 before:group-hover:opacity-20"
              aria-label="Cerrar chat"
              title="Cerrar chat"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500 ease-in-out" />
            </button>

            <style jsx>{`
              @keyframes fadeInUp {
                0% {
                  opacity: 0;
                  transform: translateY(10px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-fadeInUp {
                animation: fadeInUp 0.5s ease forwards;
              }
            `}</style>
          </div>

          <div className="flex-1 px-6 py-5 overflow-y-auto space-y-5 text-sm font-sans">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
          relative max-w-[75%] px-5 py-3 rounded-2xl select-text
          shadow-md transition-shadow duration-300 ease-in-out
          ${
            msg.sender === "user"
              ? "bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-br-none shadow-lg shadow-emerald-500/40"
              : "bg-white dark:bg-gray-800 dark:backdrop-blur-sm text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-default"
          }
        `}
                  style={{ fontSize: "0.875rem", lineHeight: "1.35rem" }} // 14px font size, comfy line height
                >
                  <p className="break-words font-normal tracking-normal">
                    {msg.text}
                  </p>
                  {msg.sender === "bot" && (
                    <div className="absolute bottom-[-6px] left-5 w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner" />
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
            <div className="relative">
              <textarea
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Escribe un mensaje..."
                className="w-full resize-none pr-12 pl-4 py-3 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className={`absolute bottom-3 right-3 p-1 transition active:scale-95 ${
                  isLoading 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
                }`}
                title={isLoading ? "Procesando..." : "Enviar"}
              >
                {isLoading ? <Brain className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-600">
              Pulsa{" "}
              <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                Enter
              </kbd>{" "}
              para enviar. <kbd>Shift</kbd> + <kbd>Enter</kbd> para nueva línea.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
