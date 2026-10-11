import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Background3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090a0f, 0.0015);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 1. Particle Cloud (Starfield Nebula)
    const particleCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x06b6d4); // Cyan
    const color2 = new THREE.Color(0x8b5cf6); // Purple
    const color3 = new THREE.Color(0x3b82f6); // Blue

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 350;

      // Gradient color blend
      const mixedColor = color1.clone().lerp(
        Math.random() > 0.5 ? color2 : color3,
        Math.random()
      );
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // 2. Holographic Geometric Core (Wireframe Icosahedron & Dodecahedron)
    const coreGroup = new THREE.Group();

    // Outer wireframe icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(18, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(icoMesh);

    // Inner wireframe octahedron
    const innerGeo = new THREE.OctahedronGeometry(10, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Glowing energy center
    const light = new THREE.PointLight(0x06b6d4, 2, 80);
    coreGroup.add(light);

    // Place core slightly offset for balance
    coreGroup.position.set(28, 5, 0);
    scene.add(coreGroup);

    // 3. Ambient cyber grid at bottom
    const gridHelper = new THREE.GridHelper(300, 40, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = -60;
    scene.add(gridHelper);

    // Mouse Interaction
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Orbit particles gently
      particles.rotation.y = elapsedTime * 0.03 + mouseX * 0.2;
      particles.rotation.x = elapsedTime * 0.015 + mouseY * 0.2;

      // Rotate geometric core
      coreGroup.rotation.x = elapsedTime * 0.25;
      coreGroup.rotation.y = elapsedTime * 0.35;
      innerMesh.rotation.z = -elapsedTime * 0.5;
      innerMesh.rotation.x = elapsedTime * 0.4;

      // Pulsing scale for core
      const pulse = 1 + Math.sin(elapsedTime * 2) * 0.04;
      coreGroup.scale.set(pulse, pulse, pulse);

      // Camera parallax
      camera.position.x = mouseX * 12;
      camera.position.y = -mouseY * 8;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-90"
      aria-hidden="true"
    />
  );
};
