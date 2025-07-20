import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Protocols from '../pages/Protocols'
import Sensors from '../pages/Sensors'
import Events from '../pages/Events'
import PrivateRoute from './PrivateRoute'

export default function AppRouter() {
  const isAuthenticated = !!localStorage.getItem('token')

  return (
    
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/protocols" element={<Protocols />} />
      <Route path="/sensors" element={<Sensors />} />
      <Route path="/events" element={<Events />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
