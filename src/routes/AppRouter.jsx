import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Protocols from '../pages/Protocols'
import Sensors from '../pages/Sensors'
import Events from '../pages/Events'
import PrivateRoute from './PrivateRoute'

export default function AppRouter() {
  const isAuthenticated = !!localStorage.getItem('token') // muy básico, puedes mejorarlo con Zustand

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={<PrivateRoute> <Dashboard /> </PrivateRoute>}
      />
      <Route
        path="/protocols"
        element={isAuthenticated ? <Protocols /> : <Navigate to="/login" />}
      />
      <Route
        path="/sensors"
        element={isAuthenticated ? <Sensors /> : <Navigate to="/login" />}
      />
      <Route
        path="/events"
        element={isAuthenticated ? <Events /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
