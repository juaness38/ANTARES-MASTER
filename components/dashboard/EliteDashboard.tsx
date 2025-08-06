'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface EliteDashboardProps {
  className?: string;
}

export default function EliteDashboard({ className = "" }: EliteDashboardProps) {
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    temperature: 23.4,
    ph: 7.2,
    pressure: 1.01,
    connectivity: 98.7
  });

  // Simulación de datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const newPoint = {
        time: new Date().toLocaleTimeString(),
        energy: Math.random() * 100 + 50,
        stability: Math.random() * 20 + 80,
        efficiency: Math.random() * 15 + 85,
        temperature: 23 + Math.random() * 2
      };
      
      setRealTimeData(prev => [...prev.slice(-19), newPoint]);
      
      setSystemStatus(prev => ({
        temperature: +(23 + Math.random() * 2).toFixed(1),
        ph: +(7 + Math.random() * 0.4).toFixed(1),
        pressure: +(1 + Math.random() * 0.02).toFixed(2),
        connectivity: +(98 + Math.random() * 2).toFixed(1)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ title, value, unit, status, icon }: any) => (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            status === 'optimal' ? 'bg-green-400' : 
            status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
          }`}></div>
          <span className="text-gray-300 text-sm font-medium">{title}</span>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
      
      <div className="flex items-end space-x-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-gray-400 text-sm mb-1">{unit}</span>
      </div>
      
      <div className="mt-3 flex items-center space-x-2">
        <div className={`h-1 flex-1 rounded-full ${
          status === 'optimal' ? 'bg-green-500/30' : 
          status === 'warning' ? 'bg-yellow-500/30' : 'bg-red-500/30'
        }`}>
          <div className={`h-full rounded-full transition-all duration-1000 ${
            status === 'optimal' ? 'bg-green-400 w-4/5' : 
            status === 'warning' ? 'bg-yellow-400 w-3/5' : 'bg-red-400 w-2/5'
          }`}></div>
        </div>
        <span className={`text-xs font-medium ${
          status === 'optimal' ? 'text-green-400' : 
          status === 'warning' ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header Élite */}
      <div className="bg-gradient-to-r from-gray-900/95 via-blue-900/40 to-purple-900/40 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/30 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              🚀 Antares 7.1 Mission Control
            </h1>
            <p className="text-gray-300 text-lg mt-2">
              Advanced Astrobiological Research & Drug Discovery Platform
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
              <span className="text-green-400 font-semibold">🟢 OPERATIONAL</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{new Date().toLocaleTimeString()}</div>
              <div className="text-gray-400 text-sm">Mission Time: 247 days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas en Tiempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Temperatura Sistema"
          value={systemStatus.temperature}
          unit="°C"
          status="optimal"
          icon="🌡️"
        />
        <MetricCard
          title="pH Buffer"
          value={systemStatus.ph}
          unit="pH"
          status="optimal"
          icon="⚗️"
        />
        <MetricCard
          title="Presión Atmosférica"
          value={systemStatus.pressure}
          unit="atm"
          status="optimal"
          icon="🔘"
        />
        <MetricCard
          title="Conectividad"
          value={systemStatus.connectivity}
          unit="%"
          status="optimal"
          icon="📡"
        />
      </div>

      {/* Gráficos en Tiempo Real */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Energía */}
        <div className="bg-gradient-to-br from-gray-900/90 via-blue-900/20 to-purple-900/30 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-semibold text-white">⚡ Niveles de Energía</h3>
            </div>
            <div className="text-blue-400 text-sm">Real-time monitoring</div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={realTimeData}>
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #3B82F6',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="energy" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#energyGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Estabilidad */}
        <div className="bg-gradient-to-br from-gray-900/90 via-green-900/20 to-emerald-900/30 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-semibold text-white">🔬 Estabilidad Molecular</h3>
            </div>
            <div className="text-green-400 text-sm">Live analysis</div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={realTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #10B981',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="stability" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#F59E0B" 
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Panel de Control Avanzado */}
      <div className="bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-pink-900/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <h3 className="text-2xl font-bold text-white">🎛️ Mission Control Center</h3>
          </div>
          <div className="flex space-x-3">
            <button className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-xl border border-cyan-500/30 transition-all duration-300 font-semibold">
              🧬 Start Analysis
            </button>
            <button className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl border border-purple-500/30 transition-all duration-300 font-semibold">
              🚀 Deploy Probe
            </button>
            <button className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-xl border border-green-500/30 transition-all duration-300 font-semibold">
              📊 Generate Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-300">🔍 Active Experiments</h4>
            <div className="space-y-2">
              {['Protein Folding Analysis', 'Extremophile Cultivation', 'Drug Synthesis Pathway'].map((exp, idx) => (
                <div key={idx} className="bg-gray-800/60 p-3 rounded-lg border border-gray-600/30">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">{exp}</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="mt-2 h-1 bg-gray-700 rounded-full">
                    <div className="h-full bg-purple-500 rounded-full" style={{width: `${65 + idx * 15}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-300">🌡️ Environmental Controls</h4>
            <div className="space-y-3">
              {[
                { label: 'Temperature', value: '23.4°C', color: 'text-blue-400' },
                { label: 'Humidity', value: '65%', color: 'text-cyan-400' },
                { label: 'CO2 Level', value: '0.04%', color: 'text-green-400' },
                { label: 'Radiation', value: '0.12 μSv/h', color: 'text-yellow-400' }
              ].map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-800/60 p-3 rounded-lg border border-gray-600/30">
                  <span className="text-gray-300">{metric.label}</span>
                  <span className={`font-semibold ${metric.color}`}>{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-300">📈 AI Predictions</h4>
            <div className="space-y-3">
              {[
                { prediction: 'Compound Synthesis Success', probability: '94%', color: 'text-green-400' },
                { prediction: 'Protein Stability', probability: '87%', color: 'text-blue-400' },
                { prediction: 'Biocompatibility', probability: '76%', color: 'text-yellow-400' },
                { prediction: 'Side Effects Risk', probability: '12%', color: 'text-red-400' }
              ].map((pred, idx) => (
                <div key={idx} className="bg-gray-800/60 p-3 rounded-lg border border-gray-600/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm">{pred.prediction}</span>
                    <span className={`font-bold ${pred.color}`}>{pred.probability}</span>
                  </div>
                  <div className="h-1 bg-gray-700 rounded-full">
                    <div 
                      className={`h-full rounded-full ${pred.color.includes('green') ? 'bg-green-500' : 
                        pred.color.includes('blue') ? 'bg-blue-500' :
                        pred.color.includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{width: pred.probability}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
