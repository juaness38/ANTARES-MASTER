import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function Analysis() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 overflow-auto">
          <h1>Página de análisis</h1>
        </main>
      </div>
    </div>
  );
}
