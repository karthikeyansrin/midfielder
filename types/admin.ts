// ─────────────────────────────────────────────
//  Admin types — MIDFIELDER platform
// ─────────────────────────────────────────────

export type AdminRole = "super_admin" | "stadium_manager" | "content_editor" | "analyst";

export interface AdminUser {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  lastLogin: string;
  active: boolean;
}

export type AdminPermission =
  | "manage_fans"
  | "manage_matches"
  | "simulate_events"
  | "view_analytics"
  | "manage_content"
  | "manage_admins"
  | "export_data";

export interface PlatformMetrics {
  totalFans: number;
  activeFansToday: number;
  totalMatches: number;
  upcomingMatches: number;
  rewardsDistributed: number;
  avgEngagementScore: number;
  newFansThisWeek: number;
  retentionRate: number;
}

export interface AdminAlert {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  link?: string;
}

export interface SystemHealth {
  apiLatencyMs: number;
  databaseStatus: "healthy" | "degraded" | "down";
  firestoreStatus: "healthy" | "degraded" | "down";
  geminiStatus: "healthy" | "degraded" | "down";
  uptimePercent: number;
  lastChecked: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  ipAddress?: string;
}
