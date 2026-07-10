"use client";

import { useEffect, useState } from "react";
import { STADIUM_INFO, STADIUM_ZONES } from "@/lib/constants";
import { EventRepository } from "@/repositories/EventRepository";
import { StadiumEvent } from "@/domain/events/StadiumEvent";
import { AlertCircle, CheckCircle2, Navigation, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminStadiumPage() {
  const [events, setEvents] = useState<StadiumEvent[]>([]);

  useEffect(() => {
    const unsubscribe = EventRepository.subscribeToActiveEvents((newEvents) => {
      setEvents(newEvents);
    });
    return () => unsubscribe();
  }, []);

  const getEventsForZone = (zone: string) => {
    return events.filter(e => e.affectedZones.includes(zone) || e.location?.description === zone);
  };

  const getZoneStatus = (zoneEvents: StadiumEvent[]) => {
    if (zoneEvents.length === 0) return "healthy";
    if (zoneEvents.some(e => e.severity === "critical")) return "critical";
    if (zoneEvents.some(e => e.severity === "high")) return "warning";
    return "active";
  };

  const STATUS_STYLES = {
    healthy: "border-[rgba(16,185,129,0.2)] bg-[var(--accent-emerald-glow)] text-[var(--accent-emerald)]",
    active: "border-[rgba(59,130,246,0.3)] bg-[var(--accent-blue-glow)] text-[var(--accent-blue)]",
    warning: "border-[rgba(245,158,11,0.4)] bg-[var(--accent-amber-glow)] text-[var(--accent-amber)]",
    critical: "border-[rgba(239,68,68,0.4)] bg-[var(--accent-red-glow)] text-[var(--accent-red)]",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Stadium Operations
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Live monitoring for {STADIUM_INFO.name} — {STADIUM_INFO.capacity.toLocaleString()} capacity
          </p>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2">
          <Activity className="h-4 w-4 text-[var(--accent-amber)]" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {events.length} Active Events
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {STADIUM_ZONES.map((zone, index) => {
          const zoneEvents = getEventsForZone(zone).slice(0, 5);
          const status = getZoneStatus(zoneEvents);

          return (
            <motion.div
              key={zone}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 overflow-hidden relative flex flex-col"
            >
              {/* Status Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{zone}</h3>
                <div className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border",
                  STATUS_STYLES[status]
                )}>
                  {status === "healthy" && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {(status === "warning" || status === "critical") && <AlertCircle className="w-3.5 h-3.5" />}
                  {status === "active" && <Navigation className="w-3.5 h-3.5" />}
                  {status}
                </div>
              </div>

              {/* Event List */}
              <div className="flex-1 space-y-3">
                <AnimatePresence mode="popLayout">
                  {zoneEvents.length === 0 ? (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex items-center justify-center py-6 text-sm text-[var(--text-muted)] italic"
                    >
                      No active events
                    </motion.div>
                  ) : (
                    zoneEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 text-sm"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-semibold text-[var(--text-primary)] leading-tight">{event.title}</p>
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                            event.severity === "critical" ? "bg-[rgba(239,68,68,0.2)] text-[var(--accent-red)]" : 
                            event.severity === "high" ? "bg-[rgba(245,158,11,0.2)] text-[var(--accent-amber)]" :
                            "bg-[rgba(59,130,246,0.2)] text-[var(--accent-blue)]"
                          )}>
                            {event.severity}
                          </span>
                        </div>
                        <p className="text-[var(--text-secondary)] mt-1.5 text-xs line-clamp-2">
                          {event.description}
                        </p>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
