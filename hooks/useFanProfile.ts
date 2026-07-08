"use client";

// ─────────────────────────────────────────────
//  useFanProfile hook — MIDFIELDER platform
//  Fetches and caches the current fan profile.
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";
import type { FanProfile, FanStats } from "@/types/fan";

interface UseFanProfileReturn {
  profile: FanProfile | null;
  stats: FanStats | null;
  isLoading: boolean;
  error: string | null;
  mutate: (updates: Partial<FanProfile>) => Promise<void>;
}

/**
 * Hook for accessing the current fan's profile and stats.
 * TODO: Integrate with Firebase Auth to get the current user UID,
 *       then call getFanProfile() from firestoreService.
 *
 * @param fanId - The fan UID to fetch (optional; defaults to current auth user)
 */
export function useFanProfile(fanId?: string): UseFanProfileReturn {
  const [profile, setProfile] = useState<FanProfile | null>(null);
  const [stats, setStats] = useState<FanStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fanId) return;
    setIsLoading(true);
    setError(null);

    // TODO: Replace with real Firestore call
    // getFanProfile(fanId).then(setProfile).catch(...).finally(...)
    const mockProfile: FanProfile = {
      id: fanId,
      uid: fanId,
      displayName: "Alex Martinez",
      email: "alex@example.com",
      favouriteTeam: "MIDFIELDER FC",
      favouritePlayers: ["Player A", "Player B"],
      tier: "gold",
      points: 2450,
      matchesAttended: 34,
      joinedAt: "2023-08-15T10:00:00Z",
      preferences: {
        notifications: true,
        language: "en",
        seatingZone: "North Stand",
        dietaryRequirements: [],
      },
    };

    const mockStats: FanStats = {
      totalPoints: 2450,
      matchesAttended: 34,
      rewardsRedeemed: 12,
      currentStreak: 7,
      allTimeRank: 1423,
      tier: "gold",
      nextTierPoints: 5000,
    };

    setTimeout(() => {
      setProfile(mockProfile);
      setStats(mockStats);
      setIsLoading(false);
    }, 600);
  }, [fanId]);

  const mutate = async (updates: Partial<FanProfile>) => {
    // TODO: Call upsertFanProfile() from firestoreService
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  return { profile, stats, isLoading, error, mutate };
}
