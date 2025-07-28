import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  ChartColumn,
  FlaskConical,
  Activity,
  LayoutPanelLeft,
  ChevronRight,
  Settings,
  MessageCircleQuestionMark,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mainLinks = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutPanelLeft size="17" /> },
  { to: "/protocols", label: "Análisis", icon: <ChartColumn size="17" /> },
  { to: "/sensors", label: "Experimentos", icon: <FlaskConical size="17" /> },
  { to: "/events", label: "Monitoreo", icon: <Activity size="17" /> },
];

const secondaryLinks = [
  { to: "/settings", label: "Configuración", icon: <Settings size="17" /> },
  {
    to: "/help",
    label: "Ayuda",
    icon: <MessageCircleQuestionMark size="17" />,
  },
];

export default function Sidebar() {
  const [activeHover, setActiveHover] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.aside
      className={`h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-r border-gray-200 dark:border-gray-800 shadow-xl flex flex-col ${
        isCollapsed ? "w-20" : "w-80"
      }`}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo y toggle */}
      <div className="p-5 pb-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-lg mr-3 shadow-lg">
                <LayoutPanelLeft className="text-white text-lg" />
              </span>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text">
                Astroflora
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5 transform rotate-180" />
          )}
        </button>
      </div>

      {/* Menú principal */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {mainLinks.map((link) => (
            <motion.li
              key={link.to}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <NavLink
                to={link.to}
                onMouseEnter={() => setActiveHover(link.to)}
                onMouseLeave={() => setActiveHover(null)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`p-2 rounded-lg ${
                        isActive
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {link.icon}
                    </span>

                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          className="ml-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {link.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {activeHover === link.to && !isCollapsed && (
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </AnimatePresence>

                    {isActive && !isCollapsed && (
                      <motion.span
                        className="absolute right-4 w-2 h-2 bg-emerald-500 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Menú secundario */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-2 pb-4 px-2">
        <ul className="space-y-1">
          {secondaryLinks.map((link) => (
            <motion.li
              key={link.to}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`p-2 rounded-lg ${
                        isActive
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {link.icon}
                    </span>

                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          className="ml-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                        >
                          {link.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.aside>
  );
}
