"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFanState } from "@/store/FanStateProvider";
import { useEventEngine } from "@/hooks/useEventEngine";
import { useRecommendationStore } from "@/store/recommendationStore";
import { RecommendationPriority } from "@/domain/recommendation/Recommendation";
import { AlertCircle, Clock, CheckCircle2, Info, Navigation, Activity } from "lucide-react";
import { StadiumEvent } from "@/domain/events/StadiumEvent";

const PRIORITY_STYLES: Record<RecommendationPriority, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  CRITICAL: { color: "#DC2626", bg: "rgba(220, 38, 38, 0.1)", icon: AlertCircle, label: "CRITICAL" },
  HIGH:     { color: "#F97316", bg: "rgba(249, 115, 22, 0.1)", icon: AlertCircle, label: "HIGH PRIORITY" },
  MEDIUM:   { color: "#EAB308", bg: "rgba(234, 179, 8, 0.1)", icon: Info, label: "MEDIUM PRIORITY" },
  LOW:      { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)", icon: Info, label: "LOW PRIORITY" },
  INFO:     { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", icon: Info, label: "INFO" },
};

export function NextBestAction() {
  const { fanContext } = useFanState();
  const { events } = useEventEngine();
  const { activeRecommendation, addRecommendation, dismissActive, completeActive, expirePastRecommendations } = useRecommendationStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [now, setNow] = useState(new Date().toISOString());

  const activeEvents = events.filter((e: StadiumEvent) => e.status === "active" || e.status === "investigating");

  // Keep time updated for expiration checking and countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toISOString();
      setNow(currentTime);
      expirePastRecommendations(currentTime);
    }, 5000); // check every 5s
    return () => clearInterval(interval);
  }, [expirePastRecommendations]);

  // Determine if we need to fetch a new recommendation
  // We trigger fetch when fanContext or activeEvents changes significantly
  const fetchRecommendation = useCallback(async () => {
    if (!fanContext) return;
    
    setIsProcessing(true);
    try {
      const res = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fan: fanContext,
          events: activeEvents
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.recommendation) {
          addRecommendation(data.recommendation);
        }
      }
    } catch (error) {
      console.error("Failed to fetch recommendation", error);
    } finally {
      setIsProcessing(false);
    }
  }, [fanContext, activeEvents, addRecommendation]);

  // Trigger when context or events change. In a real system, use deep equality to avoid over-fetching.
  // Here we use stringified dependencies as a simple heuristic for changes.
  const dependenciesString = JSON.stringify({ 
    fanId: fanContext?.id, 
    eventsCount: activeEvents.length,
    eventsMap: activeEvents.map((e: StadiumEvent) => e.id + e.status).join(",")
  });

  useEffect(() => {
    fetchRecommendation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependenciesString]);

  if (!fanContext) return null;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Loading State / Empty State */}
      {!activeRecommendation && (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 md:p-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Welcome back, {fanContext.displayName} 👋
            </h2>
            <p className="text-[var(--text-secondary)] mt-2">
              {isProcessing ? "Analyzing live stadium conditions..." : "No urgent actions required. Enjoy the match!"}
            </p>
          </div>
          {isProcessing && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-emerald)]"></div>
          )}
        </div>
      )}

      {/* Active Recommendation Hero */}
      <AnimatePresence mode="wait">
        {activeRecommendation && (
          <motion.div
            key={activeRecommendation.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl border border-[var(--border-subtle)] p-6 md:p-8 relative overflow-hidden"
            style={{ backgroundColor: PRIORITY_STYLES[activeRecommendation.priority].bg }}
          >
            {/* Background Accent */}
            <div 
              className="absolute top-0 left-0 w-2 h-full" 
              style={{ backgroundColor: PRIORITY_STYLES[activeRecommendation.priority].color }}
            />

            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1 space-y-4">
                {/* Priority Badge */}
                <div className="flex items-center gap-3">
                  <div 
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider"
                    style={{ 
                      backgroundColor: PRIORITY_STYLES[activeRecommendation.priority].color,
                      color: "#fff"
                    }}
                  >
                    {(() => {
                      const Icon = PRIORITY_STYLES[activeRecommendation.priority].icon;
                      return <Icon className="w-3.5 h-3.5" />;
                    })()}
                    {PRIORITY_STYLES[activeRecommendation.priority].label}
                  </div>
                  
                  {activeRecommendation.expiresAt && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
                      <Clock className="w-3.5 h-3.5" />
                      Expires: {new Date(activeRecommendation.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>

                {/* Title & Action */}
                <div>
                  <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                    {activeRecommendation.title}
                  </h2>
                  <p className="text-lg font-medium text-[var(--text-secondary)] mt-2 flex items-center gap-2">
                    <Navigation className="w-5 h-5" />
                    {activeRecommendation.action}
                  </p>
                </div>

                {/* Explainable AI - Why? */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Why this recommendation?
                  </h3>
                  <ul className="space-y-2">
                    {activeRecommendation.explanation.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="text-[var(--text-muted)] mt-1">•</span>
                        <span>{reason.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 justify-end md:w-48">
                <button 
                  onClick={completeActive}
                  className="w-full flex items-center justify-center gap-2 bg-[var(--text-primary)] text-[var(--bg-base)] font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Accept
                </button>
                <button 
                  onClick={dismissActive}
                  className="w-full text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
            
            {/* Traceability: Display affected events minimally */}
            {activeRecommendation.affectedEvents && activeRecommendation.affectedEvents.length > 0 && (
              <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.1)] text-xs text-[var(--text-muted)] font-mono">
                Triggered by events: {activeRecommendation.affectedEvents.join(", ")}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
