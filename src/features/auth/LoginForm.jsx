import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/authService'
import useAuthStore from '../../store/authStore'
import { FiLock, FiUser, FiLoader } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const setToken = useAuthStore(state => state.setToken)
  const fetchUser = useAuthStore(state => state.fetchUser)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const token = await login(username, password)
      setToken(token)
      await fetchUser()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError('Credenciales inválidas o error de red')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen min-w-sm md:min-w-md flex items-center justify-center bg-gradient-to-br p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Bienvenido a Astroflora
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Inicia sesión para continuar
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 dark:bg-red-800/60 text-red-700 dark:text-red-200 px-4 py-2 mb-4 rounded-md border border-red-300 dark:border-red-600 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Usuario
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-800 dark:text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-800 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex justify-center items-center py-2 px-4 rounded-lg text-white font-semibold transition-all
              ${loading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'}
            `}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin mr-2" /> Entrando...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </motion.button>

          <p
            className="text-center mt-4 text-sm text-emerald-600 dark:text-emerald-300 hover:underline cursor-pointer"
            onClick={() => navigate('/register')}
          >
            ¿No tienes cuenta? <span className="font-semibold">Regístrate</span>
          </p>
        </form>
      </motion.div>
    </div>
  )
}