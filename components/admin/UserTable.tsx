"use client";

import { motion } from "framer-motion";
import { Search, Shield, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FanTier } from "@/types/fan";
import { FAN_TIERS } from "@/lib/constants";

interface UserRow {
  id: string;
  displayName: string;
  email: string;
  tier: FanTier;
  points: number;
  matchesAttended: number;
  joinedAt: string;
  active: boolean;
}

// Stub data — replace with Firestore query
const STUB_USERS: UserRow[] = [
  { id: "u1", displayName: "Alex Martinez", email: "alex@example.com", tier: "gold", points: 2450, matchesAttended: 34, joinedAt: "2023-08-15", active: true },
  { id: "u2", displayName: "Sam Chen", email: "sam@example.com", tier: "platinum", points: 7200, matchesAttended: 89, joinedAt: "2022-03-10", active: true },
  { id: "u3", displayName: "Jordan Kim", email: "jordan@example.com", tier: "silver", points: 820, matchesAttended: 12, joinedAt: "2024-01-20", active: true },
  { id: "u4", displayName: "Riley Osei", email: "riley@example.com", tier: "legend", points: 18500, matchesAttended: 210, joinedAt: "2019-09-01", active: true },
  { id: "u5", displayName: "Dana Webb", email: "dana@example.com", tier: "bronze", points: 120, matchesAttended: 3, joinedAt: "2025-07-01", active: false },
];

export function UserTable() {
  return (
    <div
      id="user-table"
      className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[var(--text-muted)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Fan Management</h3>
          <Badge variant="secondary" className="text-[10px] ml-1">
            {STUB_USERS.length} fans
          </Badge>
        </div>
        {/* Search stub */}
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          <input
            id="user-table-search"
            type="text"
            placeholder="Search fans…"
            className="bg-transparent text-xs text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] outline-none w-32"
            readOnly
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
              {["Fan", "Tier", "Points", "Matches", "Joined", "Status"].map((col) => (
                <th
                  key={col}
                  className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {STUB_USERS.map((user, i) => {
              const tier = FAN_TIERS[user.tier];
              return (
                <motion.tr
                  key={user.id}
                  id={`user-row-${user.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  {/* Fan */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[var(--accent-amber)] to-[var(--accent-emerald)] flex items-center justify-center text-[10px] font-bold text-black shrink-0">
                        {user.displayName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{user.displayName}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3 w-3" style={{ color: tier.color }} />
                      <span className="text-xs font-semibold" style={{ color: tier.color }}>
                        {tier.label}
                      </span>
                    </div>
                  </td>

                  {/* Points */}
                  <td className="px-5 py-3.5 font-mono text-xs font-medium text-[var(--text-primary)]">
                    {user.points.toLocaleString()}
                  </td>

                  {/* Matches */}
                  <td className="px-5 py-3.5 text-xs text-[var(--text-secondary)]">
                    {user.matchesAttended}
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-3.5 text-xs text-[var(--text-muted)]">
                    {new Date(user.joinedAt).getFullYear()}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                        user.active
                          ? "border-[rgba(16,185,129,0.3)] bg-[var(--accent-emerald-glow)] text-[var(--accent-emerald)]"
                          : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                      )}
                    >
                      <Shield className="h-2.5 w-2.5" />
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
