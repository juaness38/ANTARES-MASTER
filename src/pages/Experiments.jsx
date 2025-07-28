import SensorMonitor from "../features/sensors/SensorMonitor";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function Experiments() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 overflow-auto">
          <SensorMonitor />
        </main>
      </div>
    </div>
  );
}
