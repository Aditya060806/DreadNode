import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function NeuralParticles() {
  // Generate random points in a sphere
  const count = 120;
  const positions = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 18 + Math.random() * 6;
      arr.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    return new Float32Array(arr);
  }, []);
  return (
    <Points positions={positions} frustumCulled={false}>
      <PointMaterial
        color="#00fff7"
        size={0.45}
        sizeAttenuation
        depthWrite={false}
        transparent
        opacity={0.7}
      />
    </Points>
  );
}

const NetworkBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 32], fov: 60 }} style={{ width: '100vw', height: '100vh', background: 'radial-gradient(ellipse at center, #0ff2, #000 80%)' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.7} color="#0ff" />
        <NeuralParticles />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 60% 40%, #0ff3 0%, #000 80%)',
        mixBlendMode: 'screen',
        opacity: 0.18
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(135deg, #0ff1 0 2px, transparent 2px 20px)',
        opacity: 0.08
      }} />
    </div>
  );
};

export default NetworkBackground;
