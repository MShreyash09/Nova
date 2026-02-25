import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollReveal - Hook that animates child elements into view on scroll using GSAP ScrollTrigger.
 * 
 * Targets elements with [data-reveal] attribute inside the container ref.
 * Supports staggered entrance with configurable delay.
 * 
 * Each [data-reveal] element can optionally specify:
 * - data-reveal="up" | "left" | "right" | "scale" (direction, default "up")
 * - data-reveal-delay="0.2" (additional delay in seconds)
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const elements = ref.current.querySelectorAll("[data-reveal]");
    if (elements.length === 0) return;

    const animations: gsap.core.Tween[] = [];

    elements.forEach((el, i) => {
      const direction = el.getAttribute("data-reveal") || "up";
      const extraDelay = parseFloat(el.getAttribute("data-reveal-delay") || "0");

      // Starting state based on direction
      const from: gsap.TweenVars = {
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: i * 0.1 + extraDelay,
      };

      switch (direction) {
        case "left":
          from.x = -60;
          break;
        case "right":
          from.x = 60;
          break;
        case "scale":
          from.scale = 0.9;
          break;
        case "up":
        default:
          from.y = 50;
          break;
      }

      const tween = gsap.from(el, {
        ...from,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          end: "top 50%",
          toggleActions: "play none none none",
        },
      });

      animations.push(tween);
    });

    return () => {
      animations.forEach((t) => t.scrollTrigger?.kill());
      animations.forEach((t) => t.kill());
    };
  }, []);

  return ref;
}
