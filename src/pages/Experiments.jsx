import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ChatPanel from "../components/chat/ChatPanel";

export default function Experiments() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 relative">
        <Header />
        <main className="flex-1 overflow-auto p-6 pr-[420px]">
          <h1 className="text-2xl font-bold mb-4">Página de experimentos</h1>
        </main>
        <ChatPanel />
      </div>
    </div>
  );
}
