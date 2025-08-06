import { motion } from "framer-motion";

export default function FullPageLoader({ message = "Cargando datos..." }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm scientific-font">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full mx-auto"
        ></motion.div>
        <p className="mt-10 text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
