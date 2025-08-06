/**
 * 🧬 MOLSTAR VIEWER - CONECTADO AL ESTADO GLOBAL
 * Componente que escucha automáticamente cambios del estado de Zustand
 * Se actualiza cuando Jarvis ejecuta comandos como LOAD_PDB
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { useMolecularState, useMolecularActions } from '../../lib/astroflora-store';

export interface MolstarViewerProps {
  className?: string;
  height?: string;
  showControls?: boolean;
}

export default function MolstarViewer({ 
  className = '', 
  height = '600px',
  showControls = true 
}: MolstarViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  
  // 🎯 CONECTAR AL ESTADO GLOBAL
  const { currentPdbId, currentSequence, viewerMode, isLoading, error } = useMolecularState();
  const { setLoading, setError } = useMolecularActions();

  // 🔄 EFECTO: Cargar PDB cuando cambia el estado global
  useEffect(() => {
    if (currentPdbId && containerRef.current) {
      loadPDBStructure(currentPdbId);
    }
  }, [currentPdbId]);

  // 🔄 EFECTO: Cambiar modo de visualización
  useEffect(() => {
    if (viewerRef.current && viewerMode) {
      updateViewerMode(viewerMode);
    }
  }, [viewerMode]);

  // 🔄 EFECTO: Procesar secuencia
  useEffect(() => {
    if (currentSequence && viewerRef.current) {
      highlightSequenceRegions(currentSequence);
    }
  }, [currentSequence]);

  /**
   * 🧬 CARGAR ESTRUCTURA PDB
   */
  const loadPDBStructure = async (pdbId: string) => {
    try {
      console.log('🧬 MolstarViewer: Loading PDB structure', pdbId);
      setLoading(true);
      setError(null);

      // Simular carga de estructura (reemplazar con Molstar real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aquí iría la integración real con Molstar
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="molstar-placeholder">
            <div class="structure-info">
              <h3>🧬 Estructura Cargada: ${pdbId}</h3>
              <p>Modo: ${viewerMode}</p>
              <p>Estado: Cargado automáticamente por Jarvis</p>
            </div>
            <div class="structure-visual">
              <div class="molecule-representation">
                ${renderMoleculeRepresentation(pdbId, viewerMode)}
              </div>
            </div>
          </div>
        `;
      }

      console.log('✅ MolstarViewer: Structure loaded successfully');
      setLoading(false);

    } catch (error) {
      console.error('🚨 MolstarViewer: Failed to load structure', error);
      setError(`Failed to load PDB: ${pdbId}`);
      setLoading(false);
    }
  };

  /**
   * 🎨 ACTUALIZAR MODO DE VISUALIZACIÓN
   */
  const updateViewerMode = (mode: string) => {
    console.log('🎨 MolstarViewer: Updating viewer mode to', mode);
    
    if (containerRef.current) {
      const visual = containerRef.current.querySelector('.molecule-representation');
      if (visual) {
        visual.innerHTML = renderMoleculeRepresentation(currentPdbId || 'Unknown', mode);
      }
    }
  };

  /**
   * 🔍 HIGHLIGHT REGIONES DE SECUENCIA
   */
  const highlightSequenceRegions = (sequence: string) => {
    console.log('🔍 MolstarViewer: Highlighting sequence regions');
    // Aquí iría la lógica para resaltar regiones específicas
  };

  /**
   * 🎭 RENDERIZAR REPRESENTACIÓN MOLECULAR
   */
  const renderMoleculeRepresentation = (pdbId: string, mode: string) => {
    const modeStyles = {
      cartoon: {
        background: 'linear-gradient(45deg, #4CAF50, #2196F3)',
        shape: '🧬'
      },
      surface: {
        background: 'linear-gradient(45deg, #FF9800, #F44336)',
        shape: '🔵'
      },
      'ball-stick': {
        background: 'linear-gradient(45deg, #9C27B0, #E91E63)',
        shape: '⚫'
      },
      spacefill: {
        background: 'linear-gradient(45deg, #607D8B, #795548)',
        shape: '🟠'
      }
    };

    const style = modeStyles[mode as keyof typeof modeStyles] || modeStyles.cartoon;

    return `
      <div style="
        background: ${style.background};
        border-radius: 12px;
        padding: 40px;
        text-align: center;
        color: white;
        font-size: 48px;
        min-height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      ">
        <div style="font-size: 72px; margin-bottom: 16px;">${style.shape}</div>
        <div style="font-size: 18px; font-weight: bold;">${pdbId} - ${mode.toUpperCase()}</div>
        <div style="font-size: 14px; opacity: 0.8; margin-top: 8px;">
          Actualizado automáticamente por Jarvis
        </div>
      </div>
    `;
  };

  return (
    <div className={`molstar-viewer-container ${className}`}>
      {/* Header con controles */}
      {showControls && (
        <div className="molstar-header bg-gray-800 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">🧬 Visualizador Molecular</h3>
              <p className="text-sm text-gray-300">
                {currentPdbId ? `Estructura: ${currentPdbId}` : 'No hay estructura cargada'}
                {currentSequence && ` | Secuencia: ${currentSequence.length} aa`}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {isLoading && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  <span className="text-sm">Cargando...</span>
                </div>
              )}
              <div className={`px-2 py-1 rounded text-xs ${
                currentPdbId ? 'bg-green-600' : 'bg-gray-600'
              }`}>
                {currentPdbId ? 'Conectado a Jarvis' : 'Esperando comando'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Área de visualización */}
      <div 
        ref={containerRef}
        className="molstar-viewer bg-gray-900 rounded-b-lg overflow-hidden"
        style={{ height }}
      >
        {!currentPdbId && !isLoading && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">🧬</div>
              <p className="text-lg">Esperando estructura molecular</p>
              <p className="text-sm">Jarvis cargará automáticamente las estructuras</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center h-full text-red-400">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-lg">Error al cargar estructura</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer con información */}
      <div className="molstar-footer bg-gray-100 dark:bg-gray-800 p-3 text-sm">
        <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
          <div>
            Modo: <span className="font-semibold">{viewerMode}</span>
          </div>
          <div>
            Conectado al estado global de Astroflora
          </div>
        </div>
      </div>

      {/* Estilos CSS internos */}
      <style jsx>{`
        .molstar-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .structure-info {
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 16px;
          text-align: center;
        }
        
        .structure-info h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
        }
        
        .structure-info p {
          margin: 4px 0;
          font-size: 14px;
          opacity: 0.8;
        }
        
        .structure-visual {
          flex: 1;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
