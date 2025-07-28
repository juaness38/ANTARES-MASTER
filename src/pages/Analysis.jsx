import ProtocolForm from "../features/protocols/ProtocolForm";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function Analysis() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 overflow-auto">
          <ProtocolForm />
        </main>
      </div>
    </div>
  );
}
