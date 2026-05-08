'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, ContactShadows, MeshTransmissionMaterial } from '@react-three/drei'
import { Suspense, useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'

function LuxurySofa({ position = [0, 0, 0] as [number, number, number], rotation = [0, 0, 0] as [number, number, number] }) {
  const seatColor = '#C8A47E'
  const legColor = '#2a1a0a'
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[2.6, 0.3, 0.95]} />
        <meshStandardMaterial color={seatColor} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 0.55, -0.35]}>
        <boxGeometry args={[2.6, 0.4, 0.25]} />
        <meshStandardMaterial color={seatColor} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[-1.2, 0.4, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.95]} />
        <meshStandardMaterial color={'#b89060'} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[1.2, 0.4, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.95]} />
        <meshStandardMaterial color={'#b89060'} roughness={0.7} />
      </mesh>
      {[[-1, 0, 0.35], [1, 0, 0.35], [-1, 0, -0.35], [1, 0, -0.35]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.04, p[2]]} castShadow>
          <cylinderGeometry args={[0.03, 0.025, 0.08]} />
          <meshStandardMaterial color={legColor} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {[[-0.5, 0.52, 0.05], [0.5, 0.52, 0.05]].map((p, i) => (
        <mesh key={`c${i}`} position={p as [number, number, number]} rotation={[0.15, 0, i === 0 ? 0.1 : -0.1]} castShadow>
          <boxGeometry args={[0.45, 0.35, 0.35]} />
          <meshStandardMaterial color={i === 0 ? '#e8d5b8' : '#d4bfa0'} roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

function TVUnit({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[3.2, 0.5, 0.45]} />
        <meshStandardMaterial color="#3D2B0F" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.22]}>
        <boxGeometry args={[2.8, 0.38, 0.02]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.3} />
      </mesh>
      {[[-1.2, 0, 0.22], [0, 0, 0.22], [1.2, 0, 0.22]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#C8A47E" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 0.9, -0.08]} castShadow>
        <boxGeometry args={[2.2, 1.25, 0.06]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.05} metalness={0.95} />
      </mesh>
      <mesh position={[0, 0.9, -0.04]}>
        <boxGeometry args={[2.05, 1.1, 0.01]} />
        <meshStandardMaterial color="#1a1a2e" emissive="#1a1a2e" emissiveIntensity={0.15} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.25, -0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 0.04]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function CoffeeTable({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.04, 32]} />
        <meshStandardMaterial color="#f0e6d6" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.28]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>
      {[[0.15, 0.31, 0.1], [-0.1, 0.31, -0.12]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[-Math.PI / 2, 0, i * 0.5]}>
          <cylinderGeometry args={[0.08, 0.06, 0.12, 8]} />
          <meshStandardMaterial color={i === 0 ? '#8B6914' : '#C8A47E'} roughness={0.4} metalness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

function FloorLamp({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh><cylinderGeometry args={[0.15, 0.18, 0.03, 16]} /><meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} /></mesh>
      <mesh position={[0, 0.95, 0]}><cylinderGeometry args={[0.012, 0.012, 1.9]} /><meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} /></mesh>
      <mesh position={[0.15, 1.85, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.18, 0.12, 0.28, 16, 1, true]} />
        <meshStandardMaterial color="#f5efe6" side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
      <pointLight position={[0.15, 1.75, 0]} intensity={0.8} color="#fff5e0" distance={4} castShadow />
    </group>
  )
}

function BookShelf({ position = [0, 0, 0] as [number, number, number] }) {
  const books = useMemo(() => {
    const arr = []
    const colors = ['#8B4513', '#2F4F4F', '#800020', '#4a3728', '#1a3a2a', '#3a1a2a']
    for (let shelf = 0; shelf < 3; shelf++) {
      let x = -0.35
      for (let b = 0; b < 5; b++) {
        const w = 0.06 + Math.random() * 0.06
        const h = 0.18 + Math.random() * 0.12
        arr.push({ x: x + w / 2, y: shelf * 0.42 + h / 2 + 0.06, w, h, color: colors[Math.floor(Math.random() * colors.length)] })
        x += w + 0.02
      }
    }
    return arr
  }, [])
  return (
    <group position={position}>
      <mesh castShadow><boxGeometry args={[0.9, 1.4, 0.3]} /><meshStandardMaterial color="#3D2B0F" roughness={0.6} /></mesh>
      {[0.42, 0.84].map((y, i) => (<mesh key={i} position={[0, y - 0.28, 0.01]}><boxGeometry args={[0.84, 0.03, 0.28]} /><meshStandardMaterial color="#2a1a0a" roughness={0.5} /></mesh>))}
      {books.map((b, i) => (<mesh key={i} position={[b.x, b.y - 0.7, 0.02]} castShadow><boxGeometry args={[b.w, b.h, 0.2]} /><meshStandardMaterial color={b.color} roughness={0.8} /></mesh>))}
    </group>
  )
}

function Plant({ position = [0, 0, 0] as [number, number, number], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh><cylinderGeometry args={[0.12, 0.09, 0.22, 8]} /><meshStandardMaterial color="#c4a882" roughness={0.85} /></mesh>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.11, 0.11, 0.02, 8]} /><meshStandardMaterial color="#3a2a10" roughness={0.9} /></mesh>
      {[[0, 0.3, 0], [0.08, 0.25, 0.05], [-0.06, 0.22, -0.04]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <sphereGeometry args={[0.1 + i * 0.02, 8, 8]} />
          <meshStandardMaterial color={i === 0 ? '#2d5a27' : '#3a6b35'} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function WallArt({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow><boxGeometry args={[1.0, 0.7, 0.03]} /><meshStandardMaterial color="#2a1a0a" roughness={0.4} /></mesh>
      <mesh position={[0, 0, 0.02]}><planeGeometry args={[0.9, 0.6]} /><meshStandardMaterial color="#e8d5b8" roughness={0.6} /></mesh>
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[0.5, 0.35]} />
        <meshStandardMaterial color="#C8A47E" roughness={0.5} metalness={0.1} />
      </mesh>
    </group>
  )
}

function Rug({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.8, 2.0]} />
        <meshStandardMaterial color="#d4bfa0" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[2.4, 1.6]} />
        <meshStandardMaterial color="#c4a882" roughness={1} />
      </mesh>
    </group>
  )
}

