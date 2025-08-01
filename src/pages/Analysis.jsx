import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import useSidebarStore from "../store/sidebarStore";

export default function Analysis() {
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header onSidebarToggle={toggleCollapsed} />
        <main className="p-6 overflow-auto">
          <h1>Página de análisis</h1>
        </main>
      </div>
    </div>
  );
}
