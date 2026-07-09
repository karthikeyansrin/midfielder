"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFanState } from "@/store/FanStateProvider";
import { useEventEngine } from "@/hooks/useEventEngine";
import { useRecommendationStore } from "@/store/recommendationStore";
import { RecommendationPriority, Recommendation } from "@/domain/recommendation/Recommendation";
import { AlertCircle, Clock, CheckCircle2, Info, Navigation, Activity, Loader2 } from "lucide-react";
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
  
  // To avoid rapid flickering, we'll store a pending recommendation and only show it after the fake delay
  const [pendingRecommendation, setPendingRecommendation] = useState<Recommendation | null>(null);
  const [showThinking, setShowThinking] = useState(false);

  const activeEvents = events.filter((e: StadiumEvent) => e.status === "active" || e.status === "investigating");

  // Keep time updated for expiration checking and countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toISOString();
      setNow(currentTime);
      expirePastRecommendations(currentTime);
    }, 5000);
    return () => clearInterval(interval);
  }, [expirePastRecommendations]);

  const fetchRecommendation = useCallback(async () => {
    if (!fanContext) return;
    
    // We only trigger 'thinking' if there are active events. If it's empty, we just clear it out.
    if (activeEvents.length > 0) {
      setShowThinking(true);
    }
    
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
          // Instead of adding immediately, we queue it up and apply an artificial delay
          // so the user actually perceives the "Decision Engine Running..." state.
          setPendingRecommendation(data.recommendation);
        } else {
          // If null (no relevant events), we can just clear it quickly
          setPendingRecommendation(null);
          setTimeout(() => {
            setShowThinking(false);
          }, 300);
        }
      }
    } catch (error) {
      console.error("Failed to fetch recommendation", error);
      setShowThinking(false);
    } finally {
      setIsProcessing(false);
    }
  }, [fanContext, activeEvents]); // Note: removing addRecommendation from deps to avoid re-trigger loops

  // Apply the pending recommendation after a cinematic delay
  useEffect(() => {
    if (pendingRecommendation && showThinking) {
      const timer = setTimeout(() => {
        addRecommendation(pendingRecommendation);
        setShowThinking(false);
        setPendingRecommendation(null);
      }, 800 + Math.random() * 400); // 800 - 1200ms delay for that "AI is thinking" feel
      return () => clearTimeout(timer);
    }
  }, [pendingRecommendation, showThinking, addRecommendation]);

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
    <div className="w-full flex flex-col gap-6 relative min-h-[200px]">
      <AnimatePresence mode="wait">
        {showThinking ? (
          <motion.div
            key="thinking"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 rounded-xl border border-[var(--accent-amber)] bg-[var(--bg-surface)] p-8 flex flex-col items-center justify-center text-center shadow-[0_0_20px_rgba(245,158,11,0.15)]"
          >
            <Loader2 className="w-10 h-10 text-[var(--accent-amber)] animate-spin mb-4" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">MIDFIELDER is analyzing the stadium...</h2>
            <p className="text-[var(--text-secondary)] mt-2">Evaluating live stadium context</p>
          </motion.div>
        ) : !activeRecommendation ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 md:p-8 flex items-center justify-between h-full"
          >
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                You're all set.
              </h2>
              <p className="text-[var(--text-secondary)] mt-2">
                MIDFIELDER is monitoring the stadium and will let you know if your situation changes.
              </p>
            </div>
            <div className="hidden md:flex h-12 w-12 rounded-full bg-[var(--bg-elevated)] items-center justify-center border border-[var(--border-subtle)]">
              <CheckCircle2 className="w-6 h-6 text-[var(--accent-emerald)]" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={activeRecommendation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="rounded-xl border border-[var(--border-subtle)] p-6 md:p-8 relative overflow-hidden"
            style={{ backgroundColor: PRIORITY_STYLES[activeRecommendation.priority].bg }}
          >
            <div 
              className="absolute top-0 left-0 w-2 h-full" 
              style={{ backgroundColor: PRIORITY_STYLES[activeRecommendation.priority].color }}
            />

            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
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
                  </motion.div>
                  
                  {activeRecommendation.expiresAt && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]"
                    >
                      <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      Expires: {new Date(activeRecommendation.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </motion.div>
                  )}
                  
                  {/* AI Confidence badge */}
                  <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-1 text-xs font-bold text-[var(--accent-blue)] bg-[var(--accent-blue-glow)] px-2 py-1 rounded-md border border-[rgba(59,130,246,0.3)]"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    {Math.round(activeRecommendation.confidence * 100)}% Match
                  </motion.div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-[var(--text-primary)] leading-tight">
                    {activeRecommendation.title}
                  </h2>
                  <p className="text-lg font-medium text-[var(--text-secondary)] mt-2 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-[var(--text-muted)]" />
                    {activeRecommendation.action}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 justify-end md:w-48 shrink-0">
                <button 
                  onClick={completeActive}
                  className="w-full flex items-center justify-center gap-2 bg-[var(--text-primary)] text-[var(--bg-base)] font-bold py-3.5 px-4 rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Accept Action
                </button>
                <button 
                  onClick={dismissActive}
                  className="w-full text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors py-2.5 rounded-lg"
                >
                  Dismiss
                </button>
              </div>
            </div>
            {/* Removed traceability section per redesign plan (moved to Dashboard) */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
