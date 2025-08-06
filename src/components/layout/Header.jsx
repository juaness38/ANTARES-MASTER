import React, { useEffect, useState } from "react";
import { Bell, Sun, Moon, LayoutPanelLeft, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../../store/darkModeStore";

// Temporary: Removed Clerk imports for development

export default function Header({ onSidebarToggle, children }) {
  const isDarkMode = useDarkMode((state) => state.isDarkMode);
  const toggleDarkMode = useDarkMode((state) => state.toggleDarkMode);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 1024);

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isDarkMode]);

  return (
    <motion.header
      className="z-20 bg-card border-b border-border px-6 py-4 flex justify-between items-center scientific-shadow sticky top-0 scientific-font"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
    >
      <div className="flex items-center gap-4 w-full max-w-md">
        {isMobile && (
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground scientific-transition"
            aria-label="Toggle sidebar"
          >
            <LayoutPanelLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center space-x-4">{children}</div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground scientific-transition"
          aria-label="Toggle dark mode"
        >
          <AnimatePresence mode="wait">
            {isDarkMode ? (
              <motion.span
                key="moon"
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 30 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="sun"
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 30 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          className="p-2 mr-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground scientific-transition relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full border border-card"></span>
        </button>

        {/* Temporary: Simplified user section without Clerk */}
        <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground scientific-transition">
          <User className="w-5 h-5" />
        </button>
      </div>
    </motion.header>
  );
}
