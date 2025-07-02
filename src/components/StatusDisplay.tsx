
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
    if (threatLevel > 70) return 'red';
    if (threatLevel > 30) return 'amber';
    return 'emerald';
  };

  const threatColor = getThreatColor();

  return (
    <div className="absolute top-6 left-6 space-y-4">
      {/* Main Status */}
      <div className={`font-mono text-2xl font-bold transition-all duration-300 ${glitch ? 'animate-pulse text-red-400' : 'text-emerald-400'}`}>
        <div className={`flex items-center gap-3 ${glitch ? 'filter blur-sm' : ''}`}>
          <Shield className={`w-8 h-8 ${isOnline ? 'text-emerald-400' : 'text-red-400'} ${glitch ? 'animate-spin' : ''}`} />
          <span className={glitch ? 'glitch-text' : ''}>
            DREADNODE: {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* System Stats */}
      <div className="space-y-2 font-mono text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-gray-300">Neural Network: </span>
          <span className="text-emerald-400">Active</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 bg-${threatColor}-400 rounded-full animate-pulse`} />
          <span className="text-gray-300">Threat Level: </span>
          <span className={`text-${threatColor}-400`}>{threatLevel}%</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-gray-300">AI Agents: </span>
          <span className="text-cyan-400">7 Active</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <span className="text-gray-300">Blockchain: </span>
          <span className="text-amber-400">Syncing...</span>
        </div>
      </div>

      {/* Threat Indicator */}
      {threatLevel > 0 && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
          <div className="text-red-300 font-mono text-xs font-bold">DEFENSIVE PROTOCOL ACTIVE</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r from-${threatColor}-500 to-${threatColor}-400 transition-all duration-500`}
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
