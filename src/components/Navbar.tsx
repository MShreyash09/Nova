import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Navbar - Fixed top navigation with glassmorphism effect.
 * Hidden during initial headphone scroll animation.
 * Shows auth state (login button or user menu).
 */
export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    // The headphone scroll animation is pinned for 4000px.
    // Reveal the navbar slightly before it finishes
    const onScroll = () => setShowNavbar(window.scrollY > 3800);

    // Check initial scroll on mount
    onScroll();

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${showNavbar ? "translate-y-0 opacity-100 glass-strong py-3" : "-translate-y-full opacity-0 py-5 pointer-events-none"
        }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            {/* <span className="text-primary-foreground font-heading font-bold text-sm">N</span> */}
            <img src="/nova.png" alt="logo" />
          </div>
          <span className="font-heading font-semibold text-lg text-foreground">
            NOVA
          </span>
        </button>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Technology", id: "tech" },
            { label: "Colors", id: "colors" },
            { label: "Specs", id: "specs" },
            { label: "Reviews", id: "reviews" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side: Auth + CTA */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* User avatar + name */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <span className="text-primary font-heading font-bold text-xs">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <span className="text-sm font-body text-foreground">
                  {user.firstName}
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                className="px-4 py-2 rounded-full border border-border text-muted-foreground font-body text-sm hover:border-destructive/50 hover:text-destructive transition-all duration-300"
              >
                Logout
              </button>

              {/* Pre-Order CTA */}
              <button
                onClick={() => scrollTo("preorder")}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-body font-medium text-sm hover:glow-cyan transition-all duration-300"
              >
                Pre-Order
              </button>
            </>
          ) : (
            <>
              {/* Login button */}
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-border text-muted-foreground font-body text-sm hover:border-primary/50 hover:text-foreground transition-all duration-300"
              >
                Login
              </Link>

              {/* Pre-Order CTA - scrolls to section, which will prompt login */}
              <button
                onClick={() => scrollTo("preorder")}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-body font-medium text-sm hover:glow-cyan transition-all duration-300"
              >
                Pre-Order
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
