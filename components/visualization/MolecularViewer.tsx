'use client';

import React, { useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';

interface MolecularViewerProps {
  data?: any[];
  title?: string;
  className?: string;
}

export default function MolecularViewer({ 
  data = [], 
  title = "🧬 Estructura Molecular 3D",
  className = ""
}: MolecularViewerProps) {
  const plotRef = useRef<any>(null);

  // Datos de estructura molecular avanzada
  const molecularData = data.length > 0 ? data : [
    {
      x: [0, 1.4, 2.8, 1.4, 0, -1.4, -2.8, -1.4],
      y: [1.6, 0.8, 0, -0.8, -1.6, -0.8, 0, 0.8],
      z: [0, 0.5, 0, -0.5, 0, 0.5, 0, -0.5],
      mode: 'markers',
      marker: {
        size: [18, 14, 14, 14, 18, 14, 14, 14],
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'],
        opacity: 0.8,
        line: {
          color: '#FFFFFF',
          width: 2
        }
      },
      type: 'scatter3d',
      name: 'Átomos',
      text: ['C1', 'N2', 'O3', 'C4', 'C5', 'N6', 'O7', 'C8'],
      hovertemplate: '<b>Átomo %{text}</b><br>X: %{x:.2f}Å<br>Y: %{y:.2f}Å<br>Z: %{z:.2f}Å<extra></extra>'
    },
    {
      x: [0, 1.4, 1.4, 2.8, 2.8, 1.4, 1.4, 0, 0, -1.4, -1.4, -2.8, -2.8, -1.4, -1.4, 0],
      y: [1.6, 1.6, 0.8, 0.8, 0, 0, -0.8, -0.8, -1.6, -1.6, -0.8, -0.8, 0, 0, 0.8, 0.8],
      z: [0, 0, 0.5, 0.5, 0, 0, -0.5, -0.5, 0, 0, 0.5, 0.5, 0, 0, -0.5, -0.5],
      mode: 'lines',
      line: {
        color: '#00D4FF',
        width: 6
      },
      type: 'scatter3d',
      name: 'Enlaces',
      showlegend: false
    }
  ];

  const layout = {
    title: {
      text: title,
      font: { 
        color: '#FFFFFF', 
        size: 20,
        family: 'Arial, sans-serif'
      },
      x: 0.5
    },
    scene: {
      xaxis: { 
        title: { text: 'X (Å)', font: { color: '#00D4FF' } },
        color: '#FFFFFF',
        gridcolor: '#2A2A2A',
        backgroundcolor: 'rgba(0,0,0,0)',
        showspikes: false
      },
      yaxis: { 
        title: { text: 'Y (Å)', font: { color: '#00D4FF' } },
        color: '#FFFFFF',
        gridcolor: '#2A2A2A',
        backgroundcolor: 'rgba(0,0,0,0)',
        showspikes: false
      },
      zaxis: { 
        title: { text: 'Z (Å)', font: { color: '#00D4FF' } },
        color: '#FFFFFF',
        gridcolor: '#2A2A2A',
        backgroundcolor: 'rgba(0,0,0,0)',
        showspikes: false
      },
      bgcolor: 'rgba(0,0,0,0)',
      camera: {
        eye: { x: 1.8, y: 1.8, z: 1.8 },
        center: { x: 0, y: 0, z: 0 }
      },
      aspectmode: 'cube'
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#FFFFFF' },
    margin: { l: 20, r: 20, t: 60, b: 20 },
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(20,20,20,0.8)',
      bordercolor: '#00D4FF',
      borderwidth: 1,
      font: { color: '#FFFFFF' }
    }
  };

  const config = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    displaylogo: false,
    responsive: true,
    modeBarButtonsToAdd: [
      {
        name: 'Reset Camera',
        icon: {
          'width': 1000,
          'path': 'M500 0C223.858 0 0 223.858 0 500s223.858 500 500 500 500-223.858 500-500S776.142 0 500 0zM500 900c-220.914 0-400-179.086-400-400S279.086 100 500 100s400 179.086 400 400-179.086 400-400 400z'
        },
        click: function() {
          if (plotRef.current) {
            plotRef.current.relayout({
              'scene.camera': {
                eye: { x: 1.8, y: 1.8, z: 1.8 },
                center: { x: 0, y: 0, z: 0 }
              }
            });
          }
        }
      }
    ]
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900/90 via-blue-900/20 to-purple-900/30 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 shadow-2xl ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-cyan-100">Visualizador Molecular</h3>
        </div>
        <div className="flex space-x-2">
          <div className="px-3 py-1 bg-cyan-500/20 rounded-full text-xs text-cyan-300 border border-cyan-500/30">
            Interactive 3D
          </div>
          <div className="px-3 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300 border border-purple-500/30">
            Real-time
          </div>
        </div>
      </div>
      
      <Plot
        ref={plotRef}
        data={molecularData}
        layout={layout}
        config={config}
        className="w-full h-full"
        style={{ width: '100%', height: '500px' }}
      />
      
      <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
        <div className="flex space-x-4">
          <span>Átomos: <span className="text-cyan-400">8</span></span>
          <span>Enlaces: <span className="text-blue-400">8</span></span>
          <span>Peso Molecular: <span className="text-purple-400">156.18 Da</span></span>
        </div>
        <div className="text-xs bg-gray-800/50 px-2 py-1 rounded">
          Molstar Engine
        </div>
      </div>
    </div>
  );
}
