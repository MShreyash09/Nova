import { useState } from "react";
import { z } from "zod";
import { useScrollReveal } from "../hooks/useScrollReveal";

const orderSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  variant: z.enum(["obsidian", "ghost"]),
});

type OrderData = z.infer<typeof orderSchema>;

export default function PreOrderSection() {
  const [formData, setFormData] = useState<OrderData>({ fullName: "", email: "", variant: "obsidian" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const revealRef = useScrollReveal<HTMLElement>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = orderSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="preorder" className="py-32">
        <div className="container mx-auto px-6 max-w-lg text-center">
          <div className="glass-strong rounded-3xl p-12">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">You're In.</h2>
            <p className="text-muted-foreground font-body">
              We'll notify you at <span className="text-primary">{formData.email}</span> when Nova ships. Expected Q3 2026.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="preorder" ref={revealRef} className="py-32">
      <div className="container mx-auto px-6 max-w-lg">
        <div data-reveal="up" className="text-center mb-12">
          <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">Limited Edition</p>
          <h2 className="font-heading text-5xl font-bold text-foreground">
            Reserve <span className="text-gradient-cyan">Yours</span>
          </h2>
          <p className="text-muted-foreground font-body mt-4">$49 refundable deposit secures your spot. Ships Q3 2026.</p>
        </div>

        <form data-reveal="scale" data-reveal-delay="0.2" onSubmit={handleSubmit} className="glass-strong rounded-3xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">Full Name</label>
            <input type="text" value={formData.fullName} onChange={(e) => setFormData((d) => ({ ...d, fullName: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Your full name" />
            {errors.fullName && <p className="text-destructive text-xs mt-1 font-body">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="you@email.com" />
            {errors.email && <p className="text-destructive text-xs mt-1 font-body">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">Color Variant</label>
            <div className="grid grid-cols-2 gap-3">
              {(["obsidian", "ghost"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setFormData((d) => ({ ...d, variant: v }))} className={`p-3 rounded-xl border text-sm font-body transition-all ${formData.variant === v ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-border/80"}`}>
                  {v === "obsidian" ? "Obsidian Black" : "Ghost Clear"}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-base glow-cyan hover:glow-cyan-strong transition-all duration-300 hover:scale-[1.02]">
            Reserve — $49 Deposit
          </button>
          <p className="text-center text-muted-foreground/60 text-xs font-body">Fully refundable. No commitment until shipping.</p>
        </form>
      </div>
    </section>
  );
}
