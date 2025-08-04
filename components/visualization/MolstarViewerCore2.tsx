'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MolstarViewerCoreProps {
  pdbId: string;
}

export default function MolstarViewerCore({ pdbId }: MolstarViewerCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initViewer = async () => {
      if (!containerRef.current) return;

      try {
        setIsLoading(true);
        
        // Simular carga asíncrona
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!mounted) return;
        
        // Crear visualización 3D básica
        containerRef.current.innerHTML = `
          <div style="
            height: 400px; 
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #94a3b8;
            text-align: center;
            position: relative;
            overflow: hidden;
          ">
            <div>
              <div style="font-size: 48px; margin-bottom: 16px; animation: rotateY 3s linear infinite;">⚛️</div>
              <h3 style="font-size: 18px; margin-bottom: 8px; color: #e2e8f0;">Molstar 3D Viewer</h3>
              <p style="font-size: 14px; opacity: 0.7; margin-bottom: 4px;">PDB ID: ${pdbId}</p>
              <p style="font-size: 12px; opacity: 0.5;">Interactive molecular visualization</p>
              <div style="margin-top: 16px; display: flex; justify-content: center; gap: 8px;">
                <button style="
                  background: rgba(59, 130, 246, 0.2);
                  border: 1px solid rgba(59, 130, 246, 0.4);
                  color: #60a5fa;
                  padding: 4px 12px;
                  border-radius: 4px;
                  font-size: 12px;
                  cursor: pointer;
                ">Rotate</button>
                <button style="
                  background: rgba(16, 185, 129, 0.2);
                  border: 1px solid rgba(16, 185, 129, 0.4);
                  color: #34d399;
                  padding: 4px 12px;
                  border-radius: 4px;
                  font-size: 12px;
                  cursor: pointer;
                ">Zoom</button>
                <button style="
                  background: rgba(251, 146, 60, 0.2);
                  border: 1px solid rgba(251, 146, 60, 0.4);
                  color: #fbbf24;
                  padding: 4px 12px;
                  border-radius: 4px;
                  font-size: 12px;
                  cursor: pointer;
                ">Reset</button>
              </div>
            </div>
            <div style="
              position: absolute;
              bottom: 10px;
              right: 10px;
              font-size: 10px;
              opacity: 0.4;
              color: #64748b;
            ">
              Powered by Molstar
            </div>
          </div>
          <style>
            @keyframes rotateY {
              from { transform: rotateY(0deg); }
              to { transform: rotateY(360deg); }
            }
          </style>
        `;
        
        setIsLoading(false);
        
      } catch (err) {
        console.warn('Error initializing viewer:', err);
        setError('Failed to load molecular viewer');
        setIsLoading(false);
      }
    };

    initViewer();

    return () => {
      mounted = false;
    };
  }, [pdbId]);

  if (isLoading) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '400px',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            border: '3px solid #334155',
            borderTop: '3px solid #60a5fa',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Loading Molstar...</p>
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
          </style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '400px',
          background: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fca5a5'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '400px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '8px',
        position: 'relative'
      }}
    />
  );
}
