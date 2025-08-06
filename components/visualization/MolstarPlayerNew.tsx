'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';

const DynamicMolstarViewer = dynamic(() => import('./MolstarViewerCore'), {
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
  data?: any;
  title?: string;
  className?: string;
}

export default function MolstarPlayer({ 
  pdbId = "1abc",
  title = "🧬 Molstar 3D Viewer",
  className = ""
}: MolstarPlayerProps) {

  return (
    <div className={`bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 rounded-xl p-6 shadow-2xl border border-blue-500/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          <h3 className="text-xl font-bold text-white">
            {title}
          </h3>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
            Load PDB
          </button>
          <button className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Molstar Viewer Container */}
      <div className="relative bg-black/30 rounded-lg border border-blue-500/30 overflow-hidden">
        <DynamicMolstarViewer pdbId={pdbId} />
      </div>

      {/* Structure Info */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="text-blue-400 text-sm font-medium">PDB ID</div>
          <div className="text-white text-lg font-bold">{pdbId.toUpperCase()}</div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
          <div className="text-purple-400 text-sm font-medium">Method</div>
          <div className="text-white text-lg font-bold">X-RAY</div>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
          <div className="text-indigo-400 text-sm font-medium">Resolution</div>
          <div className="text-white text-lg font-bold">1.8 Å</div>
        </div>
      </div>
    </div>
  );
}
