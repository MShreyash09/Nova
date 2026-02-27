import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const variants = [
  { id: "obsidian" as const, name: "Obsidian Black", description: "Stealth-mode elegance. Matte black with subtle metallic accents.", price: "$499", image: "/black_headphone.jpeg" },
  { id: "ghost" as const, name: "Ghost Clear", description: "Transparent polycarbonate reveals the engineering within.", price: "$549", image: "/white_headphone.jpeg" },
];

export default function ColorVariantsSection() {
  const [activeVariant, setActiveVariant] = useState<"obsidian" | "ghost">("obsidian");
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <section id="colors" ref={revealRef} className="relative py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/3 blur-[200px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div data-reveal="up" className="text-center mb-16">
          <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">Choose Your Style</p>
          <h2 className="font-heading text-5xl md:text-6xl font-bold text-foreground">
            Two Finishes. <span className="text-gradient-cyan">One Vision.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div data-reveal="left" className="h-[500px] relative rounded-3xl overflow-hidden shadow-2xl glass border border-white/10">
            {variants.map((v) => (
              <img
                key={v.id}
                src={v.image}
                alt={v.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${activeVariant === v.id ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
              />
            ))}
          </div>

          <div className="space-y-4">
            {variants.map((v, i) => (
              <button
                key={v.id}
                data-reveal="right"
                data-reveal-delay={String(i * 0.15)}
                onClick={() => setActiveVariant(v.id)}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-500 flex items-center gap-6 ${activeVariant === v.id
                    ? "glass-strong border-glow glow-cyan"
                    : "glass hover:border-border/50"
                  }`}
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 hidden sm:block border border-white/10">
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-semibold text-xl text-foreground">{v.name}</h3>
                      <p className="text-muted-foreground font-body text-sm mt-1">{v.description}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-heading font-bold text-2xl text-foreground">{v.price}</p>
                      {activeVariant === v.id && <span className="text-primary font-body text-xs block mt-1">Selected</span>}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
