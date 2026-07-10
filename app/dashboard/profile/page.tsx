"use client";

import { useState } from "react";
import { useFanState } from "@/store/FanStateProvider";
import { User, MapPin, Car, ShieldAlert, Heart, Settings, Navigation, Edit2, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function FanProfilePage() {
  const { fanContext, setFanContext } = useFanState();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");

  if (!fanContext) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-[var(--text-muted)]">No profile loaded.</p>
      </div>
    );
  }

  const { displayName, id, matchInfo, travelProfile, preferences, accessibility } = fanContext;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">
          Fan Profile
        </h1>
        <p className="text-[var(--text-secondary)]">
          Manage your matchday context and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identity & Team */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-blue-glow)] border border-[rgba(59,130,246,0.3)]">
              <User className="h-5 w-5 text-[var(--accent-blue)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Identity</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Display Name</p>
                {isEditingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={editNameValue}
                      onChange={(e) => setEditNameValue(e.target.value)}
                      className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors w-full max-w-[200px]"
                      autoFocus
                    />
                    <button 
                      onClick={() => {
                        if (editNameValue.trim()) {
                          setFanContext({ ...fanContext, displayName: editNameValue.trim() });
                        }
                        setIsEditingName(false);
                      }}
                      className="p-1.5 rounded-md bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-blue-dim)] transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setIsEditingName(false)}
                      className="p-1.5 rounded-md bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-md font-medium text-[var(--text-primary)]">{displayName}</p>
                    <button 
                      onClick={() => {
                        setEditNameValue(displayName);
                        setIsEditingName(true);
                      }}
                      className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--accent-blue)] hover:bg-[var(--accent-blue-glow)] transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Fan ID</p>
              <p className="text-sm font-mono text-[var(--text-secondary)] bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-subtle)] break-all">{id}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Favourite Team</p>
              <p className="text-md font-medium text-[var(--accent-blue)]">{preferences.favoriteTeam}</p>
            </div>
          </div>
        </motion.div>

        {/* Seat Location */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-amber-glow)] border border-[rgba(245,158,11,0.3)]">
              <MapPin className="h-5 w-5 text-[var(--accent-amber)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Match & Seat</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Match ID</p>
              <p className="text-sm text-[var(--text-secondary)]">{matchInfo.matchId}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Stadium</p>
              <p className="text-sm text-[var(--text-secondary)]">{matchInfo.stadiumId}</p>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Section</p>
                <p className="text-md font-bold text-[var(--text-primary)]">{matchInfo.section}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Row</p>
                <p className="text-md font-bold text-[var(--text-primary)]">{matchInfo.row || "N/A"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Travel & Transport */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-emerald-glow)] border border-[rgba(16,185,129,0.3)]">
              <Car className="h-5 w-5 text-[var(--accent-emerald)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Travel Profile</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Mode of Transport</p>
              <p className="text-md font-medium text-[var(--text-primary)]">{travelProfile.modeOfTransport}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Arrival</p>
                <p className="text-sm text-[var(--text-secondary)]">{travelProfile.arrivalTime}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Departure</p>
                <p className="text-sm text-[var(--text-secondary)]">{travelProfile.departurePlan}</p>
              </div>
            </div>
            {travelProfile.parkingRequired && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[var(--accent-emerald-glow)] px-3 py-1 text-sm text-[var(--accent-emerald)] font-medium border border-[rgba(16,185,129,0.2)]">
                <Car className="h-4 w-4" /> Parking Pass Requested
              </div>
            )}
          </div>
        </motion.div>

        {/* Settings & Accessibility */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-6"
        >
          {/* Settings */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-5 w-5 text-[var(--text-muted)]" />
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Preferences</h2>
            </div>
            <div className="space-y-2 text-sm text-[var(--text-secondary)]">
              <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                <span>Notification Level</span>
                <span className="font-medium text-[var(--text-primary)]">{preferences.notificationPreference}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                <span>Food & Beverage Offers</span>
                <span className="font-medium text-[var(--text-primary)]">{preferences.interestedInFood ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                <span>Merchandise</span>
                <span className="font-medium text-[var(--text-primary)]">{preferences.interestedInMerch ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="h-5 w-5 text-[var(--text-muted)]" />
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Accessibility & Safety</h2>
            </div>
            {Object.values(accessibility).some(Boolean) ? (
              <ul className="space-y-2">
                {accessibility.wheelchairAssistance && (
                  <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Navigation className="h-4 w-4 text-[var(--accent-red)]" /> Wheelchair Assistance
                  </li>
                )}
                {accessibility.elderlyCompanion && (
                  <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Heart className="h-4 w-4 text-[var(--accent-red)]" /> Elderly Companion
                  </li>
                )}
                {accessibility.childrenAccompanying && (
                  <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <User className="h-4 w-4 text-[var(--accent-red)]" /> Accompanying Children
                  </li>
                )}
                {accessibility.medicalAssistanceRequired && (
                  <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <ShieldAlert className="h-4 w-4 text-[var(--accent-red)]" /> Medical Assistance
                  </li>
                )}
                {accessibility.visualOrHearingNeeds && (
                  <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <ShieldAlert className="h-4 w-4 text-[var(--accent-red)]" /> Visual/Hearing Needs
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">No special requirements specified.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
