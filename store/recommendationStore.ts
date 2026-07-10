import { create } from "zustand";
import { Recommendation, RecommendationStatus } from "@/domain/recommendation/Recommendation";
import { RecommendationRepository } from "@/repositories/RecommendationRepository";

interface RecommendationState {
  recommendations: Recommendation[];
  activeRecommendation: Recommendation | null;
  unsubscribeFn: (() => void) | null;
  
  // Actions
  subscribe: (fanId: string) => void;
  unsubscribe: () => void;
  dismissActive: () => void;
  completeActive: () => void;
  expirePastRecommendations: (currentTime: string) => void;
}

export const useRecommendationStore = create<RecommendationState>((set, get) => ({
  recommendations: [],
  activeRecommendation: null,
  unsubscribeFn: null,

  subscribe: (fanId: string) => {
    const currentUnsubscribe = get().unsubscribeFn;
    if (currentUnsubscribe) currentUnsubscribe();

    const unsubscribe = RecommendationRepository.subscribeToFanRecommendations(fanId, (recs) => {
      // Set the first ACTIVE recommendation as activeRecommendation
      const active = recs.find(r => r.status === "ACTIVE") || null;
      set({
        recommendations: recs,
        activeRecommendation: active
      });
    });

    set({ unsubscribeFn: unsubscribe });
  },

  unsubscribe: () => {
    const currentUnsubscribe = get().unsubscribeFn;
    if (currentUnsubscribe) currentUnsubscribe();
    set({ unsubscribeFn: null });
  },

  // updateStatus is removed, we update via Firestore directly

  dismissActive: () => {
    const { activeRecommendation } = get();
    if (activeRecommendation) {
      RecommendationRepository.updateRecommendationStatus(activeRecommendation.id, "DISMISSED").catch(console.error);
    }
  },

  completeActive: () => {
    const { activeRecommendation } = get();
    if (activeRecommendation) {
      RecommendationRepository.updateRecommendationStatus(activeRecommendation.id, "COMPLETED").catch(console.error);
    }
  },

  expirePastRecommendations: (currentTime: string) => {
    const { recommendations } = get();
    recommendations.forEach(rec => {
      if (rec.status === "ACTIVE" && rec.expiresAt && new Date(rec.expiresAt) < new Date(currentTime)) {
        RecommendationRepository.updateRecommendationStatus(rec.id, "EXPIRED").catch(console.error);
      }
    });
  },
}));
