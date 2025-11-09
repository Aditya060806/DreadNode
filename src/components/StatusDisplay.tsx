import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

interface StatusDisplayProps {
  isOnline: boolean;
  threatLevel: number;
}

const StatusDisplay = ({ isOnline, threatLevel }: StatusDisplayProps) => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1 || threatLevel > 50) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 150);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, [threatLevel]);

  const getThreatColor = () => {
    if (threatLevel > 70) return 'text-red-400';
    if (threatLevel > 30) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const threatColor = getThreatColor();

  return (
    <div className="space-y-2">
      {/* Main Status */}
      <div className={`font-mono text-sm font-bold transition-all duration-300 ${glitch ? 'animate-pulse text-red-400' : 'text-emerald-400'}`}>
        <div className={`flex items-center gap-1.5 ${glitch ? 'filter blur-sm' : ''}`}>
          <Shield className={`w-4 h-4 ${isOnline ? 'text-emerald-400' : 'text-red-400'} ${glitch ? 'animate-spin' : ''}`} />
          <span className={glitch ? 'glitch-text' : ''}>
            DREADNODE: {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* System Stats */}
      <div className="space-y-1 font-mono text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-gray-300">Neural Network:</span>
          </div>
          <span className="text-emerald-400">Active</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${threatLevel > 70 ? 'bg-red-400' : threatLevel > 30 ? 'bg-amber-400' : 'bg-emerald-400'} rounded-full animate-pulse`} />
            <span className="text-gray-300">Threat Level:</span>
          </div>
          <span className={threatColor}>{threatLevel.toFixed(0)}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-gray-300">AI Agents:</span>
          </div>
          <span className="text-cyan-400">7 Active</span>
        </div>
      </div>

      {/* Threat Indicator */}
      {threatLevel > 0 && (
        <div className="mt-2 p-2 bg-red-900/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
          <div className="text-red-300 font-mono text-xs font-bold mb-1">DEFENSIVE PROTOCOL ACTIVE</div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                threatLevel > 70 ? 'bg-red-500' : threatLevel > 30 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${threatLevel}%` }}
            />
          </div>
        </div>
      )}

      <style>{`
        .glitch-text {
          animation: glitch 0.3s ease-in-out;
        }
        
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </div>
  );
};

export default StatusDisplay;
