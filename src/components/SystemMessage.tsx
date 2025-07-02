
interface SystemMessageProps {
  message: {
    id: string;
    text: string;
    timestamp: number;
    priority?: 'low' | 'medium' | 'high';
  };
  isGlitching?: boolean;
}

const SystemMessage = ({ message, isGlitching = false }: SystemMessageProps) => {
  const age = Date.now() - message.timestamp;
  const opacity = Math.max(0.2, 1 - age / 10000);
  
  const getPriorityColor = () => {
    switch (message.priority) {
      case 'high': return 'red';
      case 'medium': return 'amber'; 
      default: return 'emerald';
    }
  };
  
  const priorityColor = getPriorityColor();

  return (
    <div 
      className={`p-2 bg-black/60 border border-${priorityColor}-500/30 rounded backdrop-blur-sm transform translate-x-0 animate-slide-in-right ${
        isGlitching ? 'memory-glitch' : ''
      }`}
      style={{ 
        opacity,
        animation: 'fadeInSlide 0.5s ease-out, fadeOut 10s ease-out'
      }}
    >
      <div className={`text-${priorityColor}-300 font-mono text-xs whitespace-nowrap ${
        isGlitching ? 'glitch-text' : ''
      }`}>
        {message.text}
      </div>
      <div className={`text-${priorityColor}-500/50 font-mono text-xs mt-1`}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>

      <style>{`
        @keyframes fadeInSlide {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeOut {
          0% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0.2; }
        }
        
        .memory-glitch {
          animation: memory-distortion 0.5s ease-in-out infinite alternate;
        }
        
        .glitch-text {
          animation: text-glitch 0.3s ease-in-out infinite;
        }
        
        @keyframes memory-distortion {
          0% { filter: hue-rotate(0deg) brightness(1); }
          25% { filter: hue-rotate(90deg) brightness(1.2); }
          50% { filter: hue-rotate(180deg) brightness(0.8); }
          75% { filter: hue-rotate(270deg) brightness(1.1); }
          100% { filter: hue-rotate(360deg) brightness(1); }
        }
        
        @keyframes text-glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(-1px, -1px); }
          60% { transform: translate(1px, 1px); }
          80% { transform: translate(1px, -1px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </div>
  );
};

export default SystemMessage;
