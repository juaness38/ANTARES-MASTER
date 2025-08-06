import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Analysis from "../pages/Analysis";
import Experiments from "../pages/Experiments";
import Monitoring from "../pages/Monitoring";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/experiments" element={<Experiments />} />
      <Route path="/monitoring" element={<Monitoring />} />
    </Routes>
  );
}
