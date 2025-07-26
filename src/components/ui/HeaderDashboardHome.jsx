import { motion } from "framer-motion";
import { FiWifi, FiWifiOff } from "react-icons/fi";

export default function HeaderDashboardHome({ 
  title = "Panel de Control Ambiental", 
  isConnected = false, 
  activeTab = "today", 
  setActiveTab 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="flex items-center mt-1">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              isConnected ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          ></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isConnected ? (
              <>
                <FiWifi className="inline mr-1 text-emerald-500" />
                <span>Conectado • Actualización en tiempo real</span>
              </>
            ) : (
              <>
                <FiWifiOff className="inline mr-1 text-amber-500" />
                <span>Desconectado • Reconectando...</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex space-x-2 w-full sm:w-auto">
        <button
          onClick={() => setActiveTab("today")}
          className={`flex-1 sm:flex-none px-3 py-1 text-sm rounded-lg transition-all ${
            activeTab === "today"
              ? "bg-emerald-500 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          }`}
        >
          Hoy
        </button>
        <button
          onClick={() => setActiveTab("week")}
          className={`flex-1 sm:flex-none px-3 py-1 text-sm rounded-lg transition-all ${
            activeTab === "week"
              ? "bg-emerald-500 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          }`}
        >
          Semana
        </button>
      </div>
    </motion.div>
  );
}
