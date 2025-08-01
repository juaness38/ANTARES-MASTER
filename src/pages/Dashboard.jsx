import DashboardHome from "../features/dashboard/DashboardHome";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useEffect, useState } from "react";
import useSidebarStore from "../store/sidebarStore";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);

  useEffect(() => {
    const handleLoad = () => {
      setLoading(false);
    };

    if (document.readyState === "complete") {
      setLoading(false);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  if (loading) return <LoadingSpinner message="Cargando elementos..." />;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header onSidebarToggle={toggleCollapsed} />
        <main className="p-6 overflow-auto">
          <DashboardHome />
        </main>
      </div>
    </div>
  );
}
