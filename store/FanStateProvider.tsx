"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { FanContext } from "@/domain/fan/FanContext";
import { FanRepository } from "@/repositories/FanRepository";

interface FanStateContextType {
  fanContext: FanContext | null;
  setFanContext: (context: FanContext) => void;
  clearFanContext: () => void;
  isHydrated: boolean;
}

const FanStateContext = createContext<FanStateContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = "midfielder_fan_id";

export function FanStateProvider({ children }: { children: React.ReactNode }) {
  const [fanContext, setFanContextState] = useState<FanContext | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadFan = async () => {
      try {
        const storedId = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedId) {
          const profile = await FanRepository.getFan(storedId);
          if (profile) {
            setFanContextState(profile);
          }
        }
      } catch (e) {
        console.error("Failed to load FanContext from Firestore", e);
      } finally {
        setIsHydrated(true);
      }
    };
    loadFan();
  }, []);

  const setFanContext = (context: FanContext) => {
    setFanContextState(context);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, context.id);
      // It's the caller's responsibility to save to Firestore via FanRepository,
      // but we do it here as a safety measure.
      FanRepository.saveFan(context).catch(console.error);
    } catch (e) {
      console.error("Failed to save fanId to localStorage", e);
    }
  };

  const clearFanContext = () => {
    setFanContextState(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to remove FanContext from localStorage", e);
    }
  };

  return (
    <FanStateContext.Provider
      value={{ fanContext, setFanContext, clearFanContext, isHydrated }}
    >
      {children}
    </FanStateContext.Provider>
  );
}

export function useFanState() {
  const context = useContext(FanStateContext);
  if (context === undefined) {
    throw new Error("useFanState must be used within a FanStateProvider");
  }
  return context;
}
