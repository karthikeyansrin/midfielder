"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Loader2, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useFanState } from "@/store/FanStateProvider";
import { FanRepository } from "@/repositories/FanRepository";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const { setFanContext } = useFanState();
  const [fanId, setFanId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fanId.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const fan = await FanRepository.getFan(fanId.trim());
      if (fan) {
        if (fan.password && fan.password !== password) {
          setError("Incorrect password.");
          return;
        }
        setFanContext(fan);
        router.push("/dashboard");
      } else {
        setError("Fan profile not found. Please check your ID or create a new profile.");
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("Failed to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pitch-grid">
      <Navbar variant="landing" />
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-amber)] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-[var(--shadow-lg)] overflow-hidden glass">
            <div className="p-8 sm:p-10">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-amber)] shadow-[0_0_15px_rgba(245,158,11,0.4)] mb-6">
                  <Zap aria-hidden="true" className="h-6 w-6 text-black" strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                  Welcome Back to {APP_NAME}
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mt-2">
                  Enter your Fan ID to access your personalized matchday context.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--accent-amber-glow)] px-3 py-1.5 text-xs font-medium text-[var(--accent-amber)] border border-[rgba(245,158,11,0.2)]">
                  <span>Test Credentials: <strong className="font-bold tracking-wider">test</strong> / <strong className="font-bold tracking-wider">test</strong></span>
                </div>
              </div>

              <form onSubmit={handleLogin} aria-label="Fan login form" className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="fanId" className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
                    Fan ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User aria-hidden="true" className="h-5 w-5 text-[var(--text-muted)]" />
                    </div>
                    <input
                      id="fanId"
                      type="text"
                      placeholder="e.g. fan_..."
                      value={fanId}
                      onChange={(e) => setFanId(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-amber)] focus:ring-1 focus:ring-[var(--accent-amber)] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User aria-hidden="true" className="h-5 w-5 text-[var(--text-muted)] opacity-0" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-amber)] focus:ring-1 focus:ring-[var(--accent-amber)] transition-colors"
                    />
                  </div>
                  {error && (
                    <motion.p 
                      role="alert"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-xs text-[var(--accent-red)] mt-2 font-medium"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !fanId.trim()}
                  className="w-full h-12 text-md bg-[var(--accent-amber)] text-black hover:bg-[var(--accent-amber-dim)] font-bold transition-all shadow-[var(--shadow-amber)] disabled:opacity-50 disabled:shadow-none"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Enter Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
            
            <div className="px-8 py-5 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-center">
              <p className="text-sm text-[var(--text-secondary)]">
                Don&apos;t have an ID?{" "}
                <button 
                  onClick={() => router.push("/onboarding")}
                  className="font-semibold text-[var(--accent-amber)] hover:underline focus:outline-none"
                >
                  Create your profile
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
