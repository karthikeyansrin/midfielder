import type { Metadata } from "next";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Join the Arena — MIDFIELDER",
  description:
    "Create your fan profile, choose your team, and unlock the full MIDFIELDER experience.",
};

export default function OnboardingPage() {
  return (
    <div className="flex flex-col min-h-screen pitch-grid">
      <Navbar variant="landing" />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <OnboardingWizard />
      </main>
    </div>
  );
}
