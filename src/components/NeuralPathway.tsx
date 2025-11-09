import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface NeuralPathwayProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  active: boolean;
  strength?: number;
}

const NeuralPathway = ({ from, to, active, strength = 1 }: NeuralPathwayProps) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const uniqueId = useRef(`path-${Math.random().toString(36).slice(2, 9)}`);

  // Calculate path length for animation
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [from, to]);

  // Use perfectly straight lines for precise alignment with nodes
  // Lines connect exactly at node center coordinates (no offset needed)
  // The SVG viewBox (0-100) matches the node percentage coordinates perfectly
  const pathData = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

  // Thin wire colors - subtle and clean
  const strokeColor = active 
    ? (strength > 0.7 ? '#06b6d4' : strength > 0.4 ? '#3b82f6' : '#60a5fa')
    : '#475569'; // Darker gray for inactive
  
  // Very thin stroke width - like actual network cables
  const strokeWidth = active ? Math.max(0.5, strength * 0.8) : 0.35;
  const opacity = active ? Math.max(0.25, Math.min(0.6, strength * 0.5)) : 0.12;

  return (
    <g className="neural-pathway-group">
      <defs>
        {/* Subtle gradient for depth */}
        <linearGradient id={`gradient-${uniqueId.current}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={opacity * 0.8} />
          <stop offset="50%" stopColor={strokeColor} stopOpacity={opacity} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={opacity * 0.8} />
        </linearGradient>
        {/* Very subtle glow - just enough to see the wire */}
        <filter id={`glow-${uniqueId.current}`}>
          <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main wire path - thin and sleek */}
      <motion.path
        ref={pathRef}
        d={pathData}
        fill="none"
        stroke={`url(#gradient-${uniqueId.current})`}
        strokeWidth={strokeWidth}
        filter={active ? `url(#glow-${uniqueId.current})` : 'none'}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: opacity,
        }}
        transition={{ 
          pathLength: { duration: 0.8, ease: 'easeInOut' },
          opacity: { duration: 0.5 },
        }}
        style={{ 
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          vectorEffect: 'non-scaling-stroke', // Keep stroke consistent
          // Ensure lines connect exactly at node centers
          strokeDasharray: active ? 'none' : '2,2' // Dashed for inactive, solid for active
        }}
      />
      
      {/* Tiny data particles - only for very active connections */}
      {active && strength > 0.8 && pathLength > 0 && (
        <circle
          r="1"
          fill={strokeColor}
          opacity={0.7}
        >
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path={pathData}
          />
          <animate
            attributeName="opacity"
            values="0.3;0.9;0.3"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  );
};

export default NeuralPathway;
