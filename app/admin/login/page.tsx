"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Loader2, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsLoading(true);
    setError("");

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    if (username.trim() === "admin" && password === "admin") {
      localStorage.setItem("midfielder_admin_auth", "true");
      router.push("/admin");
    } else {
      setError("Invalid credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pitch-grid">
      <Navbar variant="landing" />
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-red)] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-[var(--shadow-lg)] overflow-hidden glass">
            <div className="p-8 sm:p-10">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-red-glow)] border border-[rgba(239,68,68,0.3)] mb-6">
                  <Shield aria-hidden="true" className="h-6 w-6 text-[var(--accent-red)]" strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                  Mission Control
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mt-2">
                  Secure access for stadium operators.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--accent-red-glow)] px-3 py-1.5 text-xs font-medium text-[var(--accent-red)] border border-[rgba(239,68,68,0.2)]">
                  <span>Test Credentials: <strong className="font-bold tracking-wider">admin</strong> / <strong className="font-bold tracking-wider">admin</strong></span>
                </div>
              </div>

              <form onSubmit={handleLogin} aria-label="Admin login form" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User aria-hidden="true" className="h-5 w-5 text-[var(--text-muted)]" />
                      </div>
                      <input
                        id="username"
                        type="text"
                        placeholder="Operator ID"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-red)] focus:ring-1 focus:ring-[var(--accent-red)] transition-colors"
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
                        className="block w-full pl-10 pr-3 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-red)] focus:ring-1 focus:ring-[var(--accent-red)] transition-colors"
                        required
                      />
                    </div>
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
                  disabled={isLoading || !username.trim() || !password.trim()}
                  className="w-full h-12 text-md bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] font-bold transition-all shadow-[var(--shadow-sm)] disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Access Control <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
