import React from 'react';
import { motion } from "framer-motion";

const ScientificKPICard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  location, 
  type, 
  statusFn, 
  getStatusColorFn, 
  changeType,
  change 
}) => {
  const sensorStatus = statusFn(type, value);
  const statusColor = getStatusColorFn(sensorStatus.status);
  
  const getColorClasses = () => {
    switch (sensorStatus.status) {
      case 'normal':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'danger':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'loading':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-secondary text-secondary-foreground border-border';
    }
  };

  const getChangeIcon = () => {
    if (changeType === 'increase') return '↗';
    if (changeType === 'decrease') return '↘';
    return '→';
  };

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-green-600';
    if (changeType === 'decrease') return 'text-red-600';
    return 'text-muted-foreground';
  };

  const getPulseColor = () => {
    switch (sensorStatus.status) {
      case 'normal':
        return 'before:bg-green-400';
      case 'warning':
        return 'before:bg-amber-400';
      case 'danger':
        return 'before:bg-red-400 scientific-pulse';
      case 'loading':
        return 'before:bg-muted-foreground scientific-pulse';
      default:
        return 'before:bg-secondary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card scientific-border rounded-lg p-6 scientific-shadow scientific-transition hover:scientific-shadow-lg scientific-font"
    >
      {/* Header with Icon and Status */}
      <div className="flex items-center justify-between mb-4">
        <div className={`relative w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
          {icon}
          {/* Status Pulse Indicator */}
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getPulseColor()} 
            before:absolute before:inset-0 before:rounded-full before:animate-ping before:opacity-75`}>
            <div className={`relative w-full h-full rounded-full ${statusColor}`}></div>
          </div>
        </div>
        
        {/* Change Indicator */}
        {change && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <span className="text-lg">{getChangeIcon()}</span>
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      
      {/* Main Value */}
      <div className="mb-3">
        <div className="flex items-baseline space-x-2">
          <h3 className="text-3xl font-bold text-primary">
            {value}
          </h3>
          {unit && (
            <span className="text-lg font-medium text-secondary">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Title and Location */}
      <div className="space-y-1">
        <p className="text-base font-semibold text-primary">{title}</p>
        <p className="text-sm text-secondary">{location}</p>
        
        {/* Status Message */}
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getColorClasses()}`}>
          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusColor}`}></div>
          {sensorStatus.message || 'Sin datos'}
        </div>
      </div>

      {/* Scientific Border Glow Effect */}
      <div className={`absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 
        ${sensorStatus.status === 'danger' ? 'opacity-20 bg-red-100' : 
          sensorStatus.status === 'warning' ? 'opacity-10 bg-amber-100' : ''} 
        pointer-events-none`}></div>
    </motion.div>
  );
};

export default ScientificKPICard;