function RoomDiorama({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current || !mouse.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouse.current.x * 0.18 + Math.PI * 0.12, 0.03)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.current.y * 0.06 - 0.12, 0.03)
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.04
  })
  return (
    <group ref={group} scale={1.05}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow><boxGeometry args={[5, 5, 0.12]} /><meshStandardMaterial color="#f0ebe4" roughness={0.9} /></mesh>
      <mesh position={[0, 0.5, -2.45]} castShadow><boxGeometry args={[5, 3.4, 0.1]} /><meshStandardMaterial color="#faf8f4" roughness={0.95} /></mesh>
      <mesh position={[-2.45, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow><boxGeometry args={[5, 3.4, 0.1]} /><meshStandardMaterial color="#f5f0ea" roughness={0.95} /></mesh>
      <mesh position={[0, 1.0, -2.39]}><boxGeometry args={[3.2, 2.0, 0.04]} /><meshStandardMaterial color="#3D2B0F" roughness={0.55} metalness={0.1} /></mesh>
      <TVUnit position={[0, -0.95, -2.1]} />
      <LuxurySofa position={[0.3, -1.2, -0.3]} />
      <CoffeeTable position={[0.3, -1.2, 0.85]} />
      <FloorLamp position={[-1.8, -1.2, -1.8]} />
      <BookShelf position={[-2.0, -0.5, -0.5]} />
      <Plant position={[1.9, -1.09, -1.9]} scale={1.1} />
      <Plant position={[-1.8, -1.09, 1.2]} scale={0.8} />
      <WallArt position={[-2.38, 0.8, -1.5]} />
      <Rug position={[0.3, -1.13, 0.5]} />
      <mesh position={[0, 2.0, 0]}><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color="#fff8e7" emissive="#fff8e7" emissiveIntensity={2} /></mesh>
      <pointLight position={[0, 2.0, 0]} intensity={0.5} color="#fff5e0" distance={5} />
    </group>
  )
}

function GlassCubes() {
  const positions: [number, number, number][] = [[-3.5, 1.5, -2], [3.2, -0.5, -3], [2.8, 2.2, -1], [-2.8, -1.5, -2.5]]
  return (<>{positions.map((pos, i) => (
    <Float key={i} speed={1 + i * 0.3} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh position={pos} scale={0.18 + i * 0.06}><boxGeometry args={[1, 1, 1]} />
        <MeshTransmissionMaterial backside samples={6} resolution={256} thickness={0.4} roughness={0.1} clearcoat={1} clearcoatRoughness={0} transmission={0.95} ior={1.5} chromaticAberration={0.06} color="#f0e6d6" />
      </mesh>
    </Float>
  ))}</>)
}

function Particles({ count = 80 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3), siz = new Float32Array(count)
    for (let i = 0; i < count; i++) { pos[i*3]=(Math.random()-0.5)*12; pos[i*3+1]=(Math.random()-0.5)*8; pos[i*3+2]=(Math.random()-0.5)*8; siz[i]=Math.random()*0.03+0.01 }
    return [pos, siz]
  }, [count])
  useFrame((state) => { if (!mesh.current) return; mesh.current.rotation.y = state.clock.elapsedTime * 0.02; mesh.current.rotation.x = state.clock.elapsedTime * 0.01 })
  return (<points ref={mesh}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /><bufferAttribute attach="attributes-size" args={[sizes, 1]} /></bufferGeometry><pointsMaterial size={0.035} color="#C8A47E" transparent opacity={0.5} sizeAttenuation /></points>)
}

export default function ThreeDShowcaseScene() {
  const mouse = useRef({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="absolute inset-0 bg-gradient-to-br from-[#1a1511] to-[#0d0a07]" />
  return (
    <div className="absolute inset-0 z-0" onMouseMove={(e) => { mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2; mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2 }}>
      <Canvas camera={{ position: [0, 0.5, 5.5], fov: 50 }} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} dpr={[1, 1.5]} style={{ background: 'linear-gradient(to bottom right, #1a1511, #0d0a07)' }}>
        <Suspense fallback={null}>
          <fog attach="fog" args={['#0d0a07', 6, 18]} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} color="#FFF5E6" castShadow shadow-mapSize={1024} />
          <pointLight position={[-4, 3, -3]} intensity={0.4} color="#E8C9CF" />
          <spotLight position={[0, 6, 2]} angle={0.4} penumbra={1} intensity={0.7} color="#fff8e0" castShadow />
          <RoomDiorama mouse={mouse} />
          <GlassCubes />
          <Particles />
          <ContactShadows position={[0, -1.25, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#1a1511" />
          <Environment preset="apartment" environmentIntensity={0.3} />
        </Suspense>
      </Canvas>
    </div>
  )
}
