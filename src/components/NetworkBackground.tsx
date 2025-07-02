
const NetworkBackground = () => {
  return (
    <>
      {/* Breathing digital cortex background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-cyan-900/20 cortex-breathing" />
        <div className="neural-grid breathing-grid" />
        <div className="cortex-pattern" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <style>{`
        .neural-grid {
          background-image: 
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-pulse 4s ease-in-out infinite;
        }
        
        .breathing-grid {
          animation: grid-breathe 6s ease-in-out infinite;
        }
        
        .cortex-breathing {
          animation: cortex-breathe 8s ease-in-out infinite;
        }
        
        .cortex-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(239, 68, 68, 0.03) 0%, transparent 30%),
            radial-gradient(circle at 60% 80%, rgba(245, 158, 11, 0.03) 0%, transparent 30%);
          animation: cortex-pulse 12s ease-in-out infinite;
        }
        
        @keyframes grid-pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes grid-breathe {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.1; 
          }
          50% { 
            transform: scale(1.02);
            opacity: 0.2; 
          }
        }
        
        @keyframes cortex-breathe {
          0%, 100% { 
            filter: brightness(1) hue-rotate(0deg);
          }
          33% { 
            filter: brightness(1.1) hue-rotate(5deg);
          }
          66% { 
            filter: brightness(0.9) hue-rotate(-5deg);
          }
        }
        
        @keyframes cortex-pulse {
          0%, 100% { opacity: 0.8; }
          25% { opacity: 1.2; }
          50% { opacity: 0.6; }
          75% { opacity: 1.0; }
        }
      `}</style>
    </>
  );
};

export default NetworkBackground;
