import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";

export const metadata: Metadata = {
  title: "MIDFIELDER — AI-Powered Fan Engagement Platform",
  description:
    "Transform every stadium into an intelligent, connected experience. Real-time fan engagement, AI insights, and seamless stadium operations — all from one platform.",
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar variant="landing" />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}
