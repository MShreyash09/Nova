import { useScrollReveal } from "../hooks/useScrollReveal";

const reviews = [
  { name: "Alex Chen", rating: 5, text: "The spatial audio is genuinely next-level. I can pinpoint every instrument in a mix. Nothing else comes close.", role: "Audio Engineer" },
  { name: "Sarah Kim", rating: 5, text: "Wearing these for 8-hour mixing sessions — zero fatigue. The memory foam is incredible.", role: "Music Producer" },
  { name: "Marcus Webb", rating: 4, text: "The transparent design is stunning. Build quality rivals anything at twice the price. Head tracking is buttery smooth.", role: "Tech Reviewer" },
  { name: "Elena Rossi", rating: 5, text: "I switched from HD800S to Nova. The planar drivers deliver detail I didn't know I was missing. Jaw-dropping clarity.", role: "Audiophile" },
  { name: "James Park", rating: 5, text: "40 hours battery, insane spatial processing, and they look like art. These are the future of headphones.", role: "Creative Director" },
  { name: "Lila Okafor", rating: 4, text: "The Ghost Clear variant is a conversation starter. Sound leakage is minimal for an open-back design. Very impressed.", role: "Sound Designer" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < rating ? "text-primary" : "text-muted-foreground/30"}`}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <section id="reviews" ref={revealRef} className="py-32">
      <div className="container mx-auto px-6">
        <div data-reveal="up" className="text-center mb-16">
          <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">Community</p>
          <h2 className="font-heading text-5xl md:text-6xl font-bold text-foreground">
            What People <span className="text-gradient-cyan">Hear</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={review.name}
              data-reveal="up"
              data-reveal-delay={String(i * 0.08)}
              className="glass rounded-2xl p-6 hover:glass-strong hover:glow-cyan transition-all duration-500 group"
            >
              <StarRating rating={review.rating} />
              <p className="text-foreground/90 font-body text-sm mt-4 leading-relaxed">"{review.text}"</p>
              <div className="mt-5 pt-4 border-t border-border/50">
                <p className="font-heading font-semibold text-foreground text-sm">{review.name}</p>
                <p className="text-muted-foreground font-body text-xs mt-0.5">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
