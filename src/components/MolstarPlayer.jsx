'use client';

import React from 'react';

export default function MolstarPlayer({ 
  title = "🧬 Molstar Viewer",
  className = ""
}) {

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
            Load
          </button>
          <button className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
            Save
          </button>
        </div>
      </div>

      {/* Molstar Viewer Area */}
      <div className="relative bg-black/40 rounded-lg border border-blue-500/30 overflow-hidden">
        <div className="aspect-video flex items-center justify-center">
          {/* Placeholder para Molstar viewer */}
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">⚛️</div>
            <p className="text-lg font-medium">Molstar 3D Viewer</p>
            <p className="text-sm opacity-70">Molecular Structure Ready</p>
            <div className="mt-4 flex justify-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>

        {/* Viewer Controls */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between text-sm text-gray-300">
              <div className="flex gap-4">
                <span>Chains: <span className="text-blue-400">4</span></span>
                <span>Atoms: <span className="text-purple-400">2,847</span></span>
                <span>Format: <span className="text-indigo-400">PDB</span></span>
              </div>
              <div className="flex gap-2">
                <button className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30">
                  Reset
                </button>
                <button className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded hover:bg-purple-500/30">
                  Center
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structure Info */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="text-blue-400 text-sm font-medium">PDB ID</div>
          <div className="text-white text-lg font-bold">1ABC</div>
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
