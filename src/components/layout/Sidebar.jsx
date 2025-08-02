import React, { useEffect, useState } from "react";
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
import useSidebarStore from "../../store/sidebarStore";

const mainLinks = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutPanelLeft size={17} /> },
  { to: "/analysis", label: "Análisis", icon: <ChartColumn size={17} /> },
  {
    to: "/experiments",
    label: "Experimentos",
    icon: <FlaskConical size={17} />,
  },
  { to: "/monitoring", label: "Monitoreo", icon: <Activity size={17} /> },
];

const secondaryLinks = [
  { to: "/settings", label: "Configuración", icon: <Settings size={17} /> },
  {
    to: "/help",
    label: "Ayuda",
    icon: <MessageCircleQuestionMark size={17} />,
  },
];

export default function Sidebar() {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const userChanged = useSidebarStore((state) => state.userChanged);
  const setCollapsed = useSidebarStore((state) => state.setCollapsed);
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!userChanged && isMobile) {
      setCollapsed(true);
    }
  }, [userChanged, isMobile, setCollapsed]);

  return (
    <>
      {isMobile && !isCollapsed && (
        <div
          onClick={toggleCollapsed}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
        />
      )}

      {isMobile && (
        <div className="fixed top-4 left-4 z-30 hidden lg:block">
          <button
            onClick={toggleCollapsed}
            className="p-2 fixed top-4 left-4 z-30 bg-gray-100 dark:bg-gray-800 rounded-full shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <ChevronRight
              className={`w-5 h-5 transition-transform duration-300 ${
                !isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}

      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? (isMobile ? 0 : 84) : 260,
          opacity: isCollapsed && isMobile ? 0 : 1,
        }}
        transition={{ duration: 0.1 }}
        className={`fixed z-30 top-0 left-0 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl flex flex-col overflow-hidden transition-all duration-300 lg:static ${
          isCollapsed && isMobile ? "pointer-events-none" : ""
        }`}
      >
        <div className="p-5 pb-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
                transition={{ duration: 0.1 }}
              >
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 p-1 rounded-lg mr-3 shadow-lg">
                  <LayoutPanelLeft className="text-white text-lg" />
                </span>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text">
                  Astroflora
                </h2>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden lg:block">
            <button
              onClick={toggleCollapsed}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
              <ChevronRight
                className={`w-5 h-5 transition-transform duration-300 ${
                  !isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {mainLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    }`
                  }
                >
                  <span
                    className={`p-2 rounded-lg ${isCollapsed ? "" : "mr-3"} ${
                      isCollapsed
                        ? "bg-transparent"
                        : " dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium"
                    }`}
                  >
                    {link.icon}
                  </span>
                  {!isCollapsed && <span>{link.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-2 pb-4 px-2">
          <ul className="space-y-1">
            {secondaryLinks.map((link) => (
              <li key={link.to}>
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
                  <span
                    className={`p-2 rounded-lg ${isCollapsed ? "" : "mr-3"} ${
                      isCollapsed
                        ? "bg-transparent"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {link.icon}
                  </span>
                  {!isCollapsed && <span>{link.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </motion.aside>
    </>
  );
}
