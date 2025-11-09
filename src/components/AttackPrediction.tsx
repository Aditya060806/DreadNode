import React from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AttackPrediction = () => {
  const { predictions, nodes } = useSimulationStore();

  const topPredictions = predictions
    .filter(p => p.probability > 0.4)
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3);

  return (
    <div className="space-y-2">
      <div className="text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5">
        <AlertTriangle className="w-3 h-3" />
        ATTACK PREDICTION
      </div>
      
      {topPredictions.length === 0 ? (
        <div className="text-gray-400 text-xs font-mono text-center py-1">
          No threats
        </div>
      ) : (
        <div className="space-y-1.5">
          {topPredictions.map((prediction) => {
            const node = nodes.find(n => n.id === prediction.nodeId);
            if (!node) return null;
            
            const probability = prediction.probability * 100;
            
            return (
              <motion.div
                key={prediction.nodeId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-gray-600 rounded p-2"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1 min-w-0">
                    <div className="text-cyan-300 font-mono text-xs font-bold truncate">{node.id}</div>
                    <div className="text-gray-400 font-mono text-xs">{prediction.attackType}</div>
                  </div>
                  <div className="text-right ml-2">
                    <div className={`text-sm font-bold font-mono ${
                      probability > 70 ? 'text-red-400' : 
                      probability > 50 ? 'text-yellow-400' : 
                      'text-blue-400'
                    }`}>
                      {probability.toFixed(0)}%
                    </div>
                  </div>
                </div>
                
                {/* Probability bar */}
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full ${
                      probability > 70 ? 'bg-red-500' : 
                      probability > 50 ? 'bg-yellow-500' : 
                      'bg-blue-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${probability}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttackPrediction;
