import { useEffect, useRef, useState } from "react";
import HeadphoneCanvas from "./HeadphoneCanvas";
import { useScrollReveal } from "../hooks/useScrollReveal";

const specs = [
  { name: "Headband", detail: "Aerospace-grade titanium with adaptive tension", icon: "⌒" },
  { name: "Transparent Shells", detail: "Polycarbonate composite, 2.8mm ultra-thin", icon: "◎" },
  { name: "PCB / Tech Core", detail: "Custom RISC-V DSP with Bluetooth 5.4 LE", icon: "⊞" },
  { name: "Magnetic Drivers", detail: "50mm planar magnetic, 8Hz–80kHz response", icon: "◉" },
  { name: "Memory Foam", detail: "Protein leather + cooling gel memory foam", icon: "◌" },
];

export default function ExplodedViewSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useScrollReveal();
  const [explodeProgress, setExplodeProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const scrolledIntoSection = viewportHeight - rect.top;
      const totalScrollDistance = sectionHeight + viewportHeight;
      const rawProgress = scrolledIntoSection / totalScrollDistance;
      const clamped = Math.max(0, Math.min(1, rawProgress));
      const eased = clamped < 0.5
        ? 2 * clamped * clamped
        : 1 - Math.pow(-2 * clamped + 2, 2) / 2;
      setExplodeProgress(eased);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="tech" ref={sectionRef} className="relative min-h-[150vh] py-32">
      {/* Section header */}
      <div ref={headerRef} className="container mx-auto px-6 mb-16">
        <p data-reveal="up" className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">
          Acoustic Engineering
        </p>
        <h2 data-reveal="up" data-reveal-delay="0.1" className="font-heading text-5xl md:text-6xl font-bold text-foreground">
          Engineered to <span className="text-gradient-cyan">Perfection</span>
        </h2>
        <p data-reveal="up" data-reveal-delay="0.2" className="text-muted-foreground font-body text-lg mt-4 max-w-lg">
          Scroll to deconstruct Nova's five precision-engineered layers.
          Each component is designed for uncompromising audio fidelity.
        </p>
      </div>

      {/* Sticky 3D + specs layout */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="h-[500px]">
              <HeadphoneCanvas explodeProgress={explodeProgress} />
            </div>
            <div className="space-y-6">
              {specs.map((spec, i) => {
                const specProgress = Math.max(0, Math.min(1, (explodeProgress - i * 0.15) * 3));
                return (
                  <div
                    key={spec.name}
                    className="glass rounded-xl p-5 transition-all duration-300"
                    style={{
                      opacity: 0.3 + specProgress * 0.7,
                      transform: `translateX(${(1 - specProgress) * 30}px)`,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl text-primary font-heading">{spec.icon}</span>
                      <div>
                        <h3 className="font-heading font-semibold text-foreground text-lg">{spec.name}</h3>
                        <p className="text-muted-foreground font-body text-sm mt-1">{spec.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
