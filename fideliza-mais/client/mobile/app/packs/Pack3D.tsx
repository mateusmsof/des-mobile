import React from 'react';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import * as THREE from 'three';

export default function Pack3D() {
  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ 
        canvas: { width, height, style: {}, addEventListener: () => {}, removeEventListener: () => {} } as any, 
        context: gl,
        antialias: true 
    });

    // Luz de ambiente suave
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    
    // Luz Direcional forte (simula uma luz de estúdio para dar brilho de "plástico")
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(2, 2, 5);
    scene.add(dirLight);

    // Geometria "estufada" (Box com cantos arredondados simulados)
    const geometry = new THREE.BoxGeometry(1.8, 2.8, 0.4, 10, 10, 10);
    
    // Material PBR (Physically Based Rendering)
    const material = new THREE.MeshPhysicalMaterial({ 
        color: '#FFD000',
        metalness: 0.1,
        roughness: 0.2, // Quanto menor, mais reflexo (aspecto de plástico)
        clearcoat: 1.0, // Adiciona uma camada de "verniz" por cima
        clearcoatRoughness: 0.1,
    });
    
    const pack = new THREE.Mesh(geometry, material);
    scene.add(pack);

    const animate = () => {
      requestAnimationFrame(animate);
      // Movimento premium: lento e fluido
      pack.rotation.y = Math.sin(Date.now() * 0.001) * 0.3;
      pack.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />;
}