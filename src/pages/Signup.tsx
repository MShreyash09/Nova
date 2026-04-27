import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await signup(firstName, lastName, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <img src="/nova.png" alt="logo" className="w-full h-full rounded-full" />
            </div>
            <span className="font-heading font-semibold text-2xl text-foreground">NOVA</span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Join the <span className="text-gradient-cyan">Future</span>
          </h1>
          <p className="text-muted-foreground font-body mt-2">
            Create your NOVA account
          </p>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-strong rounded-3xl p-8 space-y-5"
        >
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 text-destructive text-sm font-body">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body text-muted-foreground mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="John"
                required
                minLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-body text-muted-foreground mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Doe"
                required
                minLength={2}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="you@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-base glow-cyan hover:glow-cyan-strong transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-muted-foreground text-sm font-body">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>

        {/* Back to home */}
        <p className="text-center mt-6">
          <Link
            to="/"
            className="text-muted-foreground/60 text-sm font-body hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
