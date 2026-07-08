"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { formatCompact } from "@/lib/utils";

const STATS = [
  { id: "stat-fans", value: 2400000, label: "Registered Fans", suffix: "+", prefix: "" },
  { id: "stat-stadiums", value: 38, label: "Stadiums Connected", suffix: "", prefix: "" },
  { id: "stat-matches", value: 1250, label: "Matches Tracked", suffix: "+", prefix: "" },
  { id: "stat-uptime", value: 99.97, label: "Platform Uptime", suffix: "%", prefix: "" },
];

function AnimatedCount({
  target,
  compact = true,
}: {
  target: number;
  compact?: boolean;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {compact ? formatCompact(count) : count.toFixed(target % 1 !== 0 ? 2 : 0)}
    </span>
  );
}

export function StatsSection() {
  return (
    <section id="stats" className="py-20 border-y border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-amber)] mb-3">
            Platform at a Glance
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Trusted by Fans &amp; Stadium Operators
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.id}
              id={stat.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 text-center overflow-hidden group hover:border-[var(--accent-amber-border)] transition-colors"
            >
              {/* Glow on hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.08),transparent_60%)]" />

              <p className="font-display text-4xl sm:text-5xl font-bold text-[var(--accent-amber)]">
                {stat.prefix}
                {stat.value >= 1 ? (
                  <AnimatedCount target={stat.value} compact={stat.value >= 1000} />
                ) : (
                  <AnimatedCount target={stat.value} compact={false} />
                )}
                {stat.suffix}
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 rounded-2xl border border-[var(--accent-amber-border)] bg-[var(--accent-amber-glow)] p-8 text-center"
        >
          <p className="font-display text-2xl font-bold text-[var(--text-primary)] mb-2">
            Ready to step onto the pitch?
          </p>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Join thousands of fans already getting smarter matchday experiences.
          </p>
          <a
            href="/onboarding"
            id="stats-cta-join"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-amber)] px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-[var(--accent-amber-dim)]"
          >
            Get Your Fan Pass →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
