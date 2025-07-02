
import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';

const Web3Placeholder = () => {
  const [isThinking, setIsThinking] = useState(false);
  const [heartbeatGlow, setHeartbeatGlow] = useState(false);
  
  useEffect(() => {
    // Heartbeat glow every 2 seconds
    const heartbeatInterval = setInterval(() => {
      setHeartbeatGlow(true);
      setTimeout(() => setHeartbeatGlow(false), 300);
    }, 2000);
    
    // Thinking state changes
    const thinkingInterval = setInterval(() => {
      setIsThinking(prev => !prev);
    }, 4000);
    
    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(thinkingInterval);
    };
  }, []);
  
  return (
    <div className={`absolute bottom-8 right-8 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg backdrop-blur-sm transition-all duration-300 ${
      heartbeatGlow ? 'sentient-glow' : ''
    }`}>
      <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs">
        <Brain className={`w-4 h-4 ${isThinking ? 'animate-pulse' : ''} ${heartbeatGlow ? 'text-cyan-200' : ''}`} />
        <span>{isThinking ? 'AI AGENT: Processing neural patterns...' : 'AI AGENT: Decision pending...'}</span>
      </div>
      <div className="text-cyan-500/60 font-mono text-xs mt-1">
        {isThinking ? 'Neural networks synchronized' : 'Web3 Integration Ready'}
      </div>
      
      {/* Neural wave effect when thinking */}
      {isThinking && (
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="neural-wave" />
        </div>
      )}
      
      <style>{`
        .sentient-glow {
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
        }
        
        .neural-wave {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.1), transparent);
          animation: wave-ripple 2s ease-in-out infinite;
        }
        
        @keyframes wave-ripple {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Web3Placeholder;
