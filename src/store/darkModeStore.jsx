import { create } from 'zustand'

export const useDarkMode = create((set) => {
  // Leer del localStorage
  const savedMode = localStorage.getItem('theme') === 'dark'

  if (savedMode) {
    document.documentElement.classList.add('dark')
  }

  return {
    isDarkMode: savedMode,
    toggleDarkMode: () =>
      set((state) => {
        const newMode = !state.isDarkMode

        // Aplica clase al DOM
        if (newMode) {
          document.documentElement.classList.add('dark')
          localStorage.setItem('theme', 'dark')
        } else {
          document.documentElement.classList.remove('dark')
          localStorage.setItem('theme', 'light')
        }

        return { isDarkMode: newMode }
      }),
  }
})
