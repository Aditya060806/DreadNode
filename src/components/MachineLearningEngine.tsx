import React, { useEffect, useState } from 'react';
import { useSimulationStore } from '../store/simulationStore';

interface MLPattern {
  id: string;
  type: 'attack' | 'performance' | 'network' | 'healing';
  confidence: number;
  description: string;
  timestamp: number;
  predictedOutcome?: string;
}

const MachineLearningEngine = () => {
  const { nodes, logs, globalThreat, addLog } = useSimulationStore();
  const [patterns, setPatterns] = useState<MLPattern[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Pattern recognition algorithms
  const detectAttackPatterns = () => {
    const recentLogs = logs.filter(log => 
      Date.now() - log.timestamp < 30000 && 
      log.category === 'attack'
    );
    
    if (recentLogs.length >= 3) {
      const pattern: MLPattern = {
        id: `attack-${Date.now()}`,
        type: 'attack',
        confidence: Math.min(95, recentLogs.length * 20),
        description: `Coordinated attack: ${recentLogs.length} attacks`,
        timestamp: Date.now(),
        predictedOutcome: 'High compromise risk'
      };
      setPatterns(prev => [pattern, ...prev.slice(0, 4)]);
    }
  };

  const detectPerformancePatterns = () => {
    const highLoadNodes = nodes.filter(n => n.metrics.cpuUsage > 80 || n.metrics.memoryUsage > 85);
    
    if (highLoadNodes.length >= 3) {
      const pattern: MLPattern = {
        id: `perf-${Date.now()}`,
        type: 'performance',
        confidence: Math.min(90, highLoadNodes.length * 15),
        description: `Performance degradation: ${highLoadNodes.length} overloaded`,
        timestamp: Date.now(),
        predictedOutcome: 'Scaling needed'
      };
      setPatterns(prev => [pattern, ...prev.slice(0, 4)]);
    }
  };

  const detectNetworkPatterns = () => {
    const avgLatency = nodes.reduce((sum, n) => sum + n.metrics.networkLatency, 0) / nodes.length;
    const highLatencyNodes = nodes.filter(n => n.metrics.networkLatency > avgLatency * 1.5);
    
    if (highLatencyNodes.length >= 2) {
      const pattern: MLPattern = {
        id: `net-${Date.now()}`,
        type: 'network',
        confidence: Math.min(85, highLatencyNodes.length * 25),
        description: `Network congestion: ${highLatencyNodes.length} high latency`,
        timestamp: Date.now(),
        predictedOutcome: 'Optimization needed'
      };
      setPatterns(prev => [pattern, ...prev.slice(0, 4)]);
    }
  };

  const detectHealingPatterns = () => {
    const healingNodes = nodes.filter(n => n.status === 'healing' || n.status === 'adapting');
    const recentlyHealed = nodes.filter(n => 
      n.status === 'healthy' && 
      Date.now() - n.lastActivity < 10000
    );
    
    if (healingNodes.length >= 2 || recentlyHealed.length >= 3) {
      const pattern: MLPattern = {
        id: `heal-${Date.now()}`,
        type: 'healing',
        confidence: Math.min(80, (healingNodes.length + recentlyHealed.length) * 20),
        description: `Recovery: ${healingNodes.length} healing`,
        timestamp: Date.now(),
        predictedOutcome: 'Resilience improving'
      };
      setPatterns(prev => [pattern, ...prev.slice(0, 4)]);
    }
  };

  // Main analysis loop
  useEffect(() => {
    const analysisInterval = setInterval(() => {
      if (isAnalyzing) return;
      
      setIsAnalyzing(true);
      detectAttackPatterns();
      detectPerformancePatterns();
      detectNetworkPatterns();
      detectHealingPatterns();
      
      setTimeout(() => setIsAnalyzing(false), 1000);
    }, 5000);

    return () => clearInterval(analysisInterval);
  }, [nodes, logs, globalThreat, isAnalyzing]);

  const getPatternColor = (type: string) => {
    switch (type) {
      case 'attack': return 'text-red-400';
      case 'performance': return 'text-orange-400';
      case 'network': return 'text-blue-400';
      case 'healing': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-cyan-300 font-mono text-xs font-bold">ML ENGINE</div>
        <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
      </div>
      
      {patterns.length === 0 ? (
        <div className="text-gray-400 text-xs font-mono text-center py-1">
          No patterns
        </div>
      ) : (
        <div className="space-y-1.5 max-h-24 overflow-y-auto">
          {patterns.slice(0, 3).map(pattern => (
            <div key={pattern.id} className="border border-gray-600 rounded p-2">
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-mono font-bold ${getPatternColor(pattern.type)}`}>
                  {pattern.type.slice(0, 4).toUpperCase()}
                </span>
                <span className="text-xs font-mono text-cyan-400">
                  {pattern.confidence}%
                </span>
              </div>
              
              <div className="text-gray-300 text-xs font-mono truncate">
                {pattern.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MachineLearningEngine;
