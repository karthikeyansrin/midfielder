import { create } from "zustand";
import { Recommendation, RecommendationStatus } from "@/domain/recommendation/Recommendation";

interface RecommendationState {
  recommendations: Recommendation[];
  activeRecommendation: Recommendation | null;
  
  // Actions
  addRecommendation: (recommendation: Recommendation) => void;
  updateStatus: (id: string, status: RecommendationStatus) => void;
  dismissActive: () => void;
  completeActive: () => void;
  expirePastRecommendations: (currentTime: string) => void;
}

export const useRecommendationStore = create<RecommendationState>((set, get) => ({
  recommendations: [],
  activeRecommendation: null,

  addRecommendation: (recommendation) => {
    set((state) => {
      const updatedRecommendations = [...state.recommendations];
      
      // If there's already an active recommendation, we should probably mark it as superseded/expired
      // or just keep it in history. We'll mark the currently active one as EXPIRED if a new one arrives.
      if (state.activeRecommendation) {
        const activeIndex = updatedRecommendations.findIndex(r => r.id === state.activeRecommendation?.id);
        if (activeIndex >= 0) {
          updatedRecommendations[activeIndex] = {
            ...updatedRecommendations[activeIndex],
            status: "EXPIRED",
          };
        }
      }

      updatedRecommendations.push(recommendation);

      return {
        recommendations: updatedRecommendations,
        activeRecommendation: recommendation,
      };
    });
  },

  updateStatus: (id, status) => {
    set((state) => {
      const updatedRecommendations = state.recommendations.map((rec) =>
        rec.id === id ? { ...rec, status } : rec
      );

      const active = state.activeRecommendation?.id === id 
        ? { ...state.activeRecommendation, status } 
        : state.activeRecommendation;
      
      // If status is no longer ACTIVE, remove it from activeRecommendation
      const newActive = status === "ACTIVE" ? active : null;

      return {
        recommendations: updatedRecommendations,
        activeRecommendation: newActive,
      };
    });
  },

  dismissActive: () => {
    const { activeRecommendation, updateStatus } = get();
    if (activeRecommendation) {
      updateStatus(activeRecommendation.id, "DISMISSED");
    }
  },

  completeActive: () => {
    const { activeRecommendation, updateStatus } = get();
    if (activeRecommendation) {
      updateStatus(activeRecommendation.id, "COMPLETED");
    }
  },

  expirePastRecommendations: (currentTime: string) => {
    set((state) => {
      let changed = false;
      const updatedRecommendations = state.recommendations.map((rec) => {
        if (rec.status === "ACTIVE" && rec.expiresAt && new Date(rec.expiresAt) < new Date(currentTime)) {
          changed = true;
          return { ...rec, status: "EXPIRED" as RecommendationStatus };
        }
        return rec;
      });

      if (!changed) return state;

      const active = state.activeRecommendation;
      const isNowExpired = active?.expiresAt && new Date(active.expiresAt) < new Date(currentTime);

      return {
        recommendations: updatedRecommendations,
        activeRecommendation: isNowExpired ? null : state.activeRecommendation,
      };
    });
  },
}));
