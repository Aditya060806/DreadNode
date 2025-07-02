import { useState, useEffect } from 'react';
import { X, Activity, Shield, Brain } from 'lucide-react';
import { NodeData } from '../types/NodeData';

interface NodeDetailsModalProps {
  node: NodeData;
  isOpen: boolean;
  onClose: () => void;
}

const NodeDetailsModal = ({ node, isOpen, onClose }: NodeDetailsModalProps) => {
  const [reflexDelay, setReflexDelay] = useState(0);
  const [currentLoad, setCurrentLoad] = useState(0);
  const [mutationType, setMutationType] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      // Simulate dynamic bio metrics
      const interval = setInterval(() => {
        setReflexDelay(Math.random() * 50 + 10); // 10-60ms
        setCurrentLoad(Math.random() * 100);
        setMutationType(['Adaptive', 'Defensive', 'Regenerative', 'Predictive'][Math.floor(Math.random() * 4)]);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'emerald';
      case 'healing': return 'amber';
      case 'attacked': return 'red';
      case 'adapting': return 'cyan';
      default: return 'gray';
    }
  };
  
  const color = getStatusColor(node.status);
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className={`bg-black border border-${color}-500/50 rounded-lg p-6 max-w-md w-full mx-4 bio-metrics-glow`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-${color}-300 font-mono text-lg font-bold`}>
            {node.id.toUpperCase()} - BIO METRICS
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4 font-mono text-sm">
          {/* Core Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 text-${color}-400`} />
                <span className="text-gray-300">Neural Health</span>
              </div>
              <div className={`text-${color}-400 text-lg font-bold`}>
                {Math.round(node.health)}%
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 text-${color}-400`} />
                <span className="text-gray-300">Status</span>
              </div>
              <div className={`text-${color}-400 text-lg font-bold capitalize`}>
                {node.status}
              </div>
            </div>
          </div>
          
          {/* Dynamic Metrics */}
          <div className="border-t border-gray-700 pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Current Load:</span>
              <span className={`text-${color}-400`}>{Math.round(currentLoad)}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Last Reflex Delay:</span>
              <span className={`text-${color}-400`}>{reflexDelay.toFixed(1)}ms</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Mutation Type:</span>
              <span className={`text-${color}-400`}>{mutationType}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Connections:</span>
              <span className={`text-${color}-400`}>{node.connections.length} active</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Last Activity:</span>
              <span className={`text-${color}-400`}>
                {Math.round((Date.now() - node.lastActivity) / 1000)}s ago
              </span>
            </div>
          </div>
          
          {/* Neural Activity Visualization */}
          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className={`w-4 h-4 text-${color}-400`} />
              <span className="text-gray-300">Neural Activity</span>
            </div>
            <div className="h-16 bg-gray-900 rounded flex items-end gap-1 p-2">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`bg-${color}-400 rounded-sm flex-1 neural-bar`}
                  style={{
                    height: `${Math.random() * 80 + 20}%`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .bio-metrics-glow {
          box-shadow: 0 0 30px rgba(var(--${color}-500), 0.3);
        }
        
        .neural-bar {
          animation: neural-pulse 2s ease-in-out infinite;
        }
        
        @keyframes neural-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default NodeDetailsModal;