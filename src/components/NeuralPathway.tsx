
interface NeuralPathwayProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  active: boolean;
}

const NeuralPathway = ({ from, to, active }: NeuralPathwayProps) => {
  const pathId = `path-${from.x}-${from.y}-${to.x}-${to.y}`;
  
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        <linearGradient id={`gradient-${pathId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop 
            offset="0%" 
            stopColor={active ? "rgb(16, 185, 129)" : "rgb(75, 85, 99)"} 
            stopOpacity={active ? "0.8" : "0.3"} 
          />
          <stop 
            offset="50%" 
            stopColor={active ? "rgb(6, 182, 212)" : "rgb(55, 65, 81)"} 
            stopOpacity={active ? "0.6" : "0.2"} 
          />
          <stop 
            offset="100%" 
            stopColor={active ? "rgb(16, 185, 129)" : "rgb(75, 85, 99)"} 
            stopOpacity={active ? "0.8" : "0.3"} 
          />
        </linearGradient>
        <filter id={`glow-${pathId}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <line
        x1={`${from.x}%`}
        y1={`${from.y}%`}
        x2={`${to.x}%`}
        y2={`${to.y}%`}
        stroke={`url(#gradient-${pathId})`}
        strokeWidth={active ? "2" : "1"}
        filter={active ? `url(#glow-${pathId})` : "none"}
        className={active ? "animate-pulse" : ""}
        style={{
          strokeDasharray: active ? "5,5" : "none",
          animation: active ? "neural-flow 2s ease-in-out infinite" : "none"
        }}
      />
      
      {active && (
        <circle
          r="2"
          fill="rgb(16, 185, 129)"
          className="opacity-80"
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={`M ${from.x * window.innerWidth / 100} ${from.y * window.innerHeight / 100} L ${to.x * window.innerWidth / 100} ${to.y * window.innerHeight / 100}`}
          />
        </circle>
      )}

      <style>{`
        @keyframes neural-flow {
          0% {
            stroke-dashoffset: 0;
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 10;
            opacity: 0.5;
          }
        }
      `}</style>
    </svg>
  );
};

export default NeuralPathway;
