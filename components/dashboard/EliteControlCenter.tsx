'use client';

import React, { useState, useCallback, useRef } from 'react';
import MolecularViewer from '../visualization/MolecularViewer';
import PhylogeneticTree from '../visualization/PhylogeneticTree';
import RealTimeMonitor from '../monitoring/RealTimeMonitor';
import AstroFloraChat from '../chat/AstroFloraChat';

interface EliteControlCenterProps {
  className?: string;
}

export default function EliteControlCenter({ className = "" }: EliteControlCenterProps) {
  const [chatWidth, setChatWidth] = useState(350); // Reducido de 400 a 350
  const [isResizing, setIsResizing] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true); // Toggle para el chat
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = containerRect.right - e.clientX;
    
    // Límites: mínimo 280px, máximo 60% del contenedor (reducido)
    const minWidth = 280;
    const maxWidth = containerRect.width * 0.6;
    
    setChatWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 ${
        isChatVisible ? 'flex' : 'block'
      } ${className}`}
    >
      {/* Panel Principal de Herramientas Científicas */}
      <div 
        className={`${isChatVisible ? 'flex-1' : 'w-full'} p-6 overflow-auto`}
      >
        {/* Header Elite */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🌌</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Astroflora Elite Command Center
                </h1>
                <p className="text-gray-400">Advanced Scientific Research Platform</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {/* Toggle Chat Button */}
              <button
                onClick={() => setIsChatVisible(!isChatVisible)}
                className="px-4 py-2 bg-blue-500/20 rounded-xl text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-colors flex items-center space-x-2"
              >
                <span className="text-sm font-medium">
                  {isChatVisible ? '🗨️ Ocultar Chat' : '🗨️ Mostrar Chat'}
                </span>
              </button>
              <div className="px-4 py-2 bg-green-500/20 rounded-xl text-green-300 border border-green-500/30 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Online</span>
              </div>
              <div className="px-4 py-2 bg-purple-500/20 rounded-xl text-purple-300 border border-purple-500/30">
                <span className="text-sm font-medium">Elite Mode</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monitor en Tiempo Real */}
        <div className="mb-6">
          <RealTimeMonitor />
        </div>

        {/* Grid de Visualizaciones Científicas */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Visualizador Molecular */}
          <MolecularViewer />
          
          {/* Árbol Filogenético */}
          <PhylogeneticTree />
        </div>

        {/* Panel de Control Avanzado */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          {/* Métricas de Investigación */}
          <div className="bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-pink-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-100">Investigación</h3>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Experimentos Activos</span>
                <span className="text-purple-400 font-bold">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Muestras Analizadas</span>
                <span className="text-purple-400 font-bold">1,284</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Éxito Rate</span>
                <span className="text-green-400 font-bold">94.7%</span>
              </div>
            </div>
          </div>

          {/* Estado del Laboratorio */}
          <div className="bg-gradient-to-br from-gray-900/90 via-cyan-900/20 to-blue-900/30 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cyan-100">Laboratorio</h3>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Temperatura</span>
                <span className="text-cyan-400 font-bold">22.5°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Humedad</span>
                <span className="text-cyan-400 font-bold">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Presión</span>
                <span className="text-cyan-400 font-bold">1.01 atm</span>
              </div>
            </div>
          </div>

          {/* AI & Machine Learning */}
          <div className="bg-gradient-to-br from-gray-900/90 via-green-900/20 to-emerald-900/30 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-100">AI Engine</h3>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Modelos Activos</span>
                <span className="text-green-400 font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Predicciones/h</span>
                <span className="text-green-400 font-bold">2,847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Precisión</span>
                <span className="text-green-400 font-bold">97.2%</span>
              </div>
            </div>
          </div>

          {/* Conectividad Global */}
          <div className="bg-gradient-to-br from-gray-900/90 via-orange-900/20 to-red-900/30 backdrop-blur-xl rounded-2xl border border-orange-500/30 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-100">Red Global</h3>
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Nodos Conectados</span>
                <span className="text-orange-400 font-bold">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Datos Sincronizados</span>
                <span className="text-orange-400 font-bold">99.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Latencia Promedio</span>
                <span className="text-green-400 font-bold">12ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Elite */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-4 bg-black/30 rounded-2xl px-6 py-3 border border-gray-700/50">
            <span className="text-sm text-gray-400">Astroflora Elite Platform</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Version 7.1</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-400">© 2025 Scientific Excellence</span>
          </div>
        </div>
      </div>

      {/* Divisor Redimensionable - Solo visible si el chat está activo */}
      {isChatVisible && (
        <div 
          className={`w-1 bg-gray-600/50 cursor-col-resize hover:bg-blue-500/50 transition-colors relative group ${
            isResizing ? 'bg-blue-500' : ''
          }`}
          onMouseDown={handleMouseDown}
        >
          {/* Indicador visual del divisor */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-8 bg-gray-400/30 group-hover:bg-blue-400/50 rounded-full transition-colors"></div>
          </div>
        </div>
      )}

      {/* Panel del Chat AstroFlora (lado derecho) - Solo visible si está activo */}
      {isChatVisible && (
        <div 
          className="bg-gray-900/50 border-l border-gray-700/50 overflow-hidden"
          style={{ width: `${chatWidth}px` }}
        >
          <div className="h-full">
            <AstroFloraChat />
          </div>
        </div>
      )}
    </div>
  );
}
