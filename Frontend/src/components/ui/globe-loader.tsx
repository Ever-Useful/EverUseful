import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GlobeLoaderProps {
  size?: number;
  className?: string;
}

export const GlobeLoader = ({ size = 120, className = '' }: GlobeLoaderProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true // transparent background
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0, 0); // fully transparent
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create nodes (points on the globe)
    const nodes: THREE.Mesh[] = [];
    const nodeCount = 40;
    const nodeGeometry = new THREE.SphereGeometry(0.075, 18, 18); // slightly larger, smoother
    const nodeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000, // black nodes
      transparent: false,
      opacity: 1
    });

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const x = 2 * Math.cos(theta) * Math.sin(phi);
      const y = 2 * Math.sin(theta) * Math.sin(phi);
      const z = 2 * Math.cos(phi);
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(x, y, z);
      nodes.push(node);
      scene.add(node);
    }

    // Create connecting lines
    const lines: THREE.Line[] = [];
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000, // white lines
      transparent: false,
      opacity: 1,
      linewidth: 1 // Note: linewidth only works in WebGL2 or with special libraries
    });

    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = nodes[i].position.distanceTo(nodes[j].position);
        if (distance < 1.2) { // tighter mesh
          const geometry = new THREE.BufferGeometry().setFromPoints([
            nodes[i].position,
            nodes[j].position
          ]);
          const line = new THREE.Line(geometry, lineMaterial);
          lines.push(line);
          scene.add(line);
        }
      }
    }

    // Animation variables
    let time = 0;

    // Animation loop
    const animate = () => {
      time += 0.02;
      // Rotate globe
      scene.rotation.y = time * 0.5;
      scene.rotation.x = Math.sin(time * 0.3) * 0.2;
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [size]);

  return (
    <div 
      ref={mountRef} 
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
