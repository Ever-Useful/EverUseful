import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function WireframeGlobe() {
  const group = useRef<THREE.Group>(null);

  // Create geometry for a geodesic sphere (icosahedron)
  let geometry: THREE.BufferGeometry | THREE.IcosahedronGeometry = new THREE.IcosahedronGeometry(1, 1);
  if (!geometry.index) {
    geometry = geometry.toNonIndexed() as THREE.BufferGeometry;
  }
  const position = geometry.getAttribute('position');
  const index = geometry.index;

  // Gradient colors
  const colorA = new THREE.Color('#1e90ff'); // blue
  const colorB = new THREE.Color('#39ff14'); // green

  // Memoize line positions for performance
  const linePositions = useMemo(() => {
    const positions: number[] = [];
    const edgeSet = new Set();
    if (index) {
      for (let i = 0; i < index.count; i += 3) {
        for (let j = 0; j < 3; j++) {
          const a = index.getX(i + j);
          const b = index.getX(i + ((j + 1) % 3));
          const key = a < b ? `${a}-${b}` : `${b}-${a}`;
          if (edgeSet.has(key)) continue;
          edgeSet.add(key);
          const vA = new THREE.Vector3().fromBufferAttribute(position, a);
          const vB = new THREE.Vector3().fromBufferAttribute(position, b);
          positions.push(...vA.toArray(), ...vB.toArray());
        }
      }
    }
    return new Float32Array(positions);
  }, [index, position]);

  // Create nodes (spheres) at each vertex
  const nodes = [];
  for (let i = 0; i < position.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(position, i);
    const color = colorA.clone().lerp(colorB, (v.y + 1) / 2);
    nodes.push(
      <mesh key={i} position={v.toArray()}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color.getStyle()} />
      </mesh>
    );
  }

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={group}>
      {/* Render all lines as a single LineSegments object */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1e90ff" />
      </lineSegments>
      {nodes}
    </group>
  );
}

export default function GlobeLoader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Canvas style={{ width: 200, height: 200, background: 'white' }} camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <WireframeGlobe />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
      <div style={{ marginTop: 16, fontSize: 18, fontWeight: 500, color: '#333' }}>loading...</div>
    </div>
  );
}

// If you haven't already, install dependencies:
// npm install three @react-three/fiber @react-three/drei three-stdlib 