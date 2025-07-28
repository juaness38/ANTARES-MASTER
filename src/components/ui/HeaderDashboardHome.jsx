import { motion } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";

export default function HeaderDashboardHome({
  title = "Astroflora Antares - Control Central",
  isConnected = false,
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
              isConnected ? "bg-emerald-500" : "bg-amber-500"
            }`}
          ></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isConnected ? (
              <>
                <Wifi size="17" className="inline mr-1 text-emerald-500" />
                <span>Conectado • Actualización en tiempo real</span>
              </>
            ) : (
              <>
                <WifiOff size="17" className="inline mr-1 text-amber-500" />
                <span>Desconectado • Reconectando...</span>
              </>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
