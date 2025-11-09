import React, { useEffect, useRef } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { motion } from 'framer-motion';

const AttackRadar = () => {
  const predictions = useSimulationStore(state => state.predictions || []);
  const nodes = useSimulationStore(state => state.nodes || []);
  const globalThreat = useSimulationStore(state => state.globalThreat || 0);
  const radarRef = useRef<SVGSVGElement>(null);
  const [sweepAngle, setSweepAngle] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle(prev => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getThreatLevel = (nodeId: string) => {
    const prediction = predictions.find(p => p.nodeId === nodeId);
    return prediction ? (prediction.probability || 0) : 0;
  };

  const centerX = 80;
  const centerY = 80;
  const radius = 70;

  return (
    <div className="space-y-3">
      <div className="text-cyan-300 font-mono text-xs font-bold">3D ATTACK RADAR</div>
      
      <svg ref={radarRef} width="160" height="160" className="relative mx-auto">
        {/* Radar circles */}
        {[1, 2, 3].map(i => (
          <circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={(radius * i) / 3}
            fill="none"
            stroke="rgba(6, 182, 212, 0.3)"
            strokeWidth="1"
          />
        ))}
        
        {/* Radar sweep line */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + radius * Math.cos((sweepAngle * Math.PI) / 180)}
          y2={centerY + radius * Math.sin((sweepAngle * Math.PI) / 180)}
          stroke="rgba(6, 182, 212, 0.8)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Threat indicators */}
        {nodes.filter(n => !n.isHoneypot).slice(0, 8).map((node, index) => {
          const angle = (index * 360) / Math.min(8, nodes.length);
          const distance = (getThreatLevel(node.id) * radius) / 100;
          const x = centerX + distance * Math.cos((angle * Math.PI) / 180);
          const y = centerY + distance * Math.sin((angle * Math.PI) / 180);
          const threatLevel = getThreatLevel(node.id);
          
          if (threatLevel > 0.3 && threatLevel > 0) {
            const circleRadius = Math.max(1, threatLevel * 3); // Ensure radius is at least 1
            return (
              <motion.circle
                key={node.id}
                cx={x}
                cy={y}
                r={circleRadius}
                fill={threatLevel > 0.7 ? '#ef4444' : threatLevel > 0.5 ? '#f59e0b' : '#3b82f6'}
                opacity={0.8}
                animate={{
                  r: [circleRadius, circleRadius * 1.3, circleRadius],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            );
          }
          return null;
        })}
        
        {/* Center point */}
        <circle cx={centerX} cy={centerY} r="3" fill="#00ffff" />
      </svg>
      
      {/* Threat list */}
      <div className="space-y-1 max-h-20 overflow-y-auto">
        {predictions.slice(0, 3).map(prediction => {
          const node = nodes.find(n => n.id === prediction.nodeId);
          if (!node) return null;
          
          return (
            <div key={prediction.nodeId} className="flex justify-between items-center text-xs font-mono">
              <span className="text-gray-300 truncate">{node.id}</span>
              <span className={`ml-2 ${
                prediction.probability > 0.7 ? 'text-red-400' : 
                prediction.probability > 0.5 ? 'text-yellow-400' : 
                'text-blue-400'
              }`}>
                {(prediction.probability * 100).toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttackRadar;
