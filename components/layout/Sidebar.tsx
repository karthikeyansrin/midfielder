"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  Building2,
  Gift,
  LayoutDashboard,
  Settings,
  Shield,
  Target,
  Trophy,
  User,
  Users,
  Zap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV, ADMIN_NAV, APP_NAME } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { useFanState } from "@/store/FanStateProvider";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Zap,
  Gift,
  Target,
  User,
  Building2,
  Users,
  Trophy,
  Activity,
  BarChart3,
  Settings,
};

interface SidebarProps {
  variant: "dashboard" | "admin";
}

export function Sidebar({ variant }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { fanContext, clearFanContext } = useFanState();
  const navItems = variant === "admin" ? ADMIN_NAV : DASHBOARD_NAV;

  const handleSignOut = () => {
    clearFanContext();
    router.push("/onboarding");
  };

  return (
    <aside className="hidden lg:flex w-60 flex-col shrink-0 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] h-full min-h-screen">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 px-5 border-b border-[var(--border-subtle)]">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent-amber)] shadow-[0_0_10px_rgba(245,158,11,0.35)]">
          <Zap className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
        </div>
        <span className="font-display text-lg font-bold tracking-widest text-[var(--text-primary)]">
          {APP_NAME}
        </span>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3">
        <div className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium",
          variant === "admin"
            ? "bg-[var(--accent-red-glow)] border border-[rgba(239,68,68,0.2)] text-[var(--accent-red)]"
            : "bg-[var(--accent-emerald-glow)] border border-[rgba(16,185,129,0.2)] text-[var(--accent-emerald)]"
        )}>
          <Shield className="h-3 w-3" />
          {variant === "admin" ? "Admin Panel" : "Fan Dashboard"}
        </div>
      </div>

      <Separator className="bg-[var(--border-subtle)]" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" id="sidebar-nav">
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
          const isActive = pathname === item.href ||
            (item.href !== `/${variant}` && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-[var(--accent-amber-glow)] border border-[var(--accent-amber-border)] text-[var(--accent-amber)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-[var(--accent-amber)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                )}
              />
              {item.label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent-amber)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-[var(--border-subtle)]" />

      {/* Footer stub — profile or logout */}
      <div className="px-3 py-4 space-y-2">
        <div className="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2.5">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[var(--accent-amber)] to-[var(--accent-emerald)] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-[var(--text-primary)]">
              {variant === "admin" ? "Admin User" : (fanContext?.displayName || "Guest Fan")}
            </p>
            <p className="truncate text-[10px] text-[var(--text-muted)]">
              {variant === "admin" ? "super_admin" : (fanContext?.matchInfo?.section || "No Section")}
            </p>
          </div>
        </div>
        
        {variant !== "admin" && (
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors border border-transparent hover:border-[var(--border-subtle)]"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        )}
      </div>
    </aside>
  );
}
