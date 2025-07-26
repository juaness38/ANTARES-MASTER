// src/components/AlertBadge.jsx
import { motion } from "framer-motion";

export default function AlertBadge({ status, message }) {
  const isDanger = status === "danger";

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        absolute bottom-3 right-3 
        text-xs font-medium
        px-2.5 py-1 rounded-full
        flex items-center
        shadow-sm
        ${isDanger 
          ? 'bg-red-500/10 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-700' 
          : 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
        }
      `}
    >
      <span className="relative flex h-2 w-2 mr-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
          isDanger ? 'bg-red-400' : 'bg-amber-400'
        } opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${
          isDanger ? 'bg-red-500' : 'bg-amber-500'
        }`}></span>
      </span>
      {message}
    </motion.div>
  );
}
