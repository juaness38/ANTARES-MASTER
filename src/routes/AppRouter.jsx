import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Protocols from '../pages/Protocols';
import Sensors from '../pages/Sensors';
import Events from '../pages/Events';
import SignInPage from '../pages/SignIn';
import SignUpPage from '../pages/SignUpPage';
import ProtectedRoute from '../routes/ProtectedRoute';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<SignInPage routing="path" path="/sign-in" />} />
      <Route path="/sign-up/*" element={<SignUpPage routing="path" path="/sign-up" />} />

      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/protocols"
        element={
          <ProtectedRoute>
            <Protocols />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sensors"
        element={
          <ProtectedRoute>
            <Sensors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/sign-in" />} />
    </Routes>
  );
}
