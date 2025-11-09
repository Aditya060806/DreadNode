import React from 'react';
import { AttackType, ChaosMode } from '../store/simulationStore';
import { useSimulationStore } from '../store/simulationStore';

interface ControlPanelProps {
  onSimulateAttack: (type: AttackType) => void;
  onSimulateFailure: () => void;
  reflexMode: 'auto' | 'manual';
  setReflexMode: (mode: 'auto' | 'manual') => void;
  isDemoMode: boolean;
  setDemoMode: (demo: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  isPaused: boolean;
  setPaused: (paused: boolean) => void;
}

const attackTypes: AttackType[] = [
  'DDoS', 
  'AI Corruption', 
  'Node Overload', 
  'Web3 Congestion',
  'Memory Leak',
  'CPU Spike',
  'Network Partition',
  'Data Corruption',
  'DNS Poisoning',
  'Insider Exploit',
  'Zero-Day'
];

const ControlPanel = ({ 
  onSimulateAttack, 
  onSimulateFailure, 
  reflexMode, 
  setReflexMode, 
  isDemoMode, 
  setDemoMode,
  simulationSpeed,
  setSimulationSpeed,
  isPaused,
  setPaused
}: ControlPanelProps) => {
  const [selectedAttack, setSelectedAttack] = React.useState<AttackType>(attackTypes[0]);
  const chaosMode = useSimulationStore(s => s.chaosMode);
  const setChaosMode = useSimulationStore(s => s.setChaosMode);
  const simulateMultiVectorAttack = useSimulationStore(s => s.simulateMultiVectorAttack);
  const generateZeroDayExploit = useSimulationStore(s => s.generateZeroDayExploit);
  const createHoneypot = useSimulationStore(s => s.createHoneypot);
  const triggerCascadingHeal = useSimulationStore(s => s.triggerCascadingHeal);
  const nodes = useSimulationStore(s => s.nodes);

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-wrap gap-2 items-center bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-2 shadow-xl backdrop-blur-md animate-fade-in max-w-5xl text-xs">
      {/* Attack Selection */}
      <div className="flex items-center gap-1.5">
        <select
          className="px-2 py-1 bg-cyan-900/40 border border-cyan-500/50 text-cyan-300 rounded font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
          value={selectedAttack}
          onChange={e => setSelectedAttack(e.target.value as AttackType)}
        >
          {attackTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button
          onClick={() => onSimulateAttack(selectedAttack)}
          className="px-3 py-1.5 bg-red-900/40 border border-red-500/50 text-red-300 rounded hover:bg-red-800/60 transition-all duration-300 flex items-center gap-1 font-mono text-xs shadow-cyberpunk"
        >
          ATTACK
        </button>
      </div>

      {/* Failure Injection */}
      <button
        onClick={onSimulateFailure}
        className="px-3 py-1.5 bg-amber-900/40 border border-amber-500/50 text-amber-300 rounded hover:bg-amber-800/60 transition-all duration-300 flex items-center gap-1 font-mono text-xs shadow-cyberpunk"
      >
        FAILURE
      </button>

      {/* Simulation Controls */}
      <div className="flex items-center gap-1.5">
        <span className="text-cyan-300 font-mono text-xs">Speed:</span>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={simulationSpeed}
          onChange={e => setSimulationSpeed(parseFloat(e.target.value))}
          className="w-16"
        />
        <span className="text-cyan-300 font-mono text-xs w-8">{simulationSpeed.toFixed(1)}x</span>
      </div>

      <button
        onClick={() => setPaused(!isPaused)}
        className={`px-2 py-1 rounded font-mono text-xs border transition ${
          isPaused 
            ? 'bg-green-800/60 border-green-400 text-green-200' 
            : 'bg-red-800/60 border-red-400 text-red-200'
        }`}
      >
        {isPaused ? '▶' : '⏸'}
      </button>

      {/* Mode Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setReflexMode(reflexMode === 'auto' ? 'manual' : 'auto')}
          className={`px-2 py-1 rounded font-mono text-xs border transition ${reflexMode === 'auto' ? 'bg-emerald-800/60 border-emerald-400 text-emerald-200' : 'bg-gray-800/60 border-gray-400 text-gray-200'}`}
        >
          {reflexMode === 'auto' ? 'AUTO' : 'MAN'}
        </button>
      </div>
      
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setDemoMode(!isDemoMode)}
          className={`px-2 py-1 rounded font-mono text-xs border transition ${isDemoMode ? 'bg-pink-800/60 border-pink-400 text-pink-200' : 'bg-gray-800/60 border-gray-400 text-gray-200'}`}
        >
          DEMO
        </button>
      </div>

      {/* Chaos Mode */}
      <div className="flex items-center gap-1.5">
        <select
          className="px-2 py-1 bg-cyan-900/40 border border-cyan-500/50 text-cyan-300 rounded font-mono text-xs focus:outline-none"
          value={chaosMode}
          onChange={e => setChaosMode(e.target.value as ChaosMode)}
        >
          <option value="single">Single</option>
          <option value="multi-vector">Multi</option>
          <option value="cascading">Cascade</option>
        </select>
      </div>

      {/* Advanced Controls */}
      <div className="flex items-center gap-1.5 border-l border-cyan-500/30 pl-2">
        <button
          onClick={simulateMultiVectorAttack}
          className="px-2 py-1 bg-purple-900/40 border border-purple-500/50 text-purple-300 rounded hover:bg-purple-800/60 transition-all duration-300 font-mono text-xs"
          title="Multi-Vector Attack"
        >
          MV
        </button>
        <button
          onClick={generateZeroDayExploit}
          className="px-2 py-1 bg-orange-900/40 border border-orange-500/50 text-orange-300 rounded hover:bg-orange-800/60 transition-all duration-300 font-mono text-xs"
          title="Zero-Day Exploit"
        >
          ZD
        </button>
        <button
          onClick={createHoneypot}
          className="px-2 py-1 bg-pink-900/40 border border-pink-500/50 text-pink-300 rounded hover:bg-pink-800/60 transition-all duration-300 font-mono text-xs"
          title="Create Honeypot"
        >
          HP
        </button>
        <button
          onClick={() => {
            const attackedNode = nodes.find(n => n.status === 'attacked');
            if (attackedNode) triggerCascadingHeal(attackedNode.id);
          }}
          className="px-2 py-1 bg-emerald-900/40 border border-emerald-500/50 text-emerald-300 rounded hover:bg-emerald-800/60 transition-all duration-300 font-mono text-xs"
          title="Cascade Heal"
        >
          HEAL
        </button>
      </div>
      <style>{`
        .shadow-cyberpunk {
          box-shadow: 0 0 12px 2px #0ff, 0 0 32px 4px #f0f, 0 0 2px 0 #fff;
        }
        .animate-fade-in {
          animation: fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ControlPanel;
