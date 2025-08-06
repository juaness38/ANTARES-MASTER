'use client';

import React, { useState, useEffect } from 'react';

interface MCPStatusProps {
  className?: string;
}

interface MCPHealthData {
  isHealthy: boolean;
  uptime?: number;
  services?: {
    driver_ai: string;
    hardware_validator: string;
    context_manager: string;
  };
  error?: string;
}

export default function MCPStatus({ className = "" }: MCPStatusProps) {
  const [healthData, setHealthData] = useState<MCPHealthData>({ isHealthy: false });
  const [isChecking, setIsChecking] = useState(true);

  const checkServerHealth = async () => {
    try {
      const response = await fetch('http://localhost:8080/health', {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://antares-master.vercel.app'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHealthData({
          isHealthy: data.status === 'healthy',
          uptime: data.uptime_seconds,
          services: data.services
        });
      } else {
        setHealthData({ isHealthy: false, error: `HTTP ${response.status}` });
      }
    } catch (error) {
      setHealthData({ 
        isHealthy: false, 
        error: error instanceof Error ? error.message : 'Connection failed' 
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkServerHealth();
    const interval = setInterval(checkServerHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  return (
    <div className={`bg-white rounded-lg border p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isChecking 
              ? 'bg-yellow-400 animate-pulse' 
              : healthData.isHealthy 
                ? 'bg-green-400' 
                : 'bg-red-400'
          }`}></div>
          <span className="text-xs font-medium text-gray-700">
            MCP Server
          </span>
        </div>
        
        <div className="text-right">
          {isChecking ? (
            <span className="text-xs text-gray-500">Checking...</span>
          ) : healthData.isHealthy ? (
            <div className="text-xs text-green-600">
              <div>✅ Online</div>
              {healthData.uptime && (
                <div className="text-gray-500">↑ {formatUptime(healthData.uptime)}</div>
              )}
            </div>
          ) : (
            <div className="text-xs text-red-600">
              <div>❌ Offline</div>
              <div className="text-gray-500">Fallback mode</div>
            </div>
          )}
        </div>
      </div>
      
      {healthData.isHealthy && healthData.services && (
        <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
          <div className={`text-center py-1 rounded ${
            healthData.services.driver_ai === 'operational' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            AI
          </div>
          <div className={`text-center py-1 rounded ${
            healthData.services.hardware_validator === 'operational' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            Validator
          </div>
          <div className={`text-center py-1 rounded ${
            healthData.services.context_manager === 'operational' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            Context
          </div>
        </div>
      )}
    </div>
  );
}
