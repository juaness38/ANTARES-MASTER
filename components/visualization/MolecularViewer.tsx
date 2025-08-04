'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const MolstarPlayer = dynamic(() => import('./MolstarPlayer'), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 rounded-lg h-96 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Molecular Viewer...</p>
      </div>
    </div>
  )
});

interface MolecularViewerProps {
  pdbId?: string;
  simulationId?: string;
  onAnalysisComplete?: (results: any) => void;
}

export default function MolecularViewer({
  pdbId = "1abc",
  simulationId,
  onAnalysisComplete
}: MolecularViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAtoms, setSelectedAtoms] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'cartoon' | 'surface' | 'bonds'>('cartoon');

  const handleAtomSelection = (atomIds: number[]) => {
    setSelectedAtoms(atomIds);
  };

  const runMolecularAnalysis = async () => {
    setIsLoading(true);
    try {
      // Simular análisis molecular
      const mockResults = {
        bondLengths: [1.54, 1.34, 1.21],
        angles: [109.5, 120.0, 180.0],
        energy: -150.5,
        ramachandran: { favorable: 85, allowed: 12, outliers: 3 }
      };
      
      setTimeout(() => {
        onAnalysisComplete?.(mockResults);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Molecular Viewer
        </h3>
        <div className="flex space-x-2">
          <select 
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="cartoon">Cartoon</option>
            <option value="surface">Surface</option>
            <option value="bonds">Bonds</option>
          </select>
          <button
            onClick={runMolecularAnalysis}
            disabled={isLoading}
            className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <MolstarPlayer pdbId={pdbId} height="400px" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium text-gray-700">Resolution</div>
          <div className="text-gray-600">2.1 Å</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium text-gray-700">Chains</div>
          <div className="text-gray-600">A, B</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium text-gray-700">Residues</div>
          <div className="text-gray-600">342</div>
        </div>
      </div>

      {selectedAtoms.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-blue-800 text-sm">
            <strong>Selected atoms:</strong> {selectedAtoms.length}
          </p>
        </div>
      )}
    </div>
  );
}
