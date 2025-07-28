import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Analysis from "../pages/Analysis";
import Experiments from "../pages/Experiments";
import Monitoring from "../pages/Monitoring";
import SignInPage from "../pages/SignIn";
import SignUpPage from "../pages/SignUpPage";
import ProtectedRoute from "../routes/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/sign-in/*"
        element={<SignInPage routing="path" path="/sign-in" />}
      />
      <Route
        path="/sign-up/*"
        element={<SignUpPage routing="path" path="/sign-up" />}
      />

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
        path="/analysis"
        element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/experiments"
        element={
          <ProtectedRoute>
            <Experiments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitoring"
        element={
          <ProtectedRoute>
            <Monitoring />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/sign-in" />} />
    </Routes>
  );
}
