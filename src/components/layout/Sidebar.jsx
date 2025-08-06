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
            className="p-2 fixed top-4 left-4 z-30 bg-muted rounded-lg scientific-shadow text-foreground hover:bg-muted/80 scientific-transition"
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
        className={`fixed z-30 top-0 left-0 min-h-screen bg-card border-r border-border scientific-shadow flex flex-col overflow-hidden scientific-transition scientific-font lg:static ${
          isCollapsed && isMobile ? "pointer-events-none" : ""
        }`}
      >
        <div className="p-5 pb-3 flex justify-between items-center border-b border-border">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
                transition={{ duration: 0.1 }}
              >
                <span className="bg-gradient-to-r from-primary to-primary/80 p-1 rounded-lg mr-3 scientific-shadow">
                  <LayoutPanelLeft className="text-primary-foreground text-lg" />
                </span>
                <h2 className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
                  ANTARES
                </h2>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden lg:block">
            <button
              onClick={toggleCollapsed}
              className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 scientific-transition"
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
                    `flex items-center px-4 py-3 rounded-xl scientific-transition ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <span
                    className={`p-2 rounded-lg ${isCollapsed ? "" : "mr-3"} ${
                      isCollapsed
                        ? "bg-transparent"
                        : "bg-primary/10 text-primary font-medium"
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

        <div className="border-t border-border pt-2 pb-4 px-2">
          <ul className="space-y-1">
            {secondaryLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-xl scientific-transition ${
                      isActive
                        ? "bg-secondary/50 text-secondary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <span
                    className={`p-2 rounded-lg ${isCollapsed ? "" : "mr-3"} ${
                      isCollapsed
                        ? "bg-transparent"
                        : "bg-muted text-muted-foreground"
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
