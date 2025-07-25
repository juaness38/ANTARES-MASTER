import { FiBell, FiSearch, FiSun, FiMoon } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useDarkMode } from '../../store/darkModeStore'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";

export default function Header() {

  const isDarkMode = useDarkMode(state => state.isDarkMode)
  const toggleDarkMode = useDarkMode(state => state.toggleDarkMode)

  useEffect(() => {
    const root = window.document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <motion.header
      className="bg-white dark:bg-gray-900 px-6 py-4 flex justify-between items-center shadow-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, type: 'spring' }}
    >
      {/* Search Bar */}
      <div className="relative w-1/3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border-transparent focus:border-gray-300 dark:focus:border-gray-600 focus:ring-0 text-sm transition-all duration-200"
          placeholder="Buscar..."
        />
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
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
                <FiMoon className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="sun"
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 30 }}
                transition={{ duration: 0.2 }}
              >
                <FiSun className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 relative">
          <FiBell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
        </button>

        <SignedIn>
          <div className="relative inline-block">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10 rounded-full ring-2 ring-emerald-500 dark:ring-emerald-400 shadow-md",
                  userButtonTrigger: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400",
                },
              }}
            />
          </div>
        </SignedIn>

      </div>
    </motion.header>
  )
}
