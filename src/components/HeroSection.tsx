import { useState, useCallback } from "react";
import HeadphoneCanvas from "./HeadphoneCanvas";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const revealRef = useScrollReveal<HTMLElement>();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setMousePos({ x, y });
  }, []);

  return (
    <section
      id="hero"
      ref={revealRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orb behind headphones */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p data-reveal="up" className="text-primary font-body font-medium text-sm tracking-[0.3em] uppercase">
                Spatial Audio Technology
              </p>
              <h1 data-reveal="up" data-reveal-delay="0.1" className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] text-foreground">
                Hear
                <br />
                the{" "}
                <span className="text-gradient-cyan text-glow">Unseen.</span>
              </h1>
              <p data-reveal="up" data-reveal-delay="0.2" className="text-muted-foreground font-body text-lg max-w-md leading-relaxed">
                Nova Spatial Audio redefines immersion with transparent 
                planar magnetic drivers and real-time head tracking. 
                Every sound, precisely placed.
              </p>
            </div>

            <div data-reveal="up" data-reveal-delay="0.35" className="flex items-center gap-4">
              <button
                onClick={() =>
                  document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-heading font-semibold text-base glow-cyan hover:glow-cyan-strong transition-all duration-300 hover:scale-105"
              >
                Pre-Order Now — $499
              </button>
              <button
                onClick={() =>
                  document.getElementById("tech")?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-6 py-4 rounded-full border border-border text-foreground font-body text-sm hover:border-primary/50 transition-all duration-300"
              >
                Explore Tech
              </button>
            </div>

            {/* Stats */}
            <div data-reveal="up" data-reveal-delay="0.5" className="flex gap-10 pt-4">
              {[
                { value: "50mm", label: "Planar Drivers" },
                { value: "40hr", label: "Battery Life" },
                { value: "360°", label: "Spatial Audio" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-muted-foreground font-body text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Model */}
          <div data-reveal="scale" data-reveal-delay="0.3" className="h-[500px] lg:h-[600px]">
            <HeadphoneCanvas mousePos={mousePos} />
          </div>
        </div>
      </div>
    </section>
  );
}
