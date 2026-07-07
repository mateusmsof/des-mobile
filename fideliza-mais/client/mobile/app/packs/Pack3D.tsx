import React, { useEffect, useRef } from 'react';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import * as THREE from 'three';

export interface Pack3DProps {
  isAnimatingOpen: boolean;
}

export default function Pack3D({ isAnimatingOpen }: Pack3DProps) {
  // Referência persistente compartilhada com o loop do Three.js
  const animationStateRef = useRef({ active: false, speed: 0.6 });

  useEffect(() => {
    // Sincroniza o estado de disparo da animação vindo do botão da tela principal
    animationStateRef.current.active = isAnimatingOpen;
  }, [isAnimatingOpen]);

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

    // --- GEOMETRIA DO PACOTE REDUZIDA PROPORCIONALMENTE ---
    // Reduzido para evitar vazamento das bordas na renderização da tela do dispositivo
    const w = 1.5; // Antes era 1.9
    const h = 2.3; // Antes era 2.9
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
            // Ajustado o multiplicador de estufamento para acompanhar o tamanho menor (0.24)
            z = 0.24 * Math.cos(normalizeX * Math.PI / 2) * Math.cos((normalizeY / sealArea) * Math.PI / 2);
            z += (Math.sin(x * 8 + y * 4) * 0.01 + Math.cos(x * 4 - y * 8) * 0.005);
        } else {
            z = 0.018 * Math.sin(y * 120);
        }
        pos.setZ(i, z);
    }
    geometry.computeVertexNormals();

    // --- MATERIAL DO DESIGN SYSTEM ---
    const packMaterial = new THREE.MeshPhysicalMaterial({ 
        color: '#227C9D', // Verde-Azulado Oficial
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

    // --- LOOP DE ANIMAÇÃO SEM TRAVAMENTOS ---
    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      if (animationStateRef.current.active) {
        // Se clicou em abrir, acelera drasticamente a rotação Y criando efeito de redemoinho/giroscópio
        animationStateRef.current.speed += 0.18;
        snackPack.rotation.y += animationStateRef.current.speed;
        
        // Efeito de trepidação pesada nas outras direções simulando fricção de abertura
        snackPack.rotation.x = Math.sin(time * 60) * 0.15;
        snackPack.rotation.z = Math.cos(time * 50) * 0.1;
      } else {
        // Estado ocioso estável (Idle Automático Inteligente)
        snackPack.rotation.y = Math.sin(time * 0.5) * 0.25;
        snackPack.rotation.x = Math.cos(time * 0.3) * 0.04;
        snackPack.rotation.z = Math.sin(time * 0.2) * 0.02;
        snackPack.position.y = Math.sin(time * 0.8) * 0.03;
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />;
}
