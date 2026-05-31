'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, useGLTF } from '@react-three/drei'
import { Suspense, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

function RoomModel({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (!meshRef.current || !mouse.current) return
    // Subtle rotation following mouse
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mouse.current.x * 0.15,
      0.05
    )
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      mouse.current.y * 0.08,
      0.05
    )
    // Gentle float
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
  })
  
  // Fallback geometric room inside group
  return (
    <group ref={meshRef}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#FAF8F4" roughness={0.8} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 1, -3]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#FAF8F4" roughness={0.9} />
      </mesh>
      {/* Sofa (simplified box) */}
      <mesh position={[0, -0.5, -1.5]}>
        <boxGeometry args={[2.5, 0.6, 0.8]} />
        <meshStandardMaterial color="#3D2B0F" roughness={0.7} />
      </mesh>
      {/* Coffee table */}
      <mesh position={[0, -0.85, -0.4]}>
        <boxGeometry args={[1, 0.1, 0.6]} />
        <meshStandardMaterial color="#8B6914" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Wall panel accent */}
      <mesh position={[0, 1, -2.95]}>
        <planeGeometry args={[3, 1.5]} />
        <meshStandardMaterial color="#E8C9CF" roughness={0.6} />
      </mesh>
    </group>
  )
}

export default function HeroScene() {
  const mouse = useRef({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) return null
  
  return (
    <div 
      className="absolute inset-0 z-0 h-full w-full pointer-events-none"
    >
      <div 
        className="absolute inset-0 pointer-events-auto"
        onMouseMove={(e) => {
          mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
          mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 4], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} color="#FFF5E6" />
            <pointLight position={[-3, 3, -3]} intensity={0.4} color="#E8C9CF" />
            <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
              <RoomModel mouse={mouse} />
            </Float>
            <Environment preset="apartment" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
