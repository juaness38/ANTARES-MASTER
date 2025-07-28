import { WifiOff } from "lucide-react";

export default function ConnectionError({ isConnected = false, onRetry }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-lg max-w-md w-full">
        <p className="font-bold">Error de conexión</p>
        <p className="mt-1">No se pudo conectar al servidor WebSocket</p>
        <div className="flex items-center mt-3 text-sm">
          <WifiOff className="mr-2" />
          <span>Estado: {isConnected ? "Conectado" : "Desconectado"}</span>
        </div>
        <button
          onClick={onRetry || (() => window.location.reload())}
          className="mt-4 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Reintentar conexión
        </button>
      </div>
    </div>
  );
}
