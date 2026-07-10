"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Zap, Navigation, Car, Heart, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useFanState } from "@/store/FanStateProvider";
import { buildFanContext, type OnboardingFormData } from "@/engine/contextBuilder";
import { STADIUMS, STADIUM_ZONES } from "@/lib/constants";
import { WORLD_CUP_TEAMS } from "@/seed/internationalTeams";

const STEPS = [
  { label: "Account Setup", description: "Create your fan profile" },
  { label: "Match Info", description: "Select your upcoming match details" },
  { label: "Travel Profile", description: "How are you getting to the stadium?" },
  { label: "Preferences", description: "What matters most to you?" },
  { label: "Accessibility", description: "Any special requirements?" },
  { label: "Review", description: "Ready for matchday!" },
];

export function OnboardingWizard() {
  const router = useRouter();
  const { setFanContext } = useFanState();
  const [step, setStep] = useState<number>(0);
  
  const [data, setData] = useState<Partial<OnboardingFormData>>({
    fanId: "",
    password: "",
    matchId: "wc_match_01",
    stadiumId: "",
    section: "",
    modeOfTransport: "",
    arrivalTime: "",
    departurePlan: "",
    parkingRequired: false,
    interestedInFood: false,
    interestedInMerch: false,
    interestedInExperiences: false,
    favoriteTeam: "",
    notificationPreference: "Balanced",
    wheelchairAssistance: false,
    elderlyCompanion: false,
    childrenAccompanying: false,
    medicalAssistanceRequired: false,
    visualOrHearingNeeds: false,
  });

  const progress = ((step + 1) / STEPS.length) * 100;

  const updateData = (updates: Partial<OnboardingFormData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canProceed = () => {
    if (step === 0) return data.fanId !== "" && data.password !== "";
    if (step === 1) return data.stadiumId !== "" && data.section !== "";
    if (step === 2) return data.modeOfTransport !== "" && data.arrivalTime !== "" && data.departurePlan !== "";
    if (step === 3) return data.favoriteTeam !== "";
    return true; // Steps 4 and 5 (Accessibility and Review) don't have hard requirements
  };

  const handleComplete = () => {
    const context = buildFanContext(data as OnboardingFormData);
    setFanContext(context);
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-2xl">
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

        {/* Content */}
        <div className="px-6 py-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 0: ACCOUNT SETUP */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Account Setup</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Let&apos;s start with the basics for your fan profile.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 block">Fan ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. portugal_fan_07" 
                      value={data.fanId || ""}
                      onChange={(e) => updateData({ fanId: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-amber)] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 block">Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter a strong password" 
                      value={data.password || ""}
                      onChange={(e) => updateData({ password: e.target.value })}
                      className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-amber)] transition-colors"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 1: MATCH INFO */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Match Information</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Confirm your seat location for personalized stadium routing.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 block">Match & Stadium</label>
                    <select 
                      value={data.stadiumId || ""}
                      onChange={(e) => updateData({ stadiumId: e.target.value })}
                      className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-amber)] transition-colors appearance-none mb-2"
                    >
                      <option value="" disabled>Select Stadium</option>
                      {STADIUMS.map((stadium) => (
                        <option key={stadium.id} value={stadium.id}>
                          {stadium.name} ({stadium.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 block">Section</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {STADIUM_ZONES.map((section) => (
                        <button
                          key={section}
                          onClick={() => updateData({ section })}
                          className={cn(
                            "rounded-lg border px-3 py-3 text-sm font-medium transition-all text-center",
                            data.section === section
                              ? "border-[var(--accent-amber-border)] bg-[var(--accent-amber-glow)] text-[var(--accent-amber)]"
                              : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-default)]"
                          )}
                        >
                          {section}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 block">Row (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. M24" 
                      value={data.row || ""}
                      onChange={(e) => updateData({ row: e.target.value })}
                      className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-amber)] transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: TRAVEL PROFILE */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Travel Profile</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Help us optimize stadium flow by sharing your travel plans.</p>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 block">Mode of Transport</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {["Metro", "Bus", "Taxi", "Walking", "Personal Vehicle"].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => updateData({ modeOfTransport: mode })}
                          className={cn(
                            "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all text-center",
                            data.modeOfTransport === mode
                              ? "border-[var(--accent-emerald-border)] bg-[var(--accent-emerald-glow)] text-[var(--accent-emerald)]"
                              : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-default)]"
                          )}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 block">Arrival Time</label>
                      <select 
                        value={data.arrivalTime}
                        onChange={(e) => updateData({ arrivalTime: e.target.value })}
                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-amber)] transition-colors appearance-none"
                      >
                        <option value="" disabled>Select Arrival Time</option>
                        <option value="2+ hours before">2+ hours before</option>
                        <option value="90 mins before">90 mins before</option>
                        <option value="60 mins before">60 mins before</option>
                        <option value="Just before kickoff">Just before kickoff</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 block">Departure Plan</label>
                      <select 
                        value={data.departurePlan}
                        onChange={(e) => updateData({ departurePlan: e.target.value })}
                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-amber)] transition-colors appearance-none"
                      >
                        <option value="" disabled>Select Departure</option>
                        <option value="Immediately after match">Immediately after</option>
                        <option value="Stay after match">Stay after match</option>
                        <option value="Flexible">Flexible / Unknown</option>
                      </select>
                    </div>
                  </div>

                  {data.modeOfTransport === "Personal Vehicle" && (
                    <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                      <div className="flex items-center gap-3">
                        <Car className="h-5 w-5 text-[var(--text-muted)]" />
                        <div>
                          <p className="text-sm font-medium">Require Parking Pass?</p>
                          <p className="text-xs text-[var(--text-muted)]">Check if you need stadium parking directions.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateData({ parkingRequired: !data.parkingRequired })}
                        className={cn(
                          "w-12 h-6 rounded-full transition-colors relative",
                          data.parkingRequired ? "bg-[var(--accent-amber)]" : "bg-[var(--border-strong)]"
                        )}
                      >
                        <span className={cn(
                          "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform",
                          data.parkingRequired ? "transform translate-x-6" : ""
                        )} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 3: PREFERENCES */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Fan Preferences</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Review your details and let&apos;s get you into the match.</p>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 block">Favourite Team</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {WORLD_CUP_TEAMS.map((team) => (
                        <button
                          key={team.id}
                          onClick={() => updateData({ favoriteTeam: team.name })}
                          className={cn(
                            "rounded-lg border px-2 py-2 text-xs font-medium transition-all text-center",
                            data.favoriteTeam === team.name
                              ? "border-[var(--accent-blue-border)] bg-[var(--accent-blue-glow)] text-[var(--accent-blue)]"
                              : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-default)]"
                          )}
                        >
                          {team.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 block">Interests (Select Multiple)</label>
                    <div className="space-y-2">
                      {[
                        { key: "interestedInFood", label: "Food & Beverage Offers", desc: "Get pinged for zero-queue concession stands." },
                        { key: "interestedInMerch", label: "Merchandise Drops", desc: "Exclusive gear and flash sales." },
                        { key: "interestedInExperiences", label: "Fan Experiences", desc: "Meet & greets, stadium tours, pitch side access." }
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => updateData({ [item.key]: !data[item.key as keyof OnboardingFormData] })}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                            data[item.key as keyof OnboardingFormData]
                              ? "border-[var(--accent-amber-border)] bg-[var(--accent-amber-glow)]"
                              : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--border-default)]"
                          )}
                        >
                          <div>
                            <p className={cn("text-sm font-medium", data[item.key as keyof OnboardingFormData] ? "text-[var(--accent-amber)]" : "text-[var(--text-primary)]")}>{item.label}</p>
                            <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                          </div>
                          {data[item.key as keyof OnboardingFormData] && <Check className="h-4 w-4 text-[var(--accent-amber)]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 block">Notification Level</label>
                    <div className="flex bg-[var(--bg-elevated)] p-1 rounded-xl border border-[var(--border-subtle)]">
                      {["Minimal", "Balanced", "Proactive"].map((level) => (
                        <button
                          key={level}
                          onClick={() => updateData({ notificationPreference: level })}
                          className={cn(
                            "flex-1 py-2 text-xs font-medium rounded-lg transition-all",
                            data.notificationPreference === level
                              ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border-subtle)]"
                              : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: ACCESSIBILITY */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Accessibility & Safety</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Let us know if you need any special assistance on matchday.</p>
                </div>
                
                <div className="space-y-3">
                  {[
                    { key: "wheelchairAssistance", label: "Wheelchair Assistance", icon: Navigation },
                    { key: "elderlyCompanion", label: "Elderly Companion", icon: Heart },
                    { key: "childrenAccompanying", label: "Accompanying Children (< 12 yrs)", icon: ShieldAlert },
                    { key: "medicalAssistanceRequired", label: "Medical Assistance Required", icon: ShieldAlert },
                    { key: "visualOrHearingNeeds", label: "Visual / Hearing Assistance", icon: ShieldAlert },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => updateData({ [item.key]: !data[item.key as keyof OnboardingFormData] })}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                        data[item.key as keyof OnboardingFormData]
                          ? "border-[rgba(239,68,68,0.3)] bg-[var(--accent-red-glow)]"
                          : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--border-default)]"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", data[item.key as keyof OnboardingFormData] ? "text-[var(--accent-red)]" : "text-[var(--text-muted)]")} />
                      <span className={cn("text-sm font-medium", data[item.key as keyof OnboardingFormData] ? "text-[var(--accent-red)]" : "text-[var(--text-primary)]")}>
                        {item.label}
                      </span>
                      {data[item.key as keyof OnboardingFormData] && <Check className="h-4 w-4 ml-auto text-[var(--accent-red)]" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: REVIEW */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.15, stiffness: 200 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-emerald-glow)] border border-[rgba(16,185,129,0.3)]"
                  >
                    <Check className="h-8 w-8 text-[var(--accent-emerald)]" strokeWidth={2.5} />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Setup Complete</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Your AI context profile is ready.</p>
                </div>

                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Fan ID</p>
                      <p className="font-medium text-[var(--text-primary)]">{data.fanId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Team</p>
                      <p className="font-medium text-[var(--accent-blue)]">{data.favoriteTeam}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Seat Location</p>
                      <p className="font-medium text-[var(--text-primary)]">{data.section} {data.row ? `- ${data.row}` : ""}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Transport</p>
                      <p className="font-medium text-[var(--accent-emerald)]">{data.modeOfTransport}</p>
                    </div>
                  </div>
                </div>


                <Button
                  onClick={handleComplete}
                  className="w-full h-12 text-md bg-[var(--accent-emerald)] text-black hover:bg-[var(--accent-emerald-dim)] font-bold transition-colors"
                >
                  Enter Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer nav */}
        {step < STEPS.length - 1 && (
          <div className="px-6 pb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={back}
              disabled={step === 0}
              className="text-[var(--text-muted)] disabled:opacity-30 hover:text-[var(--text-primary)]"
            >
              <ArrowLeft className="mr-1 h-3 w-3" /> Back
            </Button>
            <Button
              size="sm"
              onClick={next}
              disabled={!canProceed()}
              className="bg-[var(--accent-amber)] text-black hover:bg-[var(--accent-amber-dim)] font-semibold disabled:opacity-40"
            >
              Continue <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
