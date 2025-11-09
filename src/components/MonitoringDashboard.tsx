import React from 'react';
import { useSimulationStore } from '../store/simulationStore';

const MonitoringDashboard = () => {
  const {
    systemLoad,
    totalThroughput,
    averageResponseTime,
    errorRate,
    networkEfficiency,
    adaptiveScore,
    globalThreat,
    securityLevel,
    nodes,
    dataPackets
  } = useSimulationStore();

  const healthyNodes = nodes.filter(n => n.status === 'healthy').length;
  const attackedNodes = nodes.filter(n => n.status === 'attacked').length;
  const healingNodes = nodes.filter(n => n.status === 'healing').length;
  const adaptingNodes = nodes.filter(n => n.status === 'adapting').length;

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBarColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'bg-green-500';
    if (value >= thresholds.warning) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-2">
      <div className="text-cyan-300 font-mono text-xs font-bold">SYSTEM MONITOR</div>
      
      {/* System Overview */}
      <div className="space-y-1.5">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-300 text-xs">System Load:</span>
            <span className={`text-xs ${getStatusColor(systemLoad, { good: 70, warning: 50 })}`}>
              {systemLoad.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${getBarColor(systemLoad, { good: 70, warning: 50 })}`}
              style={{ width: `${Math.min(100, systemLoad)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-300">Throughput:</span>
          <span className="text-cyan-400">{totalThroughput.toFixed(0)}/s</span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-300">Avg Response:</span>
          <span className={getStatusColor(averageResponseTime, { good: 100, warning: 200 })}>
            {averageResponseTime.toFixed(0)}ms
          </span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-300">Error Rate:</span>
          <span className={getStatusColor(100 - errorRate, { good: 95, warning: 90 })}>
            {errorRate.toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-300">Efficiency:</span>
          <span className={getStatusColor(networkEfficiency, { good: 80, warning: 60 })}>
            {networkEfficiency.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Security Status */}
      <div className="border-t border-gray-600 pt-1.5 mt-1.5">
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="text-gray-300">Threat Level:</span>
          <span className={getStatusColor(100 - globalThreat, { good: 70, warning: 50 })}>
            {globalThreat.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-red-500 h-1.5 rounded-full"
            style={{ width: `${globalThreat}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2 text-xs">
          <span className="text-gray-300">Security:</span>
          <span className={getStatusColor(securityLevel, { good: 80, warning: 60 })}>
            {securityLevel}%
          </span>
        </div>
      </div>

      {/* Node Status */}
      <div className="border-t border-gray-600 pt-1.5 mt-1.5">
        <div className="text-gray-300 text-xs mb-1">Node Status:</div>
        <div className="grid grid-cols-2 gap-0.5 text-xs">
          <div className="flex justify-between">
            <span className="text-green-400">Healthy:</span>
            <span className="text-white">{healthyNodes}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-400">Attacked:</span>
            <span className="text-white">{attackedNodes}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-400">Healing:</span>
            <span className="text-white">{healingNodes}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-400">Adapting:</span>
            <span className="text-white">{adaptingNodes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
