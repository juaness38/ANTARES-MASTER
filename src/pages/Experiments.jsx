import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ChatPanel from "../components/chat/ChatPanel";
import { useState } from "react";
import useSidebarStore from "../store/sidebarStore";
import { Plus, Share2, Download, ChevronDown } from "lucide-react";
import PrimaryButton from "../components/ui/PrimaryButton";
import Modal from "../features/experiments/Modal";
import PipelineEditor from "../components/Pipeline/PipelineEditor";

export default function Experiments() {
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);
  const [openModal, setOpenModal] = useState(false);
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header onSidebarToggle={toggleCollapsed}>
          <div className="flex items-center gap-3 sm:gap-4">
            <PrimaryButton onClick={() => setOpenModal(true)}>
              Nuevo
            </PrimaryButton>
          </div>
        </Header>
        <Modal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          title="Nuevo experimento"
        >
          {/* Formulario básico */}
          <form className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Nombre del experimento
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Ej: Fotosíntesis en plantas"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Descripción
              </label>
              <textarea
                className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Detalles del experimento..."
                rows={4}
              />
            </div>

            <aside className="w-64 p-4 bg-slate-100">
              <div onDragStart={(e) => onDragStart(e, "blast")} draggable>
                🔍 Análisis BLAST
              </div>
              <div onDragStart={(e) => onDragStart(e, "prediccion")} draggable>
                🧠 Predicción de Estructura
              </div>
              <div onDragStart={(e) => onDragStart(e, "anotacion")} draggable>
                🧬 Anotación Proteica
              </div>
            </aside>
          </form>
        </Modal>
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 transition-all duration-300">
          <h1 className="text-2xl font-semibold mb-4">
            Página de experimentos
          </h1>
        </main>
        <ChatPanel />
      </div>
    </div>
  );
}
