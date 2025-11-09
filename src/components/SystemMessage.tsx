import React from 'react';
import { motion } from 'framer-motion';

interface SystemMessageProps {
  message: {
    id: string;
    text: string;
    timestamp: number;
    priority?: 'low' | 'medium' | 'high';
    blockchainHash?: string;
    blockNumber?: number;
    syncing?: boolean;
    synced?: boolean;
  };
  isGlitching?: boolean;
}

const glitchVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 12 } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.3 } }
};

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

  // Glitchy typing effect
  const [displayed, setDisplayed] = React.useState('');
  React.useEffect(() => {
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed(message.text.slice(0, i) + (isGlitching && i % 2 === 0 ? '▌' : ''));
      i++;
      if (i > message.text.length) clearInterval(interval);
    }, 18 + Math.random() * 30);
    return () => clearInterval(interval);
  }, [message.text, isGlitching]);

  return (
    <motion.div
      variants={glitchVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`p-2 bg-black/60 border border-${priorityColor}-500/30 rounded backdrop-blur-sm transform translate-x-0 shadow-cyberpunk ${
        isGlitching ? 'memory-glitch' : ''
      }`}
      style={{ opacity }}
    >
      <div className={`text-${priorityColor}-300 font-mono text-xs whitespace-nowrap glitch-text`}>
        {displayed}
      </div>
      <div className={`text-${priorityColor}-500/50 font-mono text-xs mt-1 flex items-center gap-2`}>
        {new Date(message.timestamp).toLocaleTimeString()}
        {message.syncing && (
          <span className="ml-2 animate-pulse text-cyan-400 font-bold shimmer">Syncing...</span>
        )}
        {message.synced && message.blockchainHash && (
          <span className="ml-2 flex items-center gap-1">
            <span className="text-pink-400 font-mono text-[10px]">zkHash:</span>
            <span className="text-cyan-300 font-mono text-[10px]">{message.blockchainHash.slice(0, 8)}...{message.blockchainHash.slice(-6)}</span>
            <span className="text-emerald-400 font-mono text-[10px]">Block #{message.blockNumber}</span>
            <span className="pulse-dot" />
          </span>
        )}
      </div>
      <style>{`
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
        .shimmer {
          background: linear-gradient(90deg, #0ff 0%, #fff 50%, #0ff 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-move 1.2s linear infinite;
        }
        @keyframes shimmer-move {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .pulse-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0ff;
          box-shadow: 0 0 8px #0ff, 0 0 16px #0ff;
          animation: pulse-dot 1.2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .shadow-cyberpunk {
          box-shadow: 0 0 12px 2px #0ff, 0 0 32px 4px #f0f, 0 0 2px 0 #fff;
        }
      `}</style>
    </motion.div>
  );
};

export default SystemMessage;
