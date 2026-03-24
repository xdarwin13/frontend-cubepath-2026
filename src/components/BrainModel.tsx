'use client';

import { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Center } from '@react-three/drei';
import { DRACOLoader } from 'three-stdlib';
import * as THREE from 'three';
import type { Group } from 'three';

// Configure Draco decoder from Google CDN for fast loading
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
dracoLoader.preload();

function Brain({ onLoaded }: { onLoaded: () => void }) {
  const { scene } = useGLTF('/cerebro.glb', true, true, (loader) => {
    loader.setDRACOLoader(dracoLoader);
  });
  const ref = useRef<Group>(null);
  const { camera } = useThree();

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const dist = maxDim / (2 * Math.tan(fov / 2)) * 1.4;
    camera.position.set(0, 0, dist);
    camera.lookAt(0, 0, 0);
    onLoaded();
  }, [scene, camera, onLoaded]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={ref}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

useGLTF.preload('/cerebro.glb');

export default function BrainModel() {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);

  return (
    <div style={{ width: 600, height: 600 }} className="relative mx-auto">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-20 h-20 rounded-full border-2 border-[#38bdf8]/20 border-t-[#38bdf8] animate-spin" />
        </div>
      )}
      <Canvas
        camera={{ position: [0, 0, 3], fov: 40 }}
        style={{ background: 'transparent', opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 4, 5]} intensity={3} color="#38bdf8" />
        <directionalLight position={[-3, -2, -4]} intensity={1.8} color="#818cf8" />
        <pointLight position={[0, 3, 2]} intensity={2.5} color="#a78bfa" />
        <pointLight position={[-2, -1, 3]} intensity={1.2} color="#06b6d4" />
        <Suspense fallback={null}>
          <Brain onLoaded={handleLoaded} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
