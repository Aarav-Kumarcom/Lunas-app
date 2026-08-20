"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei"

/**
 * ---------------------------------------------------------------
 * 3D ROOM SCENE
 * ---------------------------------------------------------------
 * Real 3D (Three.js via React Three Fiber), not an isometric CSS
 * trick. You can drag to rotate and scroll to zoom.
 *
 * Furniture is represented with simple geometric shapes (boxes,
 * cylinders) rather than photorealistic models — that's the
 * realistic tradeoff of doing this without paid/downloaded 3D
 * asset packs. It still looks like a real lit 3D room, not flat
 * icons.
 * ---------------------------------------------------------------
 */

export type PlacedItem = {
  id: string
  type: "sofa" | "armchair" | "tvStand" | "coffeeTable" | "floorLamp" | "rug" | "car" | "carUpgraded"
  position: [number, number, number] // x, y, z in the room
  rotationY?: number
  color?: string
}

function Sofa({ position, rotationY = 0, color = "#6b8afd" }: PlacedItem) {
  return (
    <group position={position} rotation={[0, rotationY, 0]} castShadow>
      {/* base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.5, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* backrest */}
      <mesh position={[0, 0.55, -0.3]} castShadow>
        <boxGeometry args={[1.6, 0.6, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* arms */}
      <mesh position={[-0.75, 0.45, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.75, 0.45, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  )
}

function Armchair({ position, rotationY = 0, color = "#7ba0ff" }: PlacedItem) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.5, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.55, -0.3]} castShadow>
        <boxGeometry args={[0.7, 0.6, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  )
}

function TvStand({ position, rotationY = 0, color = "#3a3f4b" }: PlacedItem) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.4, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* screen */}
      <mesh position={[0, 0.75, -0.05]} castShadow>
        <boxGeometry args={[1.1, 0.65, 0.06]} />
        <meshStandardMaterial color="#111318" roughness={0.2} metalness={0.3} />
      </mesh>
    </group>
  )
}

function CoffeeTable({ position, rotationY = 0, color = "#8a5a34" }: PlacedItem) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.06, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {[[-0.35, -0.2], [0.35, -0.2], [-0.35, 0.2], [0.35, 0.2]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.12, z]} castShadow>
          <boxGeometry args={[0.05, 0.28, 0.05]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function FloorLamp({ position, color = "#e8c974" }: PlacedItem) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 12]} />
        <meshStandardMaterial color="#444" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.25, 0]} castShadow>
        <coneGeometry args={[0.28, 0.35, 16, 1, true]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} roughness={0.5} side={2} />
      </mesh>
      <pointLight position={[0, 1.2, 0]} intensity={1.2} distance={4} color={color} />
    </group>
  )
}

function Rug({ position, color = "#d97a6c" }: PlacedItem) {
  return (
    <mesh position={[position[0], 0.01, position[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[2.2, 1.6]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  )
}

function Car({ position, rotationY = 0, color = "#e0483e" }: PlacedItem) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.5, 1]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.75, -0.05]} castShadow>
        <boxGeometry args={[1.1, 0.4, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </mesh>
      {[[-0.7, -0.5], [0.7, -0.5], [-0.7, 0.5], [0.7, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.18, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.15, 16]} />
          <meshStandardMaterial color="#161616" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

/** Upgraded car: same body, adds a spoiler + glossier paint + gold rims */
function CarUpgraded({ position, rotationY = 0, color = "#f2b705" }: PlacedItem) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.5, 1]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.75, -0.05]} castShadow>
        <boxGeometry args={[1.1, 0.4, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.7} />
      </mesh>
      {/* spoiler */}
      <mesh position={[0, 0.85, 0.55]} castShadow>
        <boxGeometry args={[1.2, 0.06, 0.18]} />
        <meshStandardMaterial color="#111" roughness={0.3} metalness={0.6} />
      </mesh>
      {[[-0.7, -0.5], [0.7, -0.5], [-0.7, 0.5], [0.7, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.18, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.15, 16]} />
          <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

const COMPONENT_MAP: Record<PlacedItem["type"], (item: PlacedItem) => JSX.Element> = {
  sofa: Sofa,
  armchair: Armchair,
  tvStand: TvStand,
  coffeeTable: CoffeeTable,
  floorLamp: FloorLamp,
  rug: Rug,
  car: Car,
  carUpgraded: CarUpgraded,
}

function Room({ items }: { items: PlacedItem[] }) {
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#f1ede4" roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.5, -3]} receiveShadow>
        <planeGeometry args={[8, 3]} />
        <meshStandardMaterial color="#e7e2f5" roughness={1} />
      </mesh>

      {/* Side wall */}
      <mesh position={[-4, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#ded8f0" roughness={1} />
      </mesh>

      {items.map((item) => {
        const Component = COMPONENT_MAP[item.type]
        return <Component key={item.id} {...item} />
      })}
    </>
  )
}

export function Room3D({ items }: { items: PlacedItem[] }) {
  return (
    <div className="h-[480px] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <Canvas shadows camera={{ position: [5, 4, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 4]}
          intensity={1.1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        <Room items={items} />
        <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={10} blur={2} far={4} />
        <Environment preset="apartment" />
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </div>
  )
}
