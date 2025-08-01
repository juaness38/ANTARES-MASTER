import React, { useEffect, useState } from "react";
import { Bell, Sun, Moon, LayoutPanelLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../../store/darkModeStore";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

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
      className="z-30 bg-white dark:bg-gray-900 px-6 py-4 flex justify-between items-center shadow-md sticky top-0"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
    >
      <div className="flex items-center gap-4 w-full max-w-md">
        {isMobile && (
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
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
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
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
          className="p-2 mr-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
        </button>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "w-10 h-10 rounded-full ring-2 ring-emerald-500 dark:ring-emerald-400 shadow-md",
                userButtonTrigger:
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400",
              },
            }}
          />
        </SignedIn>

        <SignedOut>
          <SignInButton>
            <button className="text-gray-600 dark:text-gray-300 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              Iniciar sesión
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="ml-2 text-gray-600 dark:text-gray-300 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              Registrarse
            </button>
          </SignUpButton>
        </SignedOut>
      </div>
    </motion.header>
  );
}
