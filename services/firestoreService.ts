// ─────────────────────────────────────────────
//  Firestore Service — MIDFIELDER platform
//  Typed CRUD abstractions. Business logic TBD.
// ─────────────────────────────────────────────

import type { FanProfile, FanActivity } from "@/types/fan";
import type { Match } from "@/types/match";
import type { StadiumEvent } from "@/types/event";

// ── Collection names ────────────────────────────────────────────
export const COLLECTIONS = {
  fans: "fans",
  matches: "matches",
  stadiumEvents: "stadium_events",
  adminUsers: "admin_users",
  auditLogs: "audit_logs",
  fanActivities: "fan_activities",
} as const;

// ── Fan operations ──────────────────────────────────────────────

/**
 * Fetch a fan profile by UID.
 * TODO: Implement with getDoc(doc(db, COLLECTIONS.fans, uid))
 */
export async function getFanProfile(uid: string): Promise<FanProfile | null> {
  console.log("[firestoreService] getFanProfile:", uid);
  return null; // stub
}

/**
 * Create or update a fan profile.
 * TODO: Implement with setDoc(doc(db, COLLECTIONS.fans, uid), data, { merge: true })
 */
export async function upsertFanProfile(
  uid: string,
  data: Partial<FanProfile>
): Promise<void> {
  console.log("[firestoreService] upsertFanProfile:", uid, data);
}

/**
 * Get recent activity for a fan.
 * TODO: Implement with query + orderBy + limit
 */
export async function getFanActivity(
  fanId: string,
  limit = 20
): Promise<FanActivity[]> {
  console.log("[firestoreService] getFanActivity:", fanId, limit);
  return []; // stub
}

// ── Match operations ─────────────────────────────────────────────

/**
 * Get a match by ID.
 * TODO: Implement with getDoc
 */
export async function getMatch(matchId: string): Promise<Match | null> {
  console.log("[firestoreService] getMatch:", matchId);
  return null; // stub
}

/**
 * List upcoming or live matches.
 * TODO: Implement with query + where status in ["scheduled", "live"]
 */
export async function listMatches(status?: Match["status"]): Promise<Match[]> {
  console.log("[firestoreService] listMatches:", status);
  return []; // stub
}

// ── Stadium event operations ──────────────────────────────────────

/**
 * Write a batch of stadium events.
 * TODO: Implement with writeBatch
 */
export async function writeStadiumEvents(events: StadiumEvent[]): Promise<void> {
  console.log("[firestoreService] writeStadiumEvents:", events.length, "events");
}

/**
 * Get unresolved stadium events.
 * TODO: Implement with query + where resolved == false
 */
export async function getActiveStadiumEvents(): Promise<StadiumEvent[]> {
  console.log("[firestoreService] getActiveStadiumEvents");
  return []; // stub
}
