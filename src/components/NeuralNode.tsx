
import { useState, useEffect, useRef } from 'react';
import { NodeData } from '../types/NodeData';

interface NeuralNodeProps {
  node: NodeData;
  onNodeClick: (node: NodeData) => void;
  isUnderAttack?: boolean;
  reflexTrigger?: boolean;
}

const NeuralNode = ({ node, onNodeClick, isUnderAttack = false, reflexTrigger = false }: NeuralNodeProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [heartbeatPhase, setHeartbeatPhase] = useState(0);
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // Unique heartbeat for each node
  const heartbeatOffset = useRef(Math.random() * 3000).current;
  
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      setHeartbeatPhase(prev => (prev + 1) % 2);
    }, 1500 + heartbeatOffset);
    
    return () => clearInterval(heartbeatInterval);
  }, [heartbeatOffset]);
  
  // Attack reaction effects
  useEffect(() => {
    if (node.status === 'attacked' || isUnderAttack) {
      setIsShaking(true);
      const shakeTimer = setTimeout(() => setIsShaking(false), 2000);
      return () => clearTimeout(shakeTimer);
    }
  }, [node.status, isUnderAttack]);
  
  // Reflex trigger effect
  useEffect(() => {
    if (reflexTrigger && nodeRef.current) {
      nodeRef.current.style.animation = 'reflex-pulse 0.5s ease-out';
      setTimeout(() => {
        if (nodeRef.current) {
          nodeRef.current.style.animation = '';
        }
      }, 500);
    }
  }, [reflexTrigger]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'emerald';
      case 'healing': return 'amber';
      case 'attacked': return 'red';
      case 'adapting': return 'cyan';
      default: return 'gray';
    }
  };

  const getStatusGlow = (status: string) => {
    const color = getStatusColor(status);
    return `drop-shadow-[0_0_15px_rgb(var(--${color}-500))] drop-shadow-[0_0_30px_rgb(var(--${color}-500)/0.5)]`;
  };

  const color = getStatusColor(node.status);
  const isCore = node.id.includes('core');
  const size = isCore ? 'w-16 h-16' : 'w-12 h-12';

  return (
    <>
      <div
        ref={nodeRef}
        className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-110 ${
          isShaking ? 'animate-shake' : ''
        } ${heartbeatPhase ? 'heartbeat-glow' : ''}`}
        style={{ left: `${node.x}%`, top: `${node.y}%` }}
        onClick={() => {
          onNodeClick(node);
          setShowDetails(!showDetails);
        }}
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        {/* Node Core */}
        <div className={`${size} relative`}>
          {/* Outer pulse ring */}
          <div className={`absolute inset-0 rounded-full border-2 border-${color}-500 animate-ping opacity-75`} />
          
          {/* Breathing ring */}
          <div 
            className={`absolute inset-0 rounded-full border border-${color}-400 animate-pulse`}
            style={{ animation: 'breathe 3s ease-in-out infinite' }}
          />
          
          {/* Main node body */}
          <div 
            className={`relative w-full h-full rounded-full bg-gradient-to-br from-${color}-400 to-${color}-600 border border-${color}-300 ${getStatusGlow(node.status)}`}
            style={{
              background: `radial-gradient(circle at 30% 30%, rgb(var(--${color}-400)), rgb(var(--${color}-600)))`,
              filter: `${getStatusGlow(node.status)} brightness(${node.health / 100 + 0.5})`
            }}
          >
            {/* Inner neural activity */}
            <div className={`absolute inset-2 rounded-full bg-gradient-to-tr from-${color}-300/30 to-transparent animate-pulse`} />
            
            {/* Health indicator */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-black border border-gray-600">
              <div 
                className={`w-full h-full rounded-full bg-${color}-400`}
                style={{ opacity: node.health / 100 }}
              />
            </div>
          </div>
        </div>

        {/* Node Details Popup */}
        {showDetails && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-3 bg-black/90 border border-gray-600 rounded-lg backdrop-blur-sm min-w-48 z-50">
            <div className="text-xs font-mono space-y-1">
              <div className={`text-${color}-300 font-bold`}>{node.id.toUpperCase()}</div>
              <div className="text-gray-300">Status: <span className={`text-${color}-400`}>{node.status}</span></div>
              <div className="text-gray-300">Health: <span className={`text-${color}-400`}>{Math.round(node.health)}%</span></div>
              <div className="text-gray-300">Connections: {node.connections.length}</div>
              {node.status === 'healing' && (
                <div className={`text-${color}-400 animate-pulse`}>🔄 Auto-repair active</div>
              )}
              {node.status === 'adapting' && (
                <div className={`text-${color}-400 animate-pulse`}>🧠 Neural optimization</div>
              )}
              {node.status === 'attacked' && (
                <div className={`text-${color}-400 animate-pulse`}>⚠️ Threat mitigation</div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0) translateY(0); }
          10% { transform: translateX(-2px) translateY(-1px); }
          20% { transform: translateX(2px) translateY(1px); }
          30% { transform: translateX(-1px) translateY(-2px); }
          40% { transform: translateX(1px) translateY(2px); }
          50% { transform: translateX(-2px) translateY(1px); }
          60% { transform: translateX(2px) translateY(-1px); }
          70% { transform: translateX(-1px) translateY(2px); }
          80% { transform: translateX(1px) translateY(-2px); }
          90% { transform: translateX(-2px) translateY(-1px); }
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out infinite;
        }
        
        .heartbeat-glow {
          filter: brightness(1.2) drop-shadow(0 0 8px currentColor);
        }
        
        @keyframes reflex-pulse {
          0% { transform: scale(1) translateX(-50%) translateY(-50%); }
          50% { transform: scale(1.3) translateX(-50%) translateY(-50%); filter: brightness(2); }
          100% { transform: scale(1) translateX(-50%) translateY(-50%); }
        }
      `}</style>
    </>
  );
};

export default NeuralNode;
