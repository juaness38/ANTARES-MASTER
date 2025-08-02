import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PipelineEditor from "../../components/Pipeline/PipelineEditor";

export default function Modal({ isOpen, onClose, title, onSubmit }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-[95vw] h-[95vh] bg-white dark:bg-gray-950 rounded-lg shadow-[0_8px_40px_rgba(0,0,0,0.2)] flex flex-col ring-1 ring-gray-200 dark:ring-gray-800"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 rounded-t-3xl flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 flex-grow overflow-hidden min-h-0">
              {/* Contenedor que toma todo el espacio posible */}
              <div className="w-full h-full min-h-0 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
                <PipelineEditor />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-b-3xl flex-shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-sm"
              >
                Cancelar
              </button>
              <button
                onClick={onSubmit || onClose}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md transition"
              >
                Aceptar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
