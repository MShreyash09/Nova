import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * HeadphoneModel - A stylized 3D headphone built from basic Three.js geometries.
 * 
 * Architecture:
 * - Headband: A half-torus arc connecting left and right ear cups
 * - Ear Cups: Two cylinders representing the outer shells
 * - Cushions: Torus rings on the inner face of each ear cup
 * - Drivers: Flat circles representing the magnetic planar drivers
 * - PCB Core: Small box inside each cup representing the tech internals
 * 
 * The `explodeProgress` prop (0-1) drives the exploded view animation.
 * Each part offsets along different axes based on its role.
 * 
 * The `mousePos` prop allows the model to subtly follow cursor position.
 * The `colorVariant` prop switches material colors.
 */

interface HeadphoneModelProps {
  explodeProgress?: number;
  mousePos?: { x: number; y: number };
  colorVariant?: "obsidian" | "ghost";
}

export default function HeadphoneModel({
  explodeProgress = 0,
  mousePos = { x: 0, y: 0 },
  colorVariant = "obsidian",
}: HeadphoneModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Material colors based on variant
  const colors = useMemo(() => {
    if (colorVariant === "ghost") {
      return {
        shell: "#e0e0e0",
        shellOpacity: 0.4,
        headband: "#c0c0c0",
        cushion: "#a0a0a0",
        driver: "#00E5FF",
        pcb: "#1a3a1a",
      };
    }
    return {
      shell: "#1a1a1a",
      shellOpacity: 0.9,
      headband: "#2a2a2a",
      cushion: "#333333",
      driver: "#00E5FF",
      pcb: "#0a2a0a",
    };
  }, [colorVariant]);

  // Smooth rotation following mouse + idle float
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Subtle mouse-following rotation
    const targetRotY = mousePos.x * 0.3;
    const targetRotX = mousePos.y * 0.15;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY + Math.sin(t * 0.5) * 0.1,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX + Math.cos(t * 0.3) * 0.05,
      0.05
    );

    // Floating animation on Y axis
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.15;
  });

  // Explosion offsets - each part moves in a different direction
  const ep = explodeProgress;

  return (
    <group ref={groupRef} scale={1.2}>
      {/* === HEADBAND === */}
      {/* A half-torus arc. Explodes upward along Y axis */}
      <group position={[0, 1.2 + ep * 2.5, 0]}>
        <mesh rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[1.3, 0.08, 16, 32, Math.PI]} />
          <meshStandardMaterial
            color={colors.headband}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Inner padding strip */}
        <mesh rotation={[0, 0, Math.PI]} position={[0, 0.06, 0]}>
          <torusGeometry args={[1.3, 0.04, 8, 32, Math.PI]} />
          <meshStandardMaterial color={colors.cushion} roughness={0.9} />
        </mesh>
      </group>

      {/* === LEFT EAR CUP (Transparent Outer Shell) === */}
      {/* Explodes left along negative X axis */}
      <group position={[-1.3 - ep * 2, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.35, 32]} />
          <meshPhysicalMaterial
            color={colors.shell}
            metalness={0.6}
            roughness={0.15}
            transparent
            opacity={colors.shellOpacity}
            transmission={colorVariant === "ghost" ? 0.5 : 0}
          />
        </mesh>
      </group>

      {/* === RIGHT EAR CUP (Transparent Outer Shell) === */}
      {/* Explodes right along positive X axis */}
      <group position={[1.3 + ep * 2, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.35, 32]} />
          <meshPhysicalMaterial
            color={colors.shell}
            metalness={0.6}
            roughness={0.15}
            transparent
            opacity={colors.shellOpacity}
            transmission={colorVariant === "ghost" ? 0.5 : 0}
          />
        </mesh>
      </group>

      {/* === LEFT MAGNETIC DRIVER === */}
      {/* Explodes forward along Z axis */}
      <group position={[-1.3 - ep * 1, 0, 0.1 + ep * 1.8]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.05, 32]} />
          <meshStandardMaterial
            color={colors.driver}
            emissive={colors.driver}
            emissiveIntensity={0.6 + ep * 0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Driver magnet ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.04, 8, 24]} />
          <meshStandardMaterial
            color={colors.driver}
            emissive={colors.driver}
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* === RIGHT MAGNETIC DRIVER === */}
      <group position={[1.3 + ep * 1, 0, 0.1 + ep * 1.8]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.05, 32]} />
          <meshStandardMaterial
            color={colors.driver}
            emissive={colors.driver}
            emissiveIntensity={0.6 + ep * 0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.04, 8, 24]} />
          <meshStandardMaterial
            color={colors.driver}
            emissive={colors.driver}
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* === LEFT PCB / TECH CORE === */}
      {/* Explodes backward along negative Z axis */}
      <group position={[-1.3 - ep * 1.5, 0, -0.1 - ep * 2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.5, 0.08, 0.5]} />
          <meshStandardMaterial
            color={colors.pcb}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        {/* Tiny chip details */}
        {[[-0.12, 0.05, -0.1], [0.1, 0.05, 0.1], [-0.05, 0.05, 0.12]].map(
          (pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <boxGeometry args={[0.06, 0.03, 0.06]} />
              <meshStandardMaterial color="#333" metalness={0.8} />
            </mesh>
          )
        )}
      </group>

      {/* === RIGHT PCB / TECH CORE === */}
      <group position={[1.3 + ep * 1.5, 0, -0.1 - ep * 2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.5, 0.08, 0.5]} />
          <meshStandardMaterial
            color={colors.pcb}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        {[[-0.12, 0.05, -0.1], [0.1, 0.05, 0.1], [-0.05, 0.05, 0.12]].map(
          (pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <boxGeometry args={[0.06, 0.03, 0.06]} />
              <meshStandardMaterial color="#333" metalness={0.8} />
            </mesh>
          )
        )}
      </group>

      {/* === LEFT MEMORY FOAM CUSHION === */}
      {/* Explodes downward along negative Y axis */}
      <group position={[-1.3 - ep * 0.8, -ep * 2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.18, 16, 24]} />
          <meshStandardMaterial
            color={colors.cushion}
            roughness={0.95}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* === RIGHT MEMORY FOAM CUSHION === */}
      <group position={[1.3 + ep * 0.8, -ep * 2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.18, 16, 24]} />
          <meshStandardMaterial
            color={colors.cushion}
            roughness={0.95}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* === CONNECTING ARMS === */}
      {/* Left arm - connects headband to left cup */}
      <group position={[-1.3 - ep * 0.5, 0.6 + ep * 1.2, 0]}>
        <mesh>
          <boxGeometry args={[0.06, 0.8, 0.06]} />
          <meshStandardMaterial
            color={colors.headband}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Right arm */}
      <group position={[1.3 + ep * 0.5, 0.6 + ep * 1.2, 0]}>
        <mesh>
          <boxGeometry args={[0.06, 0.8, 0.06]} />
          <meshStandardMaterial
            color={colors.headband}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}
