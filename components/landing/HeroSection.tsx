"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const HEADLINE_WORDS = ["CONTROL", "THE", "CROWD."];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-[92vh] flex items-center pitch-grid"
    >
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-[var(--accent-amber)] opacity-[0.04] blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[400px] rounded-full bg-[var(--accent-emerald)] opacity-[0.05] blur-[100px]" />
        <div className="absolute top-1/2 right-0 h-[250px] w-[300px] rounded-full bg-[var(--accent-amber)] opacity-[0.03] blur-[80px]" />
      </div>

      {/* Stadium lines decoration */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-[rgba(16,185,129,0.04)] rounded-full"
            style={{
              width: `${(i + 1) * 20}%`,
              height: `${(i + 1) * 40}%`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-4xl">
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-emerald-glow)] bg-[rgba(16,185,129,0.08)] px-4 py-1.5 mb-8"
          >
            <span className="live-dot" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-emerald)]">
              Now Live — Matchday AI
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-display font-bold leading-none tracking-tight">
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
                className="block"
              >
                {i === 0 ? (
                  <span className="gradient-text text-7xl sm:text-8xl lg:text-9xl">
                    {word}
                  </span>
                ) : (
                  <span
                    className="text-7xl sm:text-8xl lg:text-9xl"
                    style={{ color: i === 2 ? "var(--text-primary)" : "var(--text-secondary)" }}
                  >
                    {word}
                  </span>
                )}
              </motion.span>
            ))}
          </h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 max-w-2xl text-lg text-[var(--text-secondary)] leading-relaxed"
          >
            MIDFIELDER transforms every stadium into an intelligent, connected experience.
            Real-time fan engagement, AI-powered insights, and seamless stadium operations —
            all from one platform.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="/onboarding" id="hero-cta-join">
              <Button
                size="lg"
                className="group bg-[var(--accent-amber)] text-black hover:bg-[var(--accent-amber-dim)] font-bold shadow-[var(--shadow-amber)] px-8 h-12"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Join the Arena
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard" id="hero-cta-demo">
              <Button
                size="lg"
                variant="outline"
                className="border-[var(--border-default)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-strong)] h-12 px-8"
              >
                <Zap className="mr-2 h-4 w-4 text-[var(--accent-amber)]" />
                View Live Demo
              </Button>
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            {[
              { label: "60K+ Capacity", icon: "🏟️" },
              { label: "AI-Powered", icon: "🤖" },
              { label: "Real-Time Data", icon: "⚡" },
              { label: "Cloud-Native", icon: "☁️" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-base)] to-transparent" aria-hidden />
    </section>
  );
}
