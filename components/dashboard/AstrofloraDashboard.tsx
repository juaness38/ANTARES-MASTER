/**
 * 🌟 ASTROFLORA SCIENTIFIC DASHBOARD
 * Dashboard principal con arquitectura Jarvis integrada
 * Coordina chat inteligente + visualizaciones reactivas
 */

'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  useMolecularState, 
  useExperimentState, 
  useDriverAIState,
  useMolecularActions,
  useExperimentActions 
} from '../../lib/astroflora-store';

// 🔄 Componentes dinámicos para mejor rendimiento
const JarvisChat = dynamic(() => import('../chat/JarvisChat'), { ssr: false });
const MolstarViewerConnected = dynamic(() => import('../visualization/MolstarViewerConnected'), { ssr: false });

type ViewMode = 'overview' | 'molecular' | 'experiments' | 'chat' | 'settings';

export default function AstrofloraDashboard() {
  const [activeView, setActiveView] = useState<ViewMode>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 🎯 CONECTAR AL ESTADO GLOBAL
  const { currentPdbId, viewerMode, isLoading } = useMolecularState();
  const { activeExperiment, runningExperiments } = useExperimentState();
  const { isOnline, processingCommand } = useDriverAIState();
  const { loadPDB } = useMolecularActions();
  const { createExperiment } = useExperimentActions();

  // 🔄 Efectos de inicialización
  useEffect(() => {
    console.log('🌟 Astroflora Dashboard initialized');
    console.log('📊 Current state:', {
      molecular: { currentPdbId, viewerMode, isLoading },
      experiments: { activeExperiment, runningCount: runningExperiments.length },
      jarvis: { isOnline, processingCommand }
    });
  }, []); // Solo ejecutar una vez al montar

  /**
   * 🧪 CREAR EXPERIMENTO RÁPIDO
   */
  const createQuickExperiment = () => {
    const experiment = {
      name: `Experimento ${Date.now()}`,
      type: 'protein_analysis' as const,
      description: 'Análisis automático de proteína',
      parameters: {
        sequence: currentPdbId || 'UNKNOWN',
        analysis_type: 'structure'
      }
    };
    createExperiment(experiment);
    setActiveView('experiments');
  };

  /**
   * 🎯 NAVEGACIÓN PRINCIPAL
   */
  const navigationItems = [
    { id: 'overview', label: 'Dashboard', icon: '🏠', description: 'Vista general' },
    { id: 'molecular', label: 'Molecular', icon: '🧬', description: 'Visualización molecular' },
    { id: 'experiments', label: 'Experimentos', icon: '🧪', description: 'Protocolos y ensayos' },
    { id: 'chat', label: 'Jarvis Chat', icon: '🤖', description: 'Asistente científico IA' },
    { id: 'settings', label: 'Configuración', icon: '⚙️', description: 'Configuración del sistema' }
  ] as const;

  /**
   * 🎨 RENDERIZAR CONTENIDO PRINCIPAL
   */
  const renderMainContent = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewPanel />;
      case 'molecular':
        return <MolecularPanel />;
      case 'experiments':
        return <ExperimentsPanel />;
      case 'chat':
        return <ChatPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <OverviewPanel />;
    }
  };

  /**
   * 📊 PANEL OVERVIEW
   */
  const OverviewPanel = () => (
    <div className="overview-panel space-y-6">
      <div className="header mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          🌟 Astroflora Scientific Platform
        </h1>
        <p className="text-gray-400 text-lg">
          Plataforma científica con asistente IA - "Jarvis" para análisis molecular avanzado
        </p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Driver AI"
          value={isOnline ? "Online" : "Offline"}
          icon="🤖"
          color={isOnline ? "green" : "red"}
          action={isOnline ? undefined : "Verificar conexión"}
        />
        <StatusCard
          title="Molécula Activa"
          value={currentPdbId || "Ninguna"}
          icon="🧬"
          color={currentPdbId ? "blue" : "gray"}
          action={!currentPdbId ? "Cargar estructura" : undefined}
          onClick={!currentPdbId ? () => loadPDB('1CRN') : undefined}
        />
        <StatusCard
          title="Experimentos"
          value={runningExperiments.length.toString()}
          icon="🧪"
          color={runningExperiments.length > 0 ? "green" : "gray"}
          action="Crear nuevo"
          onClick={createQuickExperiment}
        />
        <StatusCard
          title="Modo Visualización"
          value={viewerMode || "Estándar"}
          icon="👁️"
          color="purple"
        />
      </div>

      {/* Panel de acciones rápidas */}
      <div className="quick-actions bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">🚀 Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionButton
            title="Cargar Estructura PDB"
            description="Cargar estructura molecular desde PDB"
            icon="🧬"
            onClick={() => loadPDB('1CRN')}
          />
          <QuickActionButton
            title="Chat con Jarvis"
            description="Asistente científico inteligente"
            icon="🤖"
            onClick={() => setActiveView('chat')}
          />
          <QuickActionButton
            title="Nuevo Experimento"
            description="Crear protocolo experimental"
            icon="🧪"
            onClick={createQuickExperiment}
          />
        </div>
      </div>

      {/* Estado del sistema */}
      <div className="system-status bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">📊 Estado del Sistema</h3>
        <div className="space-y-3">
          <StatusIndicator
            label="Driver AI Backend"
            status={isOnline}
            details="3.85.5.222:8001"
          />
          <StatusIndicator
            label="Visualización Molecular"
            status={!!currentPdbId}
            details={currentPdbId ? `PDB: ${currentPdbId}` : 'Sin estructura cargada'}
          />
          <StatusIndicator
            label="Procesamiento de Comandos"
            status={!processingCommand}
            details={processingCommand ? 'Ejecutando comando...' : 'Sistema disponible'}
          />
        </div>
      </div>
    </div>
  );

  /**
   * 🧬 PANEL MOLECULAR
   */
  const MolecularPanel = () => (
    <div className="molecular-panel h-full">
      <div className="mb-4 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-2">🧬 Visualización Molecular</h2>
        <p className="text-gray-400">
          Visualizador conectado al estado global - Se actualiza automáticamente con comandos de Jarvis
        </p>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 h-96">
        <MolstarViewerConnected />
      </div>
    </div>
  );

  /**
   * 🧪 PANEL EXPERIMENTOS
   */
  const ExperimentsPanel = () => (
    <div className="experiments-panel space-y-6">
      <div className="header">
        <h2 className="text-2xl font-bold text-white mb-2">🧪 Gestión de Experimentos</h2>
        <p className="text-gray-400">Protocolos y ensayos científicos</p>
      </div>

      <div className="experiments-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="active-experiments bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Experimentos Activos</h3>
          {runningExperiments.length === 0 ? (
            <p className="text-gray-400">No hay experimentos en ejecución</p>
          ) : (
            <div className="space-y-3">
              {runningExperiments.map((exp) => (
                <div key={exp.id} className="bg-gray-700 p-3 rounded border-l-4 border-blue-500">
                  <div className="font-medium text-white">{exp.name}</div>
                  <div className="text-sm text-gray-400">{exp.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="experiment-templates bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Plantillas de Experimento</h3>
          <div className="space-y-3">
            <ExperimentTemplate
              name="Análisis de Proteínas"
              description="Análisis estructural completo"
              onClick={() => createQuickExperiment()}
            />
            <ExperimentTemplate
              name="Docking Molecular"
              description="Análisis de interacciones"
              onClick={() => createQuickExperiment()}
            />
            <ExperimentTemplate
              name="Simulación de Dinámica"
              description="Simulación temporal"
              onClick={() => createQuickExperiment()}
            />
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * 🤖 PANEL CHAT - VERSIÓN PROFESIONAL RESTAURADA
   */
  const ChatPanel = () => (
    <div 
      className="chat-panel w-full h-full" 
      style={{ 
        position: 'relative',
        zIndex: 10,
        isolation: 'isolate',
        height: 'calc(100vh - 120px)',
        overflow: 'hidden'
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* JARVIS CHAT PROFESIONAL RESTAURADO */}
      <JarvisChat />
    </div>
  );

  /**
   * ⚙️ PANEL CONFIGURACIÓN
   */
  const SettingsPanel = () => (
    <div className="settings-panel space-y-6">
      <div className="header">
        <h2 className="text-2xl font-bold text-white mb-2">⚙️ Configuración</h2>
        <p className="text-gray-400">Configuración del sistema Astroflora</p>
      </div>

      <div className="settings-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="driver-ai-config bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🤖 Driver AI Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">Backend URL</label>
              <input
                type="text"
                value="3.85.5.222:8001"
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
                readOnly
              />
            </div>
            <div>
              <label className="block text-white mb-2">Status</label>
              <div className={`px-3 py-2 rounded ${isOnline ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                {isOnline ? '✅ Conectado' : '❌ Desconectado'}
              </div>
            </div>
          </div>
        </div>

        <div className="visualization-config bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">👁️ Configuración Visualización</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">Modo Actual</label>
              <input
                type="text"
                value={viewerMode || 'Estándar'}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
                readOnly
              />
            </div>
            <div>
              <label className="block text-white mb-2">Estructura Activa</label>
              <input
                type="text"
                value={currentPdbId || 'Ninguna'}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="astroflora-dashboard flex h-screen bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div className={`sidebar bg-gray-800 border-r border-gray-700 transition-all duration-300 flex-shrink-0 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="sidebar-header p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-xl font-bold text-white">Astroflora</h2>
                <p className="text-sm text-gray-400">Scientific Platform</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-gray-400 hover:text-white rounded transition-colors"
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        <nav className="sidebar-nav p-4 overflow-y-auto">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView(item.id as ViewMode);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                {!sidebarCollapsed && (
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer del sidebar */}
        <div className="sidebar-footer absolute bottom-4 left-4 right-4">
          {!sidebarCollapsed && (
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Sistema Status</div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xs text-white">
                  {isOnline ? 'Todo operativo' : 'Verificando conexión'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="main-content flex-1 overflow-hidden flex flex-col">
        <div className="main-content-inner flex-1 overflow-auto p-6">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}

/**
 * 🎨 COMPONENTES AUXILIARES
 */

interface StatusCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'green' | 'red' | 'blue' | 'purple' | 'gray';
  action?: string;
  onClick?: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, icon, color, action, onClick }) => {
  const colorClasses = {
    green: 'border-green-500 bg-green-900/20',
    red: 'border-red-500 bg-red-900/20',
    blue: 'border-blue-500 bg-blue-900/20',
    purple: 'border-purple-500 bg-purple-900/20',
    gray: 'border-gray-500 bg-gray-900/20'
  };

  return (
    <div className={`status-card bg-gray-800 rounded-lg p-4 border-l-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {action && onClick && (
          <button
            onClick={onClick}
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {action}
          </button>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
};

interface QuickActionButtonProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className="quick-action-btn bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition-colors"
  >
    <div className="flex items-center space-x-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <h4 className="font-medium text-white">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  </button>
);

interface StatusIndicatorProps {
  label: string;
  status: boolean;
  details: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ label, status, details }) => (
  <div className="status-indicator flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className={`w-3 h-3 rounded-full ${status ? 'bg-green-400' : 'bg-red-400'}`}></div>
      <span className="text-white font-medium">{label}</span>
    </div>
    <span className="text-gray-400 text-sm">{details}</span>
  </div>
);

interface ExperimentTemplateProps {
  name: string;
  description: string;
  onClick: () => void;
}

const ExperimentTemplate: React.FC<ExperimentTemplateProps> = ({ name, description, onClick }) => (
  <button
    onClick={onClick}
    className="experiment-template w-full bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-left transition-colors"
  >
    <h4 className="font-medium text-white">{name}</h4>
    <p className="text-sm text-gray-400">{description}</p>
  </button>
);
