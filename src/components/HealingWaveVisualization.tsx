import React from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { motion } from 'framer-motion';

const HealingWaveVisualization = () => {
  const { healingWaves, nodes } = useSimulationStore();

  return (
    <>
      {healingWaves.map(wave => {
        const sourceNode = nodes.find(n => n.id === wave.sourceNodeId);
        if (!sourceNode) return null;

        return (
          <motion.div
            key={wave.id}
            className="absolute pointer-events-none"
            style={{
              left: `${sourceNode.x}%`,
              top: `${sourceNode.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 5,
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{
              scale: wave.radius / 10,
              opacity: [0.8, 0.4, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          >
            <div
              className="w-20 h-20 rounded-full border-4 border-emerald-400"
              style={{
                boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)',
              }}
            />
          </motion.div>
        );
      })}
    </>
  );
};

export default HealingWaveVisualization;

