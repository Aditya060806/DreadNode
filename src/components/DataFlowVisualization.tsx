import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSimulationStore } from '../store/simulationStore';

const DataFlowVisualization = () => {
  const { dataPackets, nodes } = useSimulationStore();
  const [activePackets, setActivePackets] = useState<any[]>([]);

  useEffect(() => {
    // Filter out expired packets and update active ones
    const now = Date.now();
    const validPackets = dataPackets.filter(packet => {
      const age = now - packet.timestamp;
      return age < packet.ttl * 1000; // Convert TTL to milliseconds
    });
    setActivePackets(validPackets);
  }, [dataPackets]);

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId && !n.isHoneypot);
    return node ? { x: node.x, y: node.y } : null;
  };

  const getPacketColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff6600';
      case 'medium': return '#ffff00';
      case 'low': return '#00ff00';
      default: return '#00ffff';
    }
  };

  const getPacketSize = (priority: string) => {
    switch (priority) {
      case 'critical': return 8;
      case 'high': return 6;
      case 'medium': return 4;
      case 'low': return 3;
      default: return 3;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {activePackets.map(packet => {
        const sourcePos = getNodePosition(packet.source);
        const destPos = getNodePosition(packet.destination);
        
        if (!sourcePos || !destPos) return null;

        const packetProgress = packet.progress / 100 || Math.min(1, (Date.now() - packet.timestamp) / (packet.ttl * 1000));
        const currentX = sourcePos.x + (destPos.x - sourcePos.x) * packetProgress;
        const currentY = sourcePos.y + (destPos.y - sourcePos.y) * packetProgress;

        return (
          <motion.div
            key={packet.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${currentX}%`,
              top: `${currentY}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: `0 0 ${getPacketSize(packet.priority) * 3}px ${getPacketColor(packet.priority)}`
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="rounded-full border-2 border-white"
              style={{
                width: getPacketSize(packet.priority),
                height: getPacketSize(packet.priority),
                backgroundColor: getPacketColor(packet.priority),
                boxShadow: `0 0 ${getPacketSize(packet.priority) * 2}px ${getPacketColor(packet.priority)}`,
              }}
            />
            
            {/* Data trail effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: getPacketColor(packet.priority),
                opacity: 0.3,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default DataFlowVisualization;
