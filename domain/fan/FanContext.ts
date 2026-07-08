export interface MatchInfo {
  matchId: string;
  stadiumId: string;
  section: string;
  row?: string;
}

export type TransportMode =
  | "Metro"
  | "Bus"
  | "Taxi"
  | "Walking"
  | "Personal Vehicle"
  | "Unspecified";

export type DeparturePlan =
  | "Immediately after match"
  | "Stay after match"
  | "Flexible"
  | "Unspecified";

export interface TravelProfile {
  modeOfTransport: TransportMode;
  arrivalTime: string;
  departurePlan: DeparturePlan;
  parkingRequired: boolean;
}

export type NotificationLevel = "Minimal" | "Balanced" | "Proactive" | "Unspecified";

export interface FanPreferences {
  interestedInFood: boolean;
  interestedInMerch: boolean;
  interestedInExperiences: boolean;
  favoriteTeam: string;
  notificationPreference: NotificationLevel;
}

export interface Accessibility {
  wheelchairAssistance: boolean;
  elderlyCompanion: boolean;
  childrenAccompanying: boolean;
  medicalAssistanceRequired: boolean;
  visualOrHearingNeeds: boolean;
}

/**
 * FanContext represents the complete reasoning context for a fan.
 * It normalizes onboarding data into a structured format for the AI Decision Engine.
 */
export interface FanContext {
  id: string; // Typically the fan's UID
  displayName: string;
  matchInfo: MatchInfo;
  travelProfile: TravelProfile;
  preferences: FanPreferences;
  accessibility: Accessibility;
  updatedAt: string;
}
