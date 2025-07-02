
import { useState, useRef } from 'react';
import NeuralNode from './NeuralNode';
import StatusDisplay from './StatusDisplay';
import SystemMessage from './SystemMessage';
import NeuralPathway from './NeuralPathway';
import ControlPanel from './ControlPanel';
import NetworkBackground from './NetworkBackground';
import Web3Placeholder from './Web3Placeholder';
import NodeDetailsModal from './NodeDetailsModal';
import { useNodeNetwork } from '../hooks/useNodeNetwork';

const DreadNode = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    nodes,
    systemMessages,
    globalThreat,
    simulateAttack,
    simulateFailure
  } = useNodeNetwork();

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-hidden">
      <NetworkBackground />

      {/* Status Display */}
      <StatusDisplay isOnline={isOnline} threatLevel={globalThreat} />

      {/* Neural Pathways */}
      {nodes.map(node => 
        node.connections.map(connId => {
          const targetNode = nodes.find(n => n.id === connId);
          if (!targetNode) return null;
          return (
            <NeuralPathway
              key={`${node.id}-${connId}`}
              from={{ x: node.x, y: node.y }}
              to={{ x: targetNode.x, y: targetNode.y }}
              active={node.status !== 'healthy' || targetNode.status !== 'healthy'}
            />
          );
        })
      )}

      {/* Neural Nodes */}
      {nodes.map(node => (
        <NeuralNode
          key={node.id}
          node={node}
          onNodeClick={(nodeData) => {
            setSelectedNode(nodeData);
          }}
          isUnderAttack={globalThreat > 50}
        />
      ))}

      {/* System Messages */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 space-y-2 max-w-sm max-h-96 overflow-y-auto">
        {systemMessages.map(message => (
          <SystemMessage 
            key={message.id} 
            message={message} 
            isGlitching={isGlitching && Math.random() < 0.3}
          />
        ))}
      </div>

      {/* Control Panel */}
      <ControlPanel 
        onSimulateAttack={simulateAttack}
        onSimulateFailure={simulateFailure}
      />

      {/* Future Web3 Placeholder */}
      <Web3Placeholder />
      
      {/* Node Details Modal */}
      <NodeDetailsModal
        node={selectedNode}
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
};

export default DreadNode;
