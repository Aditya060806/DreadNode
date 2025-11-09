import { useSimulationStore } from '../store/simulationStore';
import { useEffect, useRef, useState } from 'react';
import NeuralNode from './NeuralNode';
import StatusDisplay from './StatusDisplay';
import SystemMessage from './SystemMessage';
import NeuralPathway from './NeuralPathway';
import ControlPanel from './ControlPanel';
import NetworkBackground from './NetworkBackground';
import NodeDetailsModal from './NodeDetailsModal';
import MonitoringDashboard from './MonitoringDashboard';
import DataFlowVisualization from './DataFlowVisualization';
import MachineLearningEngine from './MachineLearningEngine';
import ConfigurationPanel from './ConfigurationPanel';
import HistoricalAnalysis from './HistoricalAnalysis';
import AttackRadar from './AttackRadar';
import EfficiencyMeter from './EfficiencyMeter';
import AttackPrediction from './AttackPrediction';
import HealingWaveVisualization from './HealingWaveVisualization';
import ThreatIntelligencePanel from './ThreatIntelligencePanel';
import ForensicsPanel from './ForensicsPanel';
import RecoverySystemStatus from './RecoverySystemStatus';

const DreadNode = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Zustand store selectors
  const nodes = useSimulationStore(s => s.nodes);
  const logs = useSimulationStore(s => s.logs);
  const globalThreat = useSimulationStore(s => s.globalThreat);
  const simulateAttack = useSimulationStore(s => s.simulateAttack);
  const injectFailure = useSimulationStore(s => s.injectFailure);
  const reflexMode = useSimulationStore(s => s.reflexMode);
  const setReflexMode = useSimulationStore(s => s.setReflexMode);
  const isDemoMode = useSimulationStore(s => s.isDemoMode);
  const setDemoMode = useSimulationStore(s => s.setDemoMode);
  const simulationSpeed = useSimulationStore(s => s.simulationSpeed);
  const setSimulationSpeed = useSimulationStore(s => s.setSimulationSpeed);
  const isPaused = useSimulationStore(s => s.isPaused);
  const setPaused = useSimulationStore(s => s.setPaused);

  // Start simulation engine on mount
  useEffect(() => {
    import('../store/simulationStore').then(mod => {
      mod.startSimulationEngine();
    });
    return () => {
      import('../store/simulationStore').then(mod => {
        mod.stopSimulationEngine();
      });
    };
  }, []);

  // Calculate connection strength for visualization - optimized for thin wire display
  const getConnectionStrength = (node1: any, node2: any) => {
    const distance = Math.sqrt((node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2);
    // Normalize distance-based strength (closer nodes = stronger connection)
    const distanceStrength = Math.max(0.4, 1 - (distance / 80));
    // Activity-based strength (higher throughput = more active connection)
    const activityStrength = Math.min(1, (node1.metrics.throughput + node2.metrics.throughput) / 1500);
    // Combine with preference for active connections
    return Math.min(1, Math.max(0.5, distanceStrength * 0.7 + activityStrength * 0.5));
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-hidden w-full h-full flex">
      {/* Left Sidebar - Controls & Monitoring - Compact */}
      <div className={`${showSidebar ? 'w-64' : 'w-0'} transition-all duration-300 bg-black/90 border-r border-cyan-500/20 overflow-y-auto flex flex-col z-40`}>
        {showSidebar && (
          <>
            {/* Status Display */}
            <div className="p-2 border-b border-cyan-500/20">
              <StatusDisplay isOnline={true} threatLevel={globalThreat} />
            </div>

            {/* Monitoring Dashboard */}
            <div className="p-2 border-b border-cyan-500/20">
              <MonitoringDashboard />
            </div>

            {/* Efficiency Meter */}
            <div className="p-2 border-b border-cyan-500/20">
              <EfficiencyMeter />
            </div>

            {/* Attack Prediction */}
            <div className="p-2 border-b border-cyan-500/20">
              <AttackPrediction />
            </div>

            {/* Machine Learning Engine */}
            <div className="p-2 border-b border-cyan-500/20">
              <MachineLearningEngine />
            </div>

            {/* Attack Radar */}
            <div className="p-2 border-b border-cyan-500/20">
              <AttackRadar />
            </div>

            {/* Recovery System Status */}
            <div className="p-2">
              <RecoverySystemStatus />
            </div>
          </>
        )}
      </div>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-50 bg-cyan-900/80 border border-cyan-500/50 text-cyan-300 px-2 py-8 rounded-r-lg hover:bg-cyan-800/80 transition-all"
      >
        {showSidebar ? '◀' : '▶'}
      </button>

      {/* Main Network View */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background */}
        <NetworkBackground />
        <div className="absolute inset-0 pointer-events-none z-10" style={{background: 'repeating-linear-gradient(180deg, #0ff1 0 1px, transparent 1px 8px)', opacity: 0.03, mixBlendMode: 'screen'}} />

        {/* SVG Container for Pathways - Clean wire network with perfect alignment */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-20" 
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <style>{`
              .neural-pathway-group {
                pointer-events: none;
              }
            `}</style>
          </defs>
          {/* Neural Pathways - Straight lines for perfect node alignment */}
          {nodes.map(node => 
            node.connections.map(connId => {
              const targetNode = nodes.find(n => n.id === connId);
              if (!targetNode) return null;
              
              // Only render each connection once (avoid duplicates)
              if (node.id > targetNode.id) return null;
              
              const strength = getConnectionStrength(node, targetNode);
              // Active if nodes are processing data or under stress
              const isActive = node.status !== 'healthy' || targetNode.status !== 'healthy' || 
                              node.metrics.throughput > 600 || targetNode.metrics.throughput > 600 ||
                              node.metrics.cpuUsage > 50 || targetNode.metrics.cpuUsage > 50;
              
              // Use exact percentage coordinates - nodes will align perfectly at endpoints
              return (
                <NeuralPathway
                  key={`${node.id}-${connId}`}
                  from={{ x: node.x, y: node.y }}
                  to={{ x: targetNode.x, y: targetNode.y }}
                  active={isActive}
                  strength={strength}
                />
              );
            })
          )}
        </svg>

        {/* Healing Waves */}
        <HealingWaveVisualization />

        {/* Data Flow Visualization */}
        <DataFlowVisualization />

        {/* Neural Nodes */}
        {nodes.map(node => (
          <NeuralNode
            key={node.id}
            node={node}
            onNodeClick={setSelectedNode}
            isUnderAttack={globalThreat > 50}
          />
        ))}

        {/* System Messages - Right side */}
        <div className="absolute right-4 top-20 space-y-2 max-w-xs max-h-[calc(100vh-8rem)] overflow-y-auto z-30">
          {logs.slice(-8).map(message => (
            <SystemMessage 
              key={message.id} 
              message={message} 
              isGlitching={isGlitching && Math.random() < 0.3}
            />
          ))}
        </div>

        {/* Control Panel - Bottom Center */}
        <ControlPanel 
          onSimulateAttack={simulateAttack}
          onSimulateFailure={injectFailure}
          reflexMode={reflexMode}
          setReflexMode={setReflexMode}
          isDemoMode={isDemoMode}
          setDemoMode={setDemoMode}
          simulationSpeed={simulationSpeed}
          setSimulationSpeed={setSimulationSpeed}
          isPaused={isPaused}
          setPaused={setPaused}
        />
      </div>

      {/* Configuration Panel */}
      <ConfigurationPanel />
      
      {/* Historical Analysis */}
      <HistoricalAnalysis />
      
      {/* Threat Intelligence Panel */}
      <ThreatIntelligencePanel />
      
      {/* Forensics Panel */}
      <ForensicsPanel />
      
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
