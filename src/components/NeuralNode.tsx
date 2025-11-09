import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Node } from '../store/simulationStore';

interface NeuralNodeProps {
  node: Node;
  onNodeClick: (node: Node) => void;
  isUnderAttack?: boolean;
  reflexTrigger?: boolean;
}

const NeuralNode = ({ node, onNodeClick, isUnderAttack = false, reflexTrigger = false }: NeuralNodeProps) => {
  const controls = useAnimation();
  const isCore = node.id.includes('core');
  // Consistent sizing for better alignment
  const size = isCore ? 'w-14 h-14' : 'w-10 h-10';
  const [showDetails, setShowDetails] = useState(false);

  // Animate pulse/flicker/shake
  React.useEffect(() => {
    if (node.status === 'attacked' || isUnderAttack) {
      controls.start({
        scale: [1, 1.15, 0.95, 1.1, 1],
        filter: [
          'brightness(1) drop-shadow(0 0 8px #f00)',
          'brightness(1.3) drop-shadow(0 0 24px #f00)',
          'brightness(0.8) drop-shadow(0 0 12px #f00)',
          'brightness(1.2) drop-shadow(0 0 32px #f00)',
          'brightness(1) drop-shadow(0 0 8px #f00)'
        ],
        transition: { duration: 0.7, repeat: 1 }
      });
    } else if (node.status === 'healing') {
      controls.start({
        scale: [1, 1.08, 1],
        filter: [
          'brightness(1) drop-shadow(0 0 8px #ff0)',
          'brightness(1.2) drop-shadow(0 0 24px #ff0)',
          'brightness(1) drop-shadow(0 0 8px #ff0)'
        ],
        transition: { duration: 1.2, repeat: 1 }
      });
    } else if (node.status === 'adapting') {
      controls.start({
        scale: [1, 1.12, 1],
        filter: [
          'brightness(1) drop-shadow(0 0 8px #0ff)',
          'brightness(1.3) drop-shadow(0 0 24px #0ff)',
          'brightness(1) drop-shadow(0 0 8px #0ff)'
        ],
        transition: { duration: 1.1, repeat: 1 }
      });
    } else {
      controls.start({ scale: 1, filter: 'brightness(1)' });
    }
  }, [node.status, isUnderAttack]);

  function getStatusColor(status: string) {
    switch (status) {
      case 'healthy': return { name: 'emerald', from: '#34d399', to: '#059669', border: '#6ee7b7' };
      case 'healing': return { name: 'amber', from: '#fbbf24', to: '#d97706', border: '#fcd34d' };
      case 'attacked': return { name: 'red', from: '#f87171', to: '#dc2626', border: '#fca5a5' };
      case 'adapting': return { name: 'cyan', from: '#22d3ee', to: '#0891b2', border: '#67e8f9' };
      case 'quarantined': return { name: 'purple', from: '#a78bfa', to: '#7c3aed', border: '#c4b5fd' };
      case 'honeypot': return { name: 'pink', from: '#f472b6', to: '#db2777', border: '#f9a8d4' };
      case 'overloaded': return { name: 'orange', from: '#fb923c', to: '#ea580c', border: '#fdba74' };
      case 'maintenance': return { name: 'blue', from: '#60a5fa', to: '#2563eb', border: '#93c5fd' };
      default: return { name: 'gray', from: '#9ca3af', to: '#4b5563', border: '#d1d5db' };
    }
  }
  
  const colorMap = getStatusColor(node.status);

  return (
    <motion.div
      animate={controls}
      initial={{ scale: 1, filter: 'brightness(1)' }}
      whileHover={{ scale: 1.18, filter: 'brightness(1.3)' }}
      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${size}`}
      style={{ 
        // Node center is at (x%, y%) due to transform centering
        // This ensures perfect alignment with line endpoints
        left: `${node.x}%`, 
        top: `${node.y}%`, 
        zIndex: 30 // Render nodes above connections for proper layering
      }}
      onClick={e => {
        // Ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${e.nativeEvent.offsetX}px`;
        ripple.style.top = `${e.nativeEvent.offsetY}px`;
        e.currentTarget.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
        onNodeClick(node);
      }}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Outer pulse ring - smaller for better alignment visibility */}
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: colorMap.border }}
        animate={{ opacity: [0.7, 0.2, 0.7], scale: [1, 1.1, 1] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
      {/* Firewall shield */}
      {node.firewallActive && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-cyan-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            boxShadow: `0 0 ${node.firewallStrength * 2}px rgba(6, 182, 212, ${node.firewallStrength / 100})`,
          }}
        />
      )}
      
      {/* Honeypot glow */}
      {node.isHoneypot && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-pink-400"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            boxShadow: '0 0 30px rgba(244, 114, 182, 0.8)',
          }}
        />
      )}
      
      {/* Healing wave indicator */}
      {node.healingWaveProgress > 0 && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-emerald-400"
          animate={{
            scale: [1, 1 + node.healingWaveProgress / 100, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      
      {/* Main node body */}
      <motion.div
        className="relative w-full h-full rounded-full shadow-cyberpunk border-2"
        style={{
          background: node.isHoneypot 
            ? 'linear-gradient(to bottom right, #f472b6, #db2777)'
            : node.isPatchNode
            ? 'linear-gradient(to bottom right, #22d3ee, #2563eb)'
            : `linear-gradient(to bottom right, ${colorMap.from}, ${colorMap.to})`,
          borderColor: node.isHoneypot ? '#f9a8d4' : node.isPatchNode ? '#67e8f9' : colorMap.border,
        }}
        animate={{ 
          boxShadow: node.isHoneypot 
            ? ['0 0 20px rgba(244, 114, 182, 0.8)', '0 0 40px rgba(244, 114, 182, 1)', '0 0 20px rgba(244, 114, 182, 0.8)']
            : [
                `0 0 16px 4px ${colorMap.from}99`,
                `0 0 32px 8px ${colorMap.to}CC`,
                `0 0 16px 4px ${colorMap.from}99`
              ]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {/* Health indicator */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-black border border-gray-600">
          <div 
            className="w-full h-full rounded-full"
            style={{ 
              backgroundColor: node.isHoneypot ? '#f472b6' : colorMap.from,
              opacity: node.health / 100 
            }}
          />
        </div>
        
        {/* Immune indicator */}
        {node.immuneToAttacks.length > 0 && (
          <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </motion.div>
      {showDetails && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-4 bg-black/95 border border-cyan-500 rounded-lg backdrop-blur-sm min-w-64 z-50 shadow-cyberpunk" style={{ minWidth: 240, maxWidth: 320 }}>
          <div className="text-xs font-mono space-y-2">
            <div className={`text-cyan-300 font-bold text-sm`}>{node.id.toUpperCase()}</div>
            <div className="text-gray-300">Role: <span className="text-blue-400">{node.role}</span></div>
            <div className="text-gray-300">Status: <span className={`text-cyan-400`}>{node.status}</span></div>
            <div className="text-gray-300">Health: <span className="text-emerald-400">{Math.round(node.health)}%</span></div>
            <div className="text-gray-300">Pain: <span className="text-pink-400">{Math.round(node.pain)}%</span></div>
            <div className="text-gray-300">Uptime: <span className="text-amber-400">{Math.round(node.uptime)}%</span></div>
            
            {/* Performance Metrics */}
            <div className="border-t border-gray-600 pt-2 mt-2">
              <div className="text-cyan-300 font-semibold mb-1">Performance</div>
              <div className="text-gray-300">CPU: <span className="text-orange-400">{Math.round(node.metrics.cpuUsage)}%</span></div>
              <div className="text-gray-300">Memory: <span className="text-purple-400">{Math.round(node.metrics.memoryUsage)}%</span></div>
              <div className="text-gray-300">Latency: <span className="text-yellow-400">{Math.round(node.metrics.networkLatency)}ms</span></div>
              <div className="text-gray-300">Throughput: <span className="text-green-400">{Math.round(node.metrics.throughput)}/s</span></div>
              <div className="text-gray-300">Error Rate: <span className="text-red-400">{node.metrics.errorRate.toFixed(2)}%</span></div>
            </div>

            {/* Network Info */}
            <div className="border-t border-gray-600 pt-2">
              <div className="text-cyan-300 font-semibold mb-1">Network</div>
              <div className="text-gray-300">Region: <span className="text-blue-300">{node.region}</span></div>
              <div className="text-gray-300">Layer: <span className="text-cyan-300">{node.layer}</span></div>
              <div className="text-gray-300">Connections: <span className="text-green-300">{node.connections.length}</span></div>
              <div className="text-gray-300">Strategy: <span className="text-cyan-300">{node.learningStrategy}</span></div>
            </div>

            {/* Status Indicators */}
            {node.status === 'healing' && (
              <div className="text-amber-400 animate-pulse">🔄 Auto-repair active</div>
            )}
            {node.status === 'adapting' && (
              <div className="text-cyan-400 animate-pulse">🧠 Neural optimization</div>
            )}
            {node.status === 'attacked' && (
              <div className="text-red-400 animate-pulse">⚠️ Threat mitigation</div>
            )}
            {node.status === 'maintenance' && (
              <div className="text-blue-400 animate-pulse">🔧 Maintenance mode</div>
            )}
            {node.status === 'overloaded' && (
              <div className="text-orange-400 animate-pulse">⚡ Resource overload</div>
            )}
          </div>
        </div>
      )}
      <style>{`
        .ripple {
          position: absolute;
          width: 40px;
          height: 40px;
          background: rgba(0,255,255,0.25);
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          animation: ripple-effect 0.6s linear;
        }
        @keyframes ripple-effect {
          0% { opacity: 0.7; transform: scale(0.5); }
          100% { opacity: 0; transform: scale(2.5); }
        }
        .shadow-cyberpunk {
          box-shadow: 0 0 12px 2px #0ff, 0 0 32px 4px #f0f, 0 0 2px 0 #fff;
        }
      `}</style>
    </motion.div>
  );
};

export default NeuralNode;
