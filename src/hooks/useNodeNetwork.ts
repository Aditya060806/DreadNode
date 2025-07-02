
import { useState, useEffect } from 'react';
import { NodeData, SystemMessage } from '../types/NodeData';

export const useNodeNetwork = () => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const [globalThreat, setGlobalThreat] = useState(0);

  // Initialize neural network
  useEffect(() => {
    const initialNodes: NodeData[] = [
      { id: 'core-1', x: 50, y: 30, status: 'healthy', health: 100, connections: ['node-2', 'node-4'], lastActivity: Date.now() },
      { id: 'node-2', x: 20, y: 60, status: 'healthy', health: 95, connections: ['core-1', 'node-3'], lastActivity: Date.now() },
      { id: 'node-3', x: 80, y: 60, status: 'healthy', health: 88, connections: ['node-2', 'node-5'], lastActivity: Date.now() },
      { id: 'node-4', x: 30, y: 80, status: 'healthy', health: 92, connections: ['core-1', 'node-5'], lastActivity: Date.now() },
      { id: 'node-5', x: 70, y: 85, status: 'healthy', health: 97, connections: ['node-3', 'node-4'], lastActivity: Date.now() },
      { id: 'edge-6', x: 10, y: 40, status: 'healthy', health: 85, connections: ['node-2'], lastActivity: Date.now() },
      { id: 'edge-7', x: 90, y: 45, status: 'healthy', health: 91, connections: ['node-3'], lastActivity: Date.now() },
    ];
    setNodes(initialNodes);
  }, []);

  const addSystemMessage = (text: string, priority: 'low' | 'medium' | 'high' = 'low') => {
    const newMessage: SystemMessage = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      timestamp: Date.now(),
      priority
    };
    setSystemMessages(prev => [...prev.slice(-4), newMessage]);
  };

  // Autonomous behavior simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prevNodes => 
        prevNodes.map(node => {
          const timeSinceActivity = Date.now() - node.lastActivity;
          let newStatus = node.status;
          let newHealth = node.health;

          // Random events and healing
          if (Math.random() < 0.03) { // 3% chance of event
            if (Math.random() < 0.3 && globalThreat > 0) {
              newStatus = 'attacked';
              newHealth = Math.max(20, newHealth - Math.random() * 30);
              addSystemMessage(`${node.id.toUpperCase()}: Neural misfire detected - pain cascade initiated`, 'high');
            } else if (node.status === 'attacked' || node.health < 90) {
              newStatus = 'healing';
              addSystemMessage(`${node.id.toUpperCase()}: Auto-repair protocol engaged - synaptic restoration`, 'medium');
            } else if (Math.random() < 0.1) {
              newStatus = 'adapting';
              addSystemMessage(`${node.id.toUpperCase()}: Neural pathway evolution - defensive mutation active`, 'medium');
            }
          }

          // Healing progression
          if (newStatus === 'healing' && newHealth < 95) {
            newHealth = Math.min(100, newHealth + Math.random() * 5);
            if (newHealth >= 95) {
              newStatus = 'healthy';
              addSystemMessage(`${node.id.toUpperCase()}: Neural regeneration complete - pain feedback loop closed`, 'low');
            }
          }

          // Return to healthy after adapting
          if (newStatus === 'adapting' && Math.random() < 0.2) {
            newStatus = 'healthy';
          }

          return {
            ...node,
            status: newStatus,
            health: newHealth,
            lastActivity: newStatus !== node.status ? Date.now() : node.lastActivity
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [globalThreat]);

  // Clean up old messages
  useEffect(() => {
    const cleanup = setInterval(() => {
      setSystemMessages(prev => 
        prev.filter(msg => Date.now() - msg.timestamp < 10000)
      );
    }, 5000);
    return () => clearInterval(cleanup);
  }, []);

  const simulateAttack = () => {
    setGlobalThreat(prev => Math.min(100, prev + 30));
    addSystemMessage("DREADNODE: Coordinated assault detected - initiating defensive reflexes", 'high');
    
    // 5-step reflex cascade
    setTimeout(() => addSystemMessage("NEURAL REFLEX: Node red alert - pain signals propagating", 'high'), 500);
    setTimeout(() => addSystemMessage("REFLEX ARC: Defensive pulse initiated across network", 'medium'), 1000);
    setTimeout(() => addSystemMessage("SYNAPTIC RESPONSE: Counter-attack protocols engaged", 'medium'), 1500);
    setTimeout(() => addSystemMessage("NEURAL ADAPTATION: Threat pattern memorized for future defense", 'medium'), 2000);
    setTimeout(() => addSystemMessage("DEFENSE COMPLETE: Network resilience increased", 'low'), 2500);
    
    setTimeout(() => {
      setGlobalThreat(prev => Math.max(0, prev - 10));
    }, 8000);
  };

  const simulateFailure = () => {
    const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
    setNodes(prev => 
      prev.map(node => 
        node.id === randomNode.id 
          ? { ...node, status: 'attacked', health: Math.max(10, node.health - 40) }
          : node
      )
    );
    addSystemMessage(`${randomNode.id.toUpperCase()}: Critical neural failure - synaptic cascade disrupted`, 'high');
    setTimeout(() => addSystemMessage(`EMERGENCY PROTOCOL: Rerouting neural pathways around damaged node`, 'medium'), 1000);
  };

  return {
    nodes,
    systemMessages,
    globalThreat,
    simulateAttack,
    simulateFailure
  };
};
