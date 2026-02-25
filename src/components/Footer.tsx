/**
 * Footer - Minimal dark footer with brand and links.
 */
export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-xs">N</span>
            </div>
            <span className="font-heading font-semibold text-foreground">
              NOVA AUDIO
            </span>
          </div>

          <div className="flex gap-8">
            {["Privacy", "Terms", "Support", "Press"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-muted-foreground font-body text-sm hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          <p className="text-muted-foreground/60 font-body text-xs">
            © 2026 Nova Audio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
