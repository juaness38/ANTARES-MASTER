import DashboardHome from "../features/dashboard/DashboardHome";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useEffect, useState } from "react";
import useSidebarStore from "../store/sidebarStore";
import { Search } from "lucide-react";

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
        <Header onSidebarToggle={toggleCollapsed}>
          <div className="relative flex-1 hidden lg:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              id="searchGlobal"
              className="block w-full pl-10 pr-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border-transparent focus:border-gray-300 dark:focus:border-gray-600 focus:ring-0 text-sm transition-all duration-200"
              placeholder="Buscar..."
            />
          </div>
        </Header>
        <main className="flex-1 bg-background p-0 transition-all duration-300 scientific-font">
          <DashboardHome />
        </main>
      </div>
    </div>
  );
}
