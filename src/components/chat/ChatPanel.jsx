import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle } from "lucide-react";

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { text: input.trim(), sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: `🌿 Astroflora responde: "${newMessage.text}"`, sender: "bot" },
      ]);
    }, 600);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-20 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg transition-all"
          title="Abrir chat"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full h-full lg:absolute lg:top-[69px] lg:right-0 lg:w-[420px] lg:h-[calc(100%-69px)] bg-white dark:bg-gray-950 z-50 flex flex-col border-t lg:border-t-0 border-gray-200 dark:border-gray-700 shadow-2xl">
          <div className="px-5 py-4 bg-gradient-to-r from-emerald-600/20 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/10 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white tracking-tight">
                🌱 Asistente Astroflora
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Estoy aquí para ayudarte
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-red-500 transition"
              title="Cerrar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 px-5 py-4 overflow-y-auto space-y-4 text-sm font-medium">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    relative max-w-[80%] px-4 py-2 rounded-2xl
                    ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
                    }
                    shadow-sm transition-all
                  `}
                >
                  {msg.text}
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
                className="absolute bottom-3 right-3 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 p-1 transition active:scale-95"
                title="Enviar"
              >
                <Send className="w-5 h-5" />
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
