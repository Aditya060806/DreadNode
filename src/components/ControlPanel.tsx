
import { Shield, Zap } from 'lucide-react';

interface ControlPanelProps {
  onSimulateAttack: () => void;
  onSimulateFailure: () => void;
}

const ControlPanel = ({ onSimulateAttack, onSimulateFailure }: ControlPanelProps) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
      <button
        onClick={onSimulateAttack}
        className="px-6 py-3 bg-red-900/40 border border-red-500/50 text-red-300 rounded-lg backdrop-blur-sm hover:bg-red-800/60 transition-all duration-300 flex items-center gap-2 font-mono text-sm"
      >
        <Shield className="w-4 h-4" />
        SIMULATE ATTACK
      </button>
      <button
        onClick={onSimulateFailure}
        className="px-6 py-3 bg-amber-900/40 border border-amber-500/50 text-amber-300 rounded-lg backdrop-blur-sm hover:bg-amber-800/60 transition-all duration-300 flex items-center gap-2 font-mono text-sm"
      >
        <Zap className="w-4 h-4" />
        INJECT FAILURE
      </button>
    </div>
  );
};

export default ControlPanel;
