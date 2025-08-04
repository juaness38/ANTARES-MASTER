'use client';

import { useEffect, useRef, useState } from 'react';
import { createPluginUI } from 'molstar/lib/mol-plugin-ui';
import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context';
import { DefaultPluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';

interface MolstarViewerProps {
  pdbId: string;
}

const MolstarViewerCore = ({ pdbId }: MolstarViewerProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const pluginRef = useRef<PluginUIContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Evita la reinicialización si el plugin ya existe
    if (!parentRef.current || pluginRef.current) return;

    const initViewer = async () => {
      try {
        setLoading(true);
        setError(null);

        // Crear el elemento para el render de React
        const canvas = document.createElement('div');
        parentRef.current!.appendChild(canvas);

        // Inicializa el PluginUI con el render correcto
        const plugin = await createPluginUI({
          target: canvas,
          render: (component: any, container: Element) => {
            container.appendChild(component);
          },
          spec: {
            ...DefaultPluginUISpec(),
            layout: {
              initial: {
                isExpanded: false,
                showControls: false,
              },
            },
            components: {
              remoteState: 'none',
            },
          },
        });

        pluginRef.current = plugin;

        if (!plugin) return;

        // Carga la estructura PDB desde el ID usando el builder correcto
        const data = await plugin.builders.data.download({
          url: `https://files.rcsb.org/download/${pdbId}.pdb`,
          isBinary: false,
        });

        const trajectory = await plugin.builders.structure.parseTrajectory(data, 'pdb');
        const model = await plugin.builders.structure.createModel(trajectory);
        const structure = await plugin.builders.structure.createStructure(model);

        // Crear representación cartoon
        await plugin.builders.structure.representation.addRepresentation(structure, {
          type: 'cartoon',
          color: 'chain-id',
        });

        // Ajustar vista
        plugin.managers.camera.reset();

        setLoading(false);
      } catch (e) {
        console.error('Molstar Viewer Error:', e);
        setError('Failed to load molecular structure.');
        setLoading(false);
      }
    };

    initViewer();

    // Función de limpieza para destruir la instancia del plugin
    // cuando el componente se desmonte. Esto es CRÍTICO para evitar fugas de memoria.
    return () => {
      if (pluginRef.current) {
        pluginRef.current.dispose();
        pluginRef.current = null;
      }
    };
  }, [pdbId]); // El efecto se volverá a ejecutar si el pdbId cambia

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-300">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🧬</div>
            <p>Loading Molecular Viewer...</p>
            <p className="text-xs text-slate-500 mt-2">PDB: {pdbId}</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 text-red-300">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="font-semibold mb-2">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500/20 border border-blue-500/40 text-blue-300 px-4 py-2 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      <div
        ref={parentRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default MolstarViewerCore;
