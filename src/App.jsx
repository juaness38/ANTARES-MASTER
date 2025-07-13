import AppRouter from './routes/AppRouter'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'

function App() {

  const fetchUser = useAuthStore(state => state.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <AppRouter />
    </div>
  )
}

export default App