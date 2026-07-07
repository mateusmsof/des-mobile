import React, { useEffect, useRef } from 'react';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import * as THREE from 'three';

// Corrigido: Interface adicionada e exportada explicitamente para zerar o erro do TypeScript
export interface Pack3DProps {
  rotationX: number;
  rotationY: number;
}

export default function Pack3D({ rotationX, rotationY }: Pack3DProps) {
  // Referências para atualizar a rotação sem remontar o contexto do GLView
  const rotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    rotationRef.current = { x: rotationX, y: rotationY };
  }, [rotationX, rotationY]);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ 
        canvas: { width, height, style: {}, addEventListener: () => {}, removeEventListener: () => {} } as any, 
        context: gl,
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);

    // --- ILUMINAÇÃO PREMIUM ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x90b0ff, 0.6);
    fillLight.position.set(-2, -3, 2);
    scene.add(fillLight);

    // --- GEOMETRIA DO PACOTE ---
    const w = 1.9;
    const h = 2.9;
    const segments = 120;
    
    const geometry = new THREE.PlaneGeometry(w, h, segments, segments);
    const pos = geometry.attributes.position;

    for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        
        const normalizeY = y / (h / 2);
        const normalizeX = x / (w / 2);
        
        const sealArea = 0.85; 
        let z = 0;
        
        if (Math.abs(normalizeY) < sealArea) {
            z = 0.28 * Math.cos(normalizeX * Math.PI / 2) * Math.cos((normalizeY / sealArea) * Math.PI / 2);
            z += (Math.sin(x * 8 + y * 4) * 0.01 + Math.cos(x * 4 - y * 8) * 0.005);
        } else {
            z = 0.018 * Math.sin(y * 120);
        }
        pos.setZ(i, z);
    }
    geometry.computeVertexNormals();

    // --- MATERIAL ALINHADO AO DESIGN SYSTEM ---
    const packMaterial = new THREE.MeshPhysicalMaterial({ 
        color: '#227C9D', // Verde-Azulado Oficial da paleta Primária
        metalness: 0.1,
        roughness: 0.15, 
        clearcoat: 1.0,   
        clearcoatRoughness: 0.05,
        side: THREE.DoubleSide
    });

    const snackPack = new THREE.Group();
    const front = new THREE.Mesh(geometry, packMaterial);
    const back = front.clone();
    back.rotation.y = Math.PI;

    snackPack.add(front);
    snackPack.add(back);
    scene.add(snackPack);

    // --- LOOP DE ANIMAÇÃO ---
    const animate = () => {
      requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;

      // Interpolação suave entre a rotação do arrasto (Gesto) + efeito ocioso (Idle)
      snackPack.rotation.y = rotationRef.current.y + (Math.sin(time * 0.4) * 0.05);
      snackPack.rotation.x = rotationRef.current.x + (Math.cos(time * 0.3) * 0.03);
      
      // Flutuação sutil de respiro
      snackPack.position.y = Math.sin(time * 0.8) * 0.03;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />;
}
