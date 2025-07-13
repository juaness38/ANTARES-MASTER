import { create } from 'zustand'
import { getMe } from '../services/authService'

const useAuthStore = create((set) => ({
  // Estado inicial
  token: localStorage.getItem('token') || null,
  user: null,

  // Guardar token
  setToken: (token) => {
    localStorage.setItem('token', token)
    set({ token })
  },

  // Guardar datos del usuario (opcional, si los devuelves en el login)
  setUser: (user) => set({ user }),

  fetchUser: async () => {
    try {
      const data = await getMe()
      set({ user: data.username })
    } catch {
      set({ user: null })
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => !!localStorage.getItem('token')
}))

export default useAuthStore
