import React from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { Activity, Shield, Heart, RotateCcw } from 'lucide-react';

const RecoverySystemStatus = () => {
  const nodes = useSimulationStore(s => s.nodes);
  
  // Calculate recovery statistics
  const healingNodes = nodes.filter(n => n.status === 'healing').length;
  const repairingFirewalls = nodes.filter(n => n.firewallActive && n.firewallStrength < 100).length;
  const activeFirewalls = nodes.filter(n => n.firewallActive && n.firewallStrength > 0).length;
  const healthyNodes = nodes.filter(n => n.status === 'healthy' && !n.isHoneypot).length;
  const totalNodes = nodes.filter(n => !n.isHoneypot).length;
  const recoveryRate = totalNodes > 0 ? (healthyNodes / totalNodes) * 100 : 100;

  return (
    <div className="space-y-2">
      <div className="text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5">
        <Activity className="w-3 h-3" />
        RECOVERY SYSTEM
      </div>
      
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-300 font-mono">System Health:</span>
          <span className={`font-mono flex items-center gap-1 ${
            recoveryRate > 80 ? 'text-green-400' : 
            recoveryRate > 50 ? 'text-yellow-400' : 
            'text-red-400'
          }`}>
            <Heart className="w-3 h-3" />
            {recoveryRate.toFixed(0)}%
          </span>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-300 font-mono">Healing Nodes:</span>
          <span className="text-blue-400 font-mono flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            {healingNodes}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-300 font-mono">Active Firewalls:</span>
          <span className="text-cyan-400 font-mono flex items-center gap-1">
            <Shield className="w-3 h-3" />
            {activeFirewalls}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-300 font-mono">Repairing Firewalls:</span>
          <span className={`font-mono flex items-center gap-1 ${
            repairingFirewalls > 0 ? 'text-yellow-400' : 'text-gray-400'
          }`}>
            <Shield className="w-3 h-3" />
            {repairingFirewalls}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecoverySystemStatus;

