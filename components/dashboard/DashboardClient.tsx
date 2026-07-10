"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MatchWidget } from "@/components/dashboard/MatchWidget";
import { EventFeed } from "@/components/events/EventFeed";
import { RecommendationHistory } from "@/components/dashboard/RecommendationHistory";
import { useFanState } from "@/store/FanStateProvider";
import { useRecommendationStore } from "@/store/recommendationStore";
import { NextBestAction } from "@/components/dashboard/NextBestAction";
import { CheckSquare, Activity, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DashboardClient() {
  const router = useRouter();
  const { fanContext, isHydrated } = useFanState();
  const { activeRecommendation } = useRecommendationStore();
  const [showHistory, setShowHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Redirect to onboarding if no context exists after hydration
  useEffect(() => {
    if (isHydrated && !fanContext) {
      router.push("/");
    }
  }, [isHydrated, fanContext, router]);

  if (!mounted || !isHydrated) return null; // Avoid hydration mismatch
  if (!fanContext) return null; // Will redirect

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-24 px-4 sm:px-0">
      
      {/* 0. Transparency Badge */}
      <div className="bg-[var(--accent-blue-glow)] border border-[rgba(59,130,246,0.3)] rounded-lg p-3 flex items-start gap-3">
        <Info className="w-5 h-5 text-[var(--accent-blue)] shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider mb-1">Simulation Environment</p>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Match and venue information is based on FIFA World Cup 2026 fixtures. Stadium operational events are simulated to demonstrate AI decision-making.
          </p>
        </div>
      </div>

      {/* 1. Context Header */}
      <MatchWidget />

      {/* 2. Hero: NEXT BEST ACTION */}
      <NextBestAction />

      {/* 3. Why? (Reasoning Checklist) */}
      <AnimatePresence>
        {activeRecommendation && activeRecommendation.explanation.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--text-muted)]" />
                Why this action?
              </h3>
              <ul className="space-y-4">
                {activeRecommendation.explanation.map((reason, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (i * 0.1) }}
                    className="flex items-start gap-3"
                  >
                    <CheckSquare className="w-5 h-5 text-[var(--accent-emerald)] shrink-0 mt-0.5" />
                    <span className="text-[var(--text-secondary)] leading-relaxed">
                      {reason.description}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Stadium Events (What Changed / Other Activity) */}
      <EventFeed affectedEventIds={activeRecommendation?.affectedEvents || []} />

      {/* 5. Recommendation History (Collapsed) */}
      <div className="pt-8 border-t border-[var(--border-subtle)]">
        {/* <button 
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mx-auto"
        >
          {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Past Recommendations
        </button> */}
        
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 24 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <RecommendationHistory />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
    </div>
  );
}
