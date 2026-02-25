import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { useScrollReveal } from "../hooks/useScrollReveal";

const frequencyData = [
  { freq: "8", nova: 65, competitor: 40 }, { freq: "20", nova: 82, competitor: 70 },
  { freq: "50", nova: 90, competitor: 85 }, { freq: "100", nova: 92, competitor: 88 },
  { freq: "200", nova: 93, competitor: 90 }, { freq: "500", nova: 94, competitor: 91 },
  { freq: "1k", nova: 95, competitor: 92 }, { freq: "2k", nova: 94, competitor: 90 },
  { freq: "4k", nova: 93, competitor: 87 }, { freq: "8k", nova: 92, competitor: 82 },
  { freq: "16k", nova: 89, competitor: 72 }, { freq: "20k", nova: 85, competitor: 60 },
  { freq: "40k", nova: 78, competitor: 30 }, { freq: "60k", nova: 70, competitor: 10 },
  { freq: "80k", nova: 62, competitor: 0 },
];

const comparisonRows = [
  { spec: "Driver Type", nova: "50mm Planar Magnetic", a: "40mm Dynamic", b: "45mm Electrostatic" },
  { spec: "Frequency Response", nova: "8Hz – 80kHz", a: "20Hz – 20kHz", b: "12Hz – 40kHz" },
  { spec: "Impedance", nova: "32Ω ± 1%", a: "38Ω", b: "64Ω" },
  { spec: "Sensitivity", nova: "108 dB/mW", a: "100 dB/mW", b: "104 dB/mW" },
  { spec: "THD", nova: "< 0.02%", a: "< 0.1%", b: "< 0.05%" },
  { spec: "Spatial Audio", nova: "360° Head Tracking", a: "Stereo Only", b: "Basic HRTF" },
  { spec: "Battery Life", nova: "40 hours", a: "30 hours", b: "20 hours" },
  { spec: "Bluetooth", nova: "5.4 LE + aptX Lossless", a: "5.2 AAC", b: "5.3 LDAC" },
  { spec: "Weight", nova: "298g", a: "320g", b: "385g" },
  { spec: "Price", nova: "$499", a: "$549", b: "$899" },
];

const techCards = [
  { label: "Signal-to-Noise", value: "128 dB", icon: "📶" },
  { label: "DAC Resolution", value: "32-bit / 384kHz", icon: "🎵" },
  { label: "Latency", value: "< 18ms", icon: "⚡" },
  { label: "Active Noise Cancel", value: "-45 dB", icon: "🔇" },
];

export default function SpecsSection() {
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <section id="specs" ref={revealRef} className="py-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div data-reveal="up" className="text-center mb-20">
          <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">Technical Deep Dive</p>
          <h2 className="font-heading text-5xl md:text-6xl font-bold text-foreground">
            Numbers Don't <span className="text-gradient-cyan">Lie</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg mt-4 max-w-lg mx-auto">
            Studio-grade measurements. No marketing fluff — just raw performance data.
          </p>
        </div>

        {/* Quick stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {techCards.map((card, i) => (
            <div
              key={card.label}
              data-reveal="scale"
              data-reveal-delay={String(i * 0.1)}
              className="glass rounded-2xl p-6 text-center hover:glow-cyan transition-all duration-500"
            >
              <span className="text-3xl block mb-3">{card.icon}</span>
              <p className="font-heading text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-muted-foreground font-body text-xs mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Frequency Response Chart */}
        <div data-reveal="up" className="glass-strong rounded-3xl p-8 mb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground">Frequency Response Curve</h3>
              <p className="text-muted-foreground font-body text-sm mt-1">dB SPL vs Frequency (Hz) — measured at 1kHz reference</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm font-body text-foreground">Nova Spatial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
                <span className="text-sm font-body text-muted-foreground">Industry Avg.</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={frequencyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="grayGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(0, 0%, 50%)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="hsl(0, 0%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 18%)" />
                <XAxis dataKey="freq" tick={{ fill: "hsl(0, 0%, 64%)", fontSize: 11, fontFamily: "Inter" }} axisLine={{ stroke: "hsl(0, 0%, 18%)" }} tickLine={false} label={{ value: "Frequency (Hz)", position: "insideBottom", offset: -5, fill: "hsl(0, 0%, 45%)", fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(0, 0%, 64%)", fontSize: 11, fontFamily: "Inter" }} axisLine={{ stroke: "hsl(0, 0%, 18%)" }} tickLine={false} label={{ value: "dB SPL", angle: -90, position: "insideLeft", offset: 20, fill: "hsl(0, 0%, 45%)", fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 10%)", border: "1px solid hsl(0, 0%, 18%)", borderRadius: "12px", fontFamily: "Inter", fontSize: "12px", color: "white" }} labelFormatter={(label) => `${label}Hz`} />
                <Area type="monotone" dataKey="competitor" stroke="hsl(0, 0%, 40%)" strokeWidth={1.5} fill="url(#grayGradient)" name="Industry Avg." />
                <Area type="monotone" dataKey="nova" stroke="hsl(187, 100%, 50%)" strokeWidth={2.5} fill="url(#cyanGradient)" name="Nova Spatial" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison Table */}
        <div data-reveal="up" data-reveal-delay="0.1" className="glass-strong rounded-3xl overflow-hidden">
          <div className="p-8 pb-4">
            <h3 className="font-heading text-2xl font-bold text-foreground">Head-to-Head Comparison</h3>
            <p className="text-muted-foreground font-body text-sm mt-1">Nova vs. leading competitors in the $500–$900 range</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left font-body text-xs text-muted-foreground uppercase tracking-wider px-8 py-4">Specification</th>
                  <th className="text-left font-body text-xs uppercase tracking-wider px-6 py-4 text-primary">Nova Spatial ✦</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase tracking-wider px-6 py-4">Competitor A</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase tracking-wider px-6 py-4">Competitor B</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.spec} className={`border-b border-border/20 ${i % 2 === 0 ? "bg-secondary/20" : ""}`}>
                    <td className="px-8 py-4 font-body text-sm text-muted-foreground">{row.spec}</td>
                    <td className="px-6 py-4 font-heading font-semibold text-sm text-foreground">{row.nova}</td>
                    <td className="px-6 py-4 font-body text-sm text-muted-foreground">{row.a}</td>
                    <td className="px-6 py-4 font-body text-sm text-muted-foreground">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
