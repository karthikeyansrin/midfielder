import {
  FanContext,
  MatchInfo,
  TravelProfile,
  FanPreferences,
  Accessibility,
  TransportMode,
  DeparturePlan,
  NotificationLevel,
} from "@/domain/fan/FanContext";
import { generateId } from "@/lib/utils";

// This represents the flat structure typically coming from the onboarding form state
export interface OnboardingFormData {
  fanId?: string;
  displayName: string;
  matchId: string;
  stadiumId: string;
  section: string;
  row?: string;
  modeOfTransport: string;
  arrivalTime: string;
  departurePlan: string;
  parkingRequired: boolean;
  interestedInFood: boolean;
  interestedInMerch: boolean;
  interestedInExperiences: boolean;
  favoriteTeam: string;
  notificationPreference: string;
  wheelchairAssistance: boolean;
  elderlyCompanion: boolean;
  childrenAccompanying: boolean;
  medicalAssistanceRequired: boolean;
  visualOrHearingNeeds: boolean;
  password?: string;
}

/**
 * Transforms raw onboarding form data into a structured FanContext object.
 * Applies defaults and validates enums to ensure type safety for the AI engine.
 */
export function buildFanContext(data: OnboardingFormData): FanContext {
  const matchInfo: MatchInfo = {
    matchId: data.matchId || "default-match",
    stadiumId: data.stadiumId || "default-stadium",
    section: data.section || "General",
    row: data.row || null,
  };

  const travelProfile: TravelProfile = {
    modeOfTransport: (data.modeOfTransport as TransportMode) || "Unspecified",
    arrivalTime: data.arrivalTime || "90 mins before kickoff",
    departurePlan: (data.departurePlan as DeparturePlan) || "Unspecified",
    parkingRequired: Boolean(data.parkingRequired),
  };

  const preferences: FanPreferences = {
    interestedInFood: Boolean(data.interestedInFood),
    interestedInMerch: Boolean(data.interestedInMerch),
    interestedInExperiences: Boolean(data.interestedInExperiences),
    favoriteTeam: data.favoriteTeam || "Unspecified",
    notificationPreference:
      (data.notificationPreference as NotificationLevel) || "Balanced",
  };

  const accessibility: Accessibility = {
    wheelchairAssistance: Boolean(data.wheelchairAssistance),
    elderlyCompanion: Boolean(data.elderlyCompanion),
    childrenAccompanying: Boolean(data.childrenAccompanying),
    medicalAssistanceRequired: Boolean(data.medicalAssistanceRequired),
    visualOrHearingNeeds: Boolean(data.visualOrHearingNeeds),
  };

  return {
    id: data.fanId || `fan_${generateId()}`,
    displayName: data.fanId || "Fan",
    matchInfo,
    travelProfile,
    preferences,
    accessibility,
    updatedAt: new Date().toISOString(),
    ...(data.password ? { password: data.password } : {}),
  };
}
