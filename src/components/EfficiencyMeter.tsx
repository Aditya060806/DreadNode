import React from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { Trophy, Clock, Shield } from 'lucide-react';

const EfficiencyMeter = () => {
  const { efficiencyScore, humanVsAI, immuneMemory, nodes } = useSimulationStore();
  
  const healthyNodes = nodes.filter(n => n.status === 'healthy' && !n.isHoneypot).length;
  const totalNodes = nodes.filter(n => !n.isHoneypot).length;
  const defenseRate = immuneMemory.totalAttacks > 0 
    ? (immuneMemory.learnedDefenses / immuneMemory.totalAttacks) * 100 
    : 0;

  return (
    <div className="space-y-2">
      <div className="text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5">
        <Trophy className="w-3 h-3" />
        EFFICIENCY SCORE
      </div>
      
      <div className="space-y-2">
        {/* Overall Efficiency */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-300 text-xs font-mono">AI Score:</span>
            <span className={`text-sm font-bold font-mono ${
              efficiencyScore > 80 ? 'text-green-400' : 
              efficiencyScore > 60 ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              {efficiencyScore.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                efficiencyScore > 80 ? 'bg-green-500' : 
                efficiencyScore > 60 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${efficiencyScore}%` }}
            />
          </div>
        </div>

        {/* AI vs Human Comparison */}
        <div className="border-t border-gray-600 pt-1.5 mt-1.5">
          <div className="text-cyan-400 font-mono text-xs font-bold mb-1">AI vs HUMAN</div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span className="text-gray-300">AI:</span>
              </div>
              <div className="text-cyan-400 font-bold">{humanVsAI.aiScore.toFixed(1)}%</div>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-300">Time:</span>
              </div>
              <div className="text-yellow-400 font-bold">{(humanVsAI.aiTime / 1000).toFixed(1)}s</div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="border-t border-gray-600 pt-1.5 mt-1.5">
          <div className="text-cyan-400 font-mono text-xs font-bold mb-1">HEALTH</div>
          <div className="space-y-0.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-300">Nodes:</span>
              <span className="text-green-400 font-bold">{healthyNodes}/{totalNodes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Defense:</span>
              <span className="text-cyan-400 font-bold">{defenseRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Immune Memory */}
        <div className="border-t border-gray-600 pt-1.5 mt-1.5">
          <div className="text-cyan-400 font-mono text-xs font-bold mb-1">IMMUNE MEMORY</div>
          <div className="space-y-0.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-300">Attacks:</span>
              <span className="text-red-400">{immuneMemory.totalAttacks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Defenses:</span>
              <span className="text-green-400">{immuneMemory.learnedDefenses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Signatures:</span>
              <span className="text-cyan-400">{immuneMemory.signatures.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyMeter;
