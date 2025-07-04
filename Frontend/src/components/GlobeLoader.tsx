import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function WireframeGlobe() {
  const group = useRef<THREE.Group>(null);

  // Create geometry for a geodesic sphere (icosahedron with more subdivisions)
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 2), []);
  const position = geometry.getAttribute('position');
  const index = geometry.index;

  // Gradient colors
  const colorA = new THREE.Color('#1e90ff'); // blue
  const colorB = new THREE.Color('#39ff14'); // green

  // Memoize line positions for performance
  const linePositions = useMemo(() => {
    const positions: number[] = [];
    const edgeSet = new Set<string>();
    
    if (index) {
      // Create all edges from the indexed geometry
      for (let i = 0; i < index.count; i += 3) {
        const a = index.getX(i);
        const b = index.getX(i + 1);
        const c = index.getX(i + 2);
        
        // Create edges for each triangle
        [ [a, b], [b, c], [c, a] ].forEach(([start, end]) => {
          const key = start < end ? `${start}-${end}` : `${end}-${start}`;
          if (!edgeSet.has(key)) {
            edgeSet.add(key);
            const vStart = new THREE.Vector3().fromBufferAttribute(position, start);
            const vEnd = new THREE.Vector3().fromBufferAttribute(position, end);
            positions.push(...vStart.toArray(), ...vEnd.toArray());
          }
        });
      }
    }
    
    return new Float32Array(positions);
  }, [index, position]);

  // Create nodes (spheres) at each vertex with gradient colors
  const nodes = useMemo(() => {
    const nodeElements = [];
    for (let i = 0; i < position.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(position, i);
      const color = colorA.clone().lerp(colorB, (v.y + 1) / 2);
      nodeElements.push(
        <mesh key={i} position={v.toArray()}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={color.getStyle()} />
        </mesh>
      );
    }
    return nodeElements;
  }, [position]);

  // Create faces (optional) - uncomment if you want to see the faces
  const faces = useMemo(() => {
    if (!index) return null;
    
    const facePositions: number[] = [];
    for (let i = 0; i < index.count; i += 3) {
      const a = index.getX(i);
      const b = index.getX(i + 1);
      const c = index.getX(i + 2);
      
      const vA = new THREE.Vector3().fromBufferAttribute(position, a);
      const vB = new THREE.Vector3().fromBufferAttribute(position, b);
      const vC = new THREE.Vector3().fromBufferAttribute(position, c);
      
      facePositions.push(...vA.toArray(), ...vB.toArray(), ...vC.toArray());
    }
    
    return (
      <mesh>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={facePositions.length / 3}
            array={new Float32Array(facePositions)}
            itemSize={3}
          />
        </bufferGeometry>
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.1} 
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }, [index, position]);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={group}>
      {/* Optional: Render semi-transparent faces */}
      {faces}
      
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1e90ff" linewidth={1} />
      </lineSegments>
      
      {nodes}
    </group>
  );
}

export default function GlobeLoader() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
    }}>
      <Canvas 
        style={{ 
          width: '200px', 
          height: '200px', 
          background: 'transparent' 
        }} 
        camera={{ position: [0, 0, 3], fov: 50 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <WireframeGlobe />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  );
}