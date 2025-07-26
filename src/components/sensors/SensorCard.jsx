import { motion } from "framer-motion";
import AlertBadge from "../ui/AlertBadge"; // Ajusta el path si estás en otra carpeta

export default function SensorCard({
  title,
  value,
  unit = "",
  icon,
  location,
  type,
  statusFn,
  getStatusColorFn
}) {
  const status = statusFn(type, value);

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 relative transition-all"
    >
      <div className="flex justify-between items-start">
        <div className="w-[calc(100%-24px)]">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <p className="text-xl sm:text-2xl font-bold mt-1">
            {value}{unit}
          </p>
        </div>
        <div className={`w-3 h-3 rounded-full ${getStatusColorFn(status.status)}`} />
      </div>
      
      <div className="flex items-center mt-3">
        {icon && <span className="mr-1 sm:mr-2">{icon}</span>}
        <span className="text-xs">{location}</span>
      </div>

      {status.status !== "normal" && (
        <AlertBadge 
          status={status.status}
          message={status.message}
        />
      )}
    </motion.div>
  );
}
