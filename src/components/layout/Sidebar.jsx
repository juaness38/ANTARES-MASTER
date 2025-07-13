import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore'
import { NavLink, useLocation } from 'react-router-dom';
import { FiGrid, FiFileText, FiHardDrive, FiCalendar, FiChevronRight, FiSettings, FiHelpCircle, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const mainLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/protocols', label: 'Protocolos', icon: <FiFileText /> },
  { to: '/sensors', label: 'Sensores', icon: <FiHardDrive /> },
  { to: '/events', label: 'Eventos', icon: <FiCalendar /> },
]

const secondaryLinks = [
  { to: '/settings', label: 'Configuración', icon: <FiSettings /> },
  { to: '/help', label: 'Ayuda', icon: <FiHelpCircle /> },
]

export default function Sidebar() {
  const { user, fetchUser } = useAuthStore()
  const logout = useAuthStore(state => state.logout)
  const location = useLocation();
  const [activeHover, setActiveHover] = useState(null); // Elimina la anotación de tipo
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Efecto para cerrar el sidebar en móviles
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <motion.aside 
      className={`h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-r border-gray-200 dark:border-gray-800 shadow-xl flex flex-col ${isCollapsed ? 'w-20' : 'w-80'}`}
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
                <FiGrid className="text-white text-lg" />
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
            <FiChevronRight className="w-5 h-5" />
          ) : (
            <FiChevronRight className="w-5 h-5 transform rotate-180" />
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
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`p-2 rounded-lg ${isActive ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
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
                        transition={{ type: 'spring', stiffness: 500 }}
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
                      ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`p-2 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
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

      {/* Perfil usuario */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold shadow-lg">
              {user?.charAt(0)?.toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900"></span>
          </div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                className="ml-3 overflow-hidden"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{user}</p>
                {/*<p className="text-xs text-gray-500 dark:text-gray-400">Usuario</p>*/}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center px-4 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ x: 2 }}
            >
              <FiLogOut className="mr-2" />
              Cerrar sesión
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}