'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface SystemMetric {
  timestamp: string;
  cpu: number;
  memory: number;
  network: number;
  temperature: number;
}

interface RealTimeMonitorProps {
  className?: string;
}

export default function RealTimeMonitor({ className = "" }: RealTimeMonitorProps) {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false); // Control de activación manual

  // Simulación de datos en tiempo real - OPTIMIZADO para 2GB
  useEffect(() => {
    if (!isActive) return; // Solo ejecutar cuando esté activo
    
    const interval = setInterval(() => {
      const newMetric: SystemMetric = {
        timestamp: new Date().toLocaleTimeString(),
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        network: Math.random() * 1000,
        temperature: 35 + Math.random() * 20
      };

      setMetrics(prev => {
        const updated = [...prev, newMetric];
        return updated.slice(-15); // Reducido de 20 a 15 para ahorrar memoria
      });

      // Simulación de conexión
      setIsConnected(Math.random() > 0.1);

      // Generar alertas críticas solamente (menos frecuentes)
      if (newMetric.cpu > 90) { // Aumentado umbral de 85 a 90
        setAlerts(prev => [...prev.slice(-3), `⚠️ CPU crítica: ${newMetric.cpu.toFixed(1)}%`]);
      }
      if (newMetric.temperature > 55) { // Aumentado umbral de 50 a 55
        setAlerts(prev => [...prev.slice(-3), `🌡️ Temperatura crítica: ${newMetric.temperature.toFixed(1)}°C`]);
      }
    }, 5000); // Aumentado de 2000ms a 5000ms para reducir carga

    return () => clearInterval(interval);
  }, [isActive]); // Dependencia de isActive

  // Inicializar datos estáticos para mostrar algo al inicio
  useEffect(() => {
    // Datos iniciales estáticos para evitar carga innecesaria
    const initialMetrics: SystemMetric[] = [
      {
        timestamp: new Date(Date.now() - 30000).toLocaleTimeString(),
        cpu: 22.5,
        memory: 45.3,
        network: 340,
        temperature: 42.1
      },
      {
        timestamp: new Date(Date.now() - 15000).toLocaleTimeString(), 
        cpu: 18.7,
        memory: 43.1,
        network: 285,
        temperature: 41.8
      },
      {
        timestamp: new Date().toLocaleTimeString(),
        cpu: 25.2,
        memory: 47.9,
        network: 412,
        temperature: 42.5
      }
    ];
    setMetrics(initialMetrics);
    setIsConnected(true);
  }, []);

  const latestMetric = metrics[metrics.length - 1];

  return (
    <div className={`bg-gradient-to-br from-gray-900/90 via-green-900/20 to-blue-900/30 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6 shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <h3 className="text-lg font-semibold text-green-100">Monitor en Tiempo Real</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              isActive 
                ? 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30' 
                : 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30'
            }`}
          >
            {isActive ? '⏸️ Pausar' : '▶️ Iniciar'} Live
          </button>
          <div className="px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300 border border-blue-500/30">
            {isActive ? 'Live Stream' : 'Pausado'}
          </div>
          <div className="px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300 border border-blue-500/30">
            {isConnected ? 'Connected' : 'Reconnecting...'}
          </div>
        </div>
      </div>

      {/* Métricas actuales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20">
          <div className="text-xs text-cyan-400 mb-1">CPU Usage</div>
          <div className="text-2xl font-bold text-cyan-300">
            {latestMetric ? `${latestMetric.cpu.toFixed(1)}%` : '--'}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${latestMetric?.cpu || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-purple-500/20">
          <div className="text-xs text-purple-400 mb-1">Memory</div>
          <div className="text-2xl font-bold text-purple-300">
            {latestMetric ? `${latestMetric.memory.toFixed(1)}%` : '--'}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${latestMetric?.memory || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-green-500/20">
          <div className="text-xs text-green-400 mb-1">Network</div>
          <div className="text-2xl font-bold text-green-300">
            {latestMetric ? `${latestMetric.network.toFixed(0)} MB/s` : '--'}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((latestMetric?.network || 0) / 10, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-orange-500/20">
          <div className="text-xs text-orange-400 mb-1">Temperature</div>
          <div className="text-2xl font-bold text-orange-300">
            {latestMetric ? `${latestMetric.temperature.toFixed(1)}°C` : '--'}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((latestMetric?.temperature || 0) / 70 * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Gráfico en tiempo real */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Tendencias del Sistema</h4>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={metrics}>
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9F7AEA" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9F7AEA" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#9CA3AF"
              fontSize={12}
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tick={{ fill: '#9CA3AF' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Area
              type="monotone"
              dataKey="cpu"
              stroke="#00D4FF"
              fillOpacity={1}
              fill="url(#cpuGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="memory"
              stroke="#9F7AEA"
              fillOpacity={1}
              fill="url(#memoryGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Panel de alertas */}
      <div className="bg-black/20 rounded-xl p-4 border border-red-500/20">
        <h4 className="text-sm font-semibold text-red-300 mb-3 flex items-center">
          <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
          Alertas del Sistema
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <div key={index} className="text-sm text-red-200 bg-red-900/20 rounded-lg p-2 border border-red-500/20">
                {alert}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400 italic">
              No hay alertas activas
            </div>
          )}
        </div>
      </div>

      {/* Footer con estadísticas */}
      <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
        <div className="flex space-x-4">
          <span>Uptime: <span className="text-green-400">99.8%</span></span>
          <span>Latencia: <span className="text-cyan-400">2ms</span></span>
          <span>Throughput: <span className="text-purple-400">1.2k ops/s</span></span>
        </div>
        <div className="text-xs bg-gray-800/50 px-2 py-1 rounded">
          Elite Monitoring v2.1
        </div>
      </div>
    </div>
  );
}
