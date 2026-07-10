"use client";

import { motion } from "framer-motion";
import { UserPlus, Cpu, Zap, BellRing } from "lucide-react";

const STEPS = [
  {
    id: 1,
    icon: UserPlus,
    title: "Create Your Fan Context",
    description:
      "Sign up and set your preferences, seat location, and travel plans. We build a personalized profile just for you.",
  },
  {
    id: 2,
    icon: Zap,
    title: "Live Event Simulation",
    description:
      "The stadium comes alive. Real-time events like weather changes, gate queues, and transport delays are continuously monitored.",
  },
  {
    id: 3,
    icon: Cpu,
    title: "AI Decision Engine",
    description:
      "Gemini analyzes the live events against your specific fan profile and context, instantly calculating the Next Best Action.",
  },
  {
    id: 4,
    icon: BellRing,
    title: "Get Smart Alerts",
    description:
      "Receive personalized, context-aware recommendations directly to your dashboard, ensuring a flawless matchday experience.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-[var(--bg-surface)] border-y border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-emerald)] mb-3"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] leading-tight"
          >
            From Matchday Chaos to <span className="text-[var(--accent-emerald)]">AI-Powered Clarity</span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connector Line (hidden on mobile) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-[var(--bg-surface)] via-[var(--border-default)] to-[var(--bg-surface)] -translate-y-1/2" />

          <div className="grid gap-8 lg:grid-cols-4 relative z-10">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center mb-6 relative transition-all duration-300 group-hover:border-[var(--accent-emerald)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:border-[var(--accent-emerald)] transition-colors">
                      {step.id}
                    </span>
                    <Icon className="w-7 h-7 text-[var(--text-secondary)] group-hover:text-[var(--accent-emerald)] transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed px-4">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
