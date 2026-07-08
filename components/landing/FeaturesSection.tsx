"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  Shield,
  Smartphone,
  Trophy,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    id: "ai-insights",
    icon: Brain,
    title: "Gemini AI Insights",
    description:
      "Personalised match-day commentary, fan predictions, and crowd sentiment analysis powered by Google's Gemini reasoning models.",
    accent: "amber",
    tag: "AI-Powered",
  },
  {
    id: "realtime-ops",
    icon: Activity,
    title: "Real-Time Operations",
    description:
      "Live stadium event simulation, crowd flow monitoring, and instant alert dispatch — all connected via Firebase Firestore.",
    accent: "emerald",
    tag: "Live Data",
  },
  {
    id: "fan-engagement",
    icon: Trophy,
    title: "Fan Loyalty Engine",
    description:
      "Tiered rewards system from Bronze to Legend. Points for every check-in, prediction, and interaction. Redeem at the stadium.",
    accent: "amber",
    tag: "Gamified",
  },
  {
    id: "safety-control",
    icon: Shield,
    title: "Safety & Crowd Control",
    description:
      "Intelligent scenario simulation for crowd surges, weather delays, and security incidents — test before matchday.",
    accent: "red",
    tag: "Safety First",
  },
  {
    id: "mobile-first",
    icon: Smartphone,
    title: "Mobile-First Experience",
    description:
      "Responsive PWA-ready platform. Fans get the full experience on any device — from the terrace to the VIP box.",
    accent: "blue",
    tag: "PWA Ready",
  },
  {
    id: "cloud-native",
    icon: Zap,
    title: "Cloud Run Deployment",
    description:
      "Containerised on Google Cloud Run. Auto-scales to 60,000 concurrent fans on matchday, then scales to zero overnight.",
    accent: "emerald",
    tag: "Scalable",
  },
];

const ACCENT_STYLES: Record<string, { glow: string; border: string; text: string; bg: string }> = {
  amber: {
    glow: "var(--shadow-amber)",
    border: "rgba(245,158,11,0.25)",
    text: "var(--accent-amber)",
    bg: "var(--accent-amber-glow)",
  },
  emerald: {
    glow: "var(--shadow-emerald)",
    border: "rgba(16,185,129,0.25)",
    text: "var(--accent-emerald)",
    bg: "var(--accent-emerald-glow)",
  },
  red: {
    glow: "0 0 24px rgba(239,68,68,0.2)",
    border: "rgba(239,68,68,0.25)",
    text: "var(--accent-red)",
    bg: "var(--accent-red-glow)",
  },
  blue: {
    glow: "0 0 24px rgba(59,130,246,0.2)",
    border: "rgba(59,130,246,0.25)",
    text: "var(--accent-blue)",
    bg: "var(--accent-blue-glow)",
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[var(--bg-base)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-amber)] mb-3"
          >
            Platform Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-[var(--text-primary)] leading-tight"
          >
            Everything You Need to
            <br />
            <span className="gradient-text">Run the Stadium</span>
          </motion.h2>
        </div>

        {/* Feature grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            const accent = ACCENT_STYLES[feature.accent];
            return (
              <motion.div
                key={feature.id}
                id={`feature-${feature.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border bg-[var(--bg-surface)] p-6 transition-all duration-300"
                style={{
                  borderColor: "var(--border-subtle)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = accent.border;
                  (e.currentTarget as HTMLElement).style.boxShadow = accent.glow;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Icon */}
                <div
                  className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: accent.bg, border: `1px solid ${accent.border}` }}
                >
                  <Icon className="h-5 w-5" style={{ color: accent.text }} />
                </div>

                {/* Tag */}
                <span
                  className="mb-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: accent.text, background: accent.bg }}
                >
                  {feature.tag}
                </span>

                <h3 className="mb-2 text-base font-semibold text-[var(--text-primary)]">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
