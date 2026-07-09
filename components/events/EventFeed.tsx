"use client";

import { useState } from "react";
import { useEventEngine } from "@/hooks/useEventEngine";
import { EventCard } from "./EventCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function EventFeed({ 
  onResolve,
  affectedEventIds = [] 
}: { 
  onResolve?: (id: string) => void;
  affectedEventIds?: string[];
}) {
  const { events } = useEventEngine();
  const [showOther, setShowOther] = useState(false);

  // Filter active/investigating and sort newest first
  const activeEvents = events
    .filter((e) => e.status === "active" || e.status === "investigating")
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const relevantEvents = activeEvents.filter(e => affectedEventIds.includes(e.id));
  const otherEvents = activeEvents.filter(e => !affectedEventIds.includes(e.id));

  if (activeEvents.length === 0) {
    return null; // Or a subtle "No active events" state if desired
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 1. What Changed (Relevant Events) */}
      {relevantEvents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            What Changed
          </h3>
          <div className="space-y-4">
            {relevantEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onResolve={onResolve} 
                isAffected={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Other Stadium Activity */}
      {otherEvents.length > 0 && (
        <div className="space-y-4">
          <button 
            onClick={() => setShowOther(!showOther)}
            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors w-full text-left"
          >
            {showOther ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Other Stadium Activity ({otherEvents.length})
          </button>
          
          <AnimatePresence>
            {showOther && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-2">
                  {otherEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onResolve={onResolve} 
                      isAffected={false}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
