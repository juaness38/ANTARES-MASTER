import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ChatPanel from "../components/chat/ChatPanel";
import { useState } from "react";
import useSidebarStore from "../store/sidebarStore";
import { Plus, Share2, Download, ChevronDown } from "lucide-react";
import PrimaryButton from "../components/ui/PrimaryButton";

export default function Experiments() {
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header onSidebarToggle={toggleCollapsed}>
          <div className="flex items-center gap-3 sm:gap-4">
            <PrimaryButton onClick={() => alert("Nuevo clicked")}>
              Nuevo
            </PrimaryButton>
          </div>
        </Header>
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
