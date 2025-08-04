'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';

const MolstarViewerCore = dynamic(() => import('./MolstarViewerCore'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading 3D Molecular Viewer...</p>
      </div>
    </div>
  )
});

interface MolstarPlayerProps {
  pdbId?: string;
  width?: string;
  height?: string;
}

export default function MolstarPlayer({ 
  pdbId = "1abc", 
  width = "100%", 
  height = "400px" 
}: MolstarPlayerProps) {
  const [currentPdb, setCurrentPdb] = useState(pdbId);

  const handlePdbChange = (newPdbId: string) => {
    setCurrentPdb(newPdbId);
  };

  return (
    <div className="molstar-container border border-gray-300 rounded-lg overflow-hidden shadow-lg">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium">Molstar 3D Viewer</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentPdb}
              onChange={(e) => setCurrentPdb(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePdbChange(currentPdb)}
              className="bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600 w-16"
              placeholder="PDB ID"
            />
            <button
              onClick={() => handlePdbChange(currentPdb)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded transition-colors"
            >
              Load
            </button>
          </div>
        </div>
      </div>
      
      <Suspense 
        fallback={
          <div className="flex items-center justify-center bg-slate-800 rounded-lg" style={{ width, height }}>
            <div className="text-center">
              <div className="animate-pulse">
                <div className="text-4xl mb-4">⚛️</div>
                <p className="text-gray-300">Initializing Molstar...</p>
              </div>
            </div>
          </div>
        }
      >
        <MolstarViewerCore pdbId={currentPdb} />
      </Suspense>
    </div>
  );
}
