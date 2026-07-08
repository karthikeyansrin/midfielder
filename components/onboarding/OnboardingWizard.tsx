"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const TEAMS = [
  "Arsenal", "Chelsea", "Liverpool", "Manchester City",
  "Manchester United", "Tottenham", "Newcastle", "Aston Villa",
];

const ZONES = [
  "North Stand", "South Stand", "East Stand",
  "West Stand", "VIP Lounge", "Family Zone",
];

const INTERESTS = [
  "Live Scores", "Predictions", "Player Stats",
  "Behind the Scenes", "Match Replays", "Fan Forums",
];

type Step = 0 | 1 | 2 | 3;

const STEPS = [
  { label: "Team", description: "Choose your favourite club" },
  { label: "Zone", description: "Where do you sit?" },
  { label: "Interests", description: "What matters most?" },
  { label: "Done", description: "You're all set!" },
];

export function OnboardingWizard() {
  const [step, setStep] = useState<Step>(0);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const progress = ((step + 1) / STEPS.length) * 100;

  const next = () => setStep((s) => Math.min(s + 1, 3) as Step);
  const back = () => setStep((s) => Math.max(s - 1, 0) as Step);

  const canProceed =
    (step === 0 && selectedTeam !== "") ||
    (step === 1 && selectedZone !== "") ||
    (step === 2 && selectedInterests.length > 0) ||
    step === 3;

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="w-full max-w-lg">
      {/* Card */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-[var(--shadow-lg)] overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent-amber)]">
              <Zap className="h-3 w-3 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-display text-sm font-bold tracking-widest text-[var(--text-muted)] uppercase">
              Fan Setup
            </span>
          </div>
          <Progress value={progress} className="h-1 bg-[var(--bg-elevated)]" />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-[var(--text-muted)]">
              Step {step + 1} of {STEPS.length}
            </p>
            <p className="text-xs font-medium text-[var(--accent-amber)]">
              {STEPS[step].label}
            </p>
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-6 min-h-[320px]">
          <AnimatePresence mode="wait">
            {/* Step 0 — Team selection */}
            {step === 0 && (
              <motion.div
                key="step-team"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                  Choose Your Club
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mb-5">
                  We&apos;ll personalise your experience around your team.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {TEAMS.map((team) => (
                    <button
                      key={team}
                      id={`onboarding-team-${team.toLowerCase().replace(/\s/g, "-")}`}
                      onClick={() => setSelectedTeam(team)}
                      className={cn(
                        "rounded-xl border px-3 py-3 text-sm font-medium text-left transition-all",
                        selectedTeam === team
                          ? "border-[var(--accent-amber)] bg-[var(--accent-amber-glow)] text-[var(--accent-amber)]"
                          : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]"
                      )}
                    >
                      {team}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1 — Zone selection */}
            {step === 1 && (
              <motion.div
                key="step-zone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                  Your Stadium Zone
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mb-5">
                  Select the section where you usually sit.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ZONES.map((zone) => (
                    <button
                      key={zone}
                      id={`onboarding-zone-${zone.toLowerCase().replace(/\s/g, "-")}`}
                      onClick={() => setSelectedZone(zone)}
                      className={cn(
                        "rounded-xl border px-3 py-3 text-sm font-medium text-left transition-all",
                        selectedZone === zone
                          ? "border-[var(--accent-amber)] bg-[var(--accent-amber-glow)] text-[var(--accent-amber)]"
                          : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]"
                      )}
                    >
                      {zone}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2 — Interests */}
            {step === 2 && (
              <motion.div
                key="step-interests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                  Your Interests
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mb-5">
                  Select everything that interests you (pick multiple).
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {INTERESTS.map((interest) => {
                    const selected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        id={`onboarding-interest-${interest.toLowerCase().replace(/\s/g, "-")}`}
                        onClick={() => toggleInterest(interest)}
                        className={cn(
                          "flex items-center justify-between rounded-xl border px-3 py-3 text-sm font-medium text-left transition-all",
                          selected
                            ? "border-[var(--accent-emerald)] bg-[var(--accent-emerald-glow)] text-[var(--accent-emerald)]"
                            : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]"
                        )}
                      >
                        {interest}
                        {selected && <Check className="h-3 w-3 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3 — Success */}
            {step === 3 && (
              <motion.div
                key="step-done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center h-full py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.15, stiffness: 200 }}
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-emerald-glow)] border border-[rgba(16,185,129,0.3)]"
                >
                  <Check className="h-8 w-8 text-[var(--accent-emerald)]" strokeWidth={2.5} />
                </motion.div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  You&apos;re in the squad! 🎉
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mb-1">
                  Team: <span className="text-[var(--accent-amber)] font-medium">{selectedTeam}</span>
                </p>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  Zone: <span className="text-[var(--text-primary)] font-medium">{selectedZone}</span>
                </p>
                <a
                  href="/dashboard"
                  id="onboarding-go-to-dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-amber)] px-6 py-3 text-sm font-bold text-black hover:bg-[var(--accent-amber-dim)] transition-colors"
                >
                  Enter Fan Hub
                  <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        {step < 3 && (
          <div className="px-6 pb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={back}
              disabled={step === 0}
              id="onboarding-back"
              className="text-[var(--text-muted)] disabled:opacity-30"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back
            </Button>
            <Button
              size="sm"
              onClick={next}
              disabled={!canProceed}
              id="onboarding-next"
              className="bg-[var(--accent-amber)] text-black hover:bg-[var(--accent-amber-dim)] font-semibold disabled:opacity-40"
            >
              {step === 2 ? "Finish" : "Continue"}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
