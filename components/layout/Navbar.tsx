"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useFanState } from "@/store/FanStateProvider";

interface NavbarProps {
  variant?: "landing" | "dashboard" | "admin";
}

export function Navbar({ variant = "landing" }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { fanContext } = useFanState();

  const getBreadcrumbName = () => {
    if (variant === "admin") return "admin";
    if (variant === "dashboard" && fanContext) return fanContext.displayName.toLowerCase();
    return "fan";
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "glass border-b border-[var(--border-subtle)]"
      )}
    >
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" id="navbar-logo">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-amber)] shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-shadow group-hover:shadow-[0_0_20px_rgba(245,158,11,0.6)]">
            <Zap className="h-4 w-4 text-black" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold tracking-widest text-[var(--text-primary)]">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop nav links — landing only */}
        {variant === "landing" && (
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Dashboard breadcrumb */}
        {(variant === "dashboard" || variant === "admin") && (
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-[var(--text-muted)]">{getBreadcrumbName()}</span>
            <ChevronDown className="h-3 w-3 text-[var(--text-muted)] -rotate-90" />
            <span className="text-[var(--text-secondary)]">
              {(() => {
                const lastSegment = pathname?.split("/").pop();
                if (!lastSegment || lastSegment === "admin" || lastSegment === "dashboard") {
                  return "overview";
                }
                return lastSegment;
              })()}
            </span>
          </div>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {variant === "landing" ? (
            <>
              <Link href="/admin/login" className="hidden lg:block">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)]"
                  id="navbar-admin"
                >
                  Admin
                </Button>
              </Link>
              <Link href="/login" className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  id="navbar-login"
                >
                  Fan Login
                </Button>
              </Link>
              <Link href="/onboarding" className="hidden md:block">
                <Button
                  size="sm"
                  className="bg-[var(--accent-amber)] text-black hover:bg-[var(--accent-amber-dim)] font-semibold shadow-[var(--shadow-amber)]"
                  id="navbar-get-started"
                >
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* Notification bell */}
              {/* <button
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-default)] hover:text-[var(--text-primary)]"
                id="navbar-notifications"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--accent-amber)]" />
              </button> */}

              {/* User avatar stub */}
              {/* <button
                className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1.5 transition-colors hover:border-[var(--border-default)]"
                id="navbar-user-menu"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[var(--accent-amber)] to-[var(--accent-emerald)]" />
                <span className="hidden text-sm font-medium text-[var(--text-secondary)] sm:block">
                  {variant === "admin" ? "Admin" : "Fan"}
                </span>
                <ChevronDown className="h-3 w-3 text-[var(--text-muted)]" />
              </button> */}
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            id="navbar-mobile-toggle"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          id="mobile-menu"
          className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] md:hidden"
        >
          <div className="px-4 py-4 space-y-2">
            {variant === "landing" &&
              NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {link.label}
                </a>
              ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/admin/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full justify-start border-[var(--border-subtle)] text-[var(--text-secondary)]" id="mobile-nav-admin">
                  Mission Control
                </Button>
              </Link>
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start" id="mobile-nav-login">
                  Fan Login
                </Button>
              </Link>
              <Link href="/onboarding" onClick={() => setMobileOpen(false)}>
                <Button
                  size="sm"
                  className="w-full bg-[var(--accent-amber)] text-black hover:bg-[var(--accent-amber-dim)] font-semibold"
                  id="mobile-nav-onboarding"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
