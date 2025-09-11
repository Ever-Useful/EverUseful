import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LoadingAnimationProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'custom';
  className?: string;
  fullScreen?: boolean;
}

const sizeMap: Record<NonNullable<LoadingAnimationProps['size']>, { width: number; height: number }> = {
  xs: { width: 60, height: 60 },
  sm: { width: 80, height: 80 },
  md: { width: 120, height: 120 },
  lg: { width: 160, height: 160 },
  custom: { width: 140, height: 140 },
};

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = 'custom',
  className = '',
  fullScreen = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const dimensions = sizeMap[size];
    const container = containerRef.current;

    // Clear any existing content
    container.innerHTML = '';

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      preserveDrawingBuffer: false
    });
    renderer.setSize(dimensions.width, dimensions.height);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.domElement.style.backgroundColor = 'transparent';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 0.1, 1000);
    camera.position.z = 6;
    sceneRef.current = scene;

    // Create wireframe geometry
    const geometry = new THREE.IcosahedronGeometry(3.5, 3);
    const wireframe = new THREE.WireframeGeometry(geometry);

    // Create colors
    const colors = [];
    const colorBlue = new THREE.Color("#0077ff");
    const colorGreen = new THREE.Color("#00ff77");
    for (let i = 0; i < wireframe.attributes.position.count; i++) {
      const lerpColor = colorBlue.clone().lerp(colorGreen, i / wireframe.attributes.position.count);
      colors.push(lerpColor.r, lerpColor.g, lerpColor.b);
    }
    wireframe.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    // Create line material and mesh
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: 3
    });
    const line = new THREE.LineSegments(wireframe, lineMaterial);
    scene.add(line);

    // Create points material and mesh
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true
    });
    const points = new THREE.Points(wireframe, pointsMaterial);
    scene.add(points);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      line.rotation.x += 0.01;
      line.rotation.y += 0.01;
      points.rotation.x += 0.01;
      points.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (container && container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [size]);

  const containerClass = fullScreen 
    ? `flex items-center justify-center min-h-screen bg-transparent ${className}`
    : `flex items-center justify-center bg-transparent ${className}`;

  return (
    <div className={containerClass} style={{ backgroundColor: 'transparent' }}>
      <div ref={containerRef} style={{ backgroundColor: 'transparent' }} />
    </div>
  );
};

export default LoadingAnimation;