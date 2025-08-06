import React from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// 🌟 IMPORTAR NUEVA ARQUITECTURA JARVIS
const AstrofloraDashboard = dynamic(() => import('../../components/dashboard/AstrofloraDashboard'), { ssr: false });

export default function Home() {
  return (
    <main className="jarvis-main h-screen bg-gray-900">
      {/* 🤖 ASTROFLORA DASHBOARD CON ARQUITECTURA JARVIS */}
      <Suspense fallback={
        <div className="loading-screen flex items-center justify-center h-screen bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">🌟 Cargando Astroflora</h2>
            <p className="text-gray-400">Inicializando Jarvis y componentes científicos...</p>
          </div>
        </div>
      }>
        <AstrofloraDashboard />
      </Suspense>
    </main>
  );
}
