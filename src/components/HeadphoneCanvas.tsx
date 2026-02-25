import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import HeadphoneModel from "./HeadphoneModel";

/**
 * HeadphoneCanvas - Wrapper that sets up the R3F scene with lighting and environment.
 * Renders the HeadphoneModel with configurable props passed through.
 */

interface HeadphoneCanvasProps {
  explodeProgress?: number;
  mousePos?: { x: number; y: number };
  colorVariant?: "obsidian" | "ghost";
  className?: string;
}

export default function HeadphoneCanvas({
  explodeProgress = 0,
  mousePos = { x: 0, y: 0 },
  colorVariant = "obsidian",
  className = "",
}: HeadphoneCanvasProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* Ambient fill light */}
        <ambientLight intensity={0.3} />

        {/* Key light from top-right with cyan tint */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          color="#ffffff"
        />

        {/* Cyan accent rim light from behind */}
        <pointLight
          position={[-3, 2, -3]}
          intensity={2}
          color="#00E5FF"
          distance={15}
        />

        {/* Fill light from below */}
        <pointLight
          position={[0, -3, 2]}
          intensity={0.5}
          color="#00E5FF"
          distance={10}
        />

        {/* HDR environment for realistic reflections */}
        <Environment preset="city" />

        <HeadphoneModel
          explodeProgress={explodeProgress}
          mousePos={mousePos}
          colorVariant={colorVariant}
        />
      </Canvas>
    </div>
  );
}
