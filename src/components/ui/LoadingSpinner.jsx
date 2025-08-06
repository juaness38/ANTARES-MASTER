import { motion } from "framer-motion";

export default function LoadingSpinner({ message = "Cargando datos..." }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 scientific-font">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full mx-auto"
        ></motion.div>
        <p className="mt-4 text-primary/80">{message}</p>
      </div>
    </div>
  );
}
