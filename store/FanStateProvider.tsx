"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { FanContext } from "@/domain/fan/FanContext";

interface FanStateContextType {
  fanContext: FanContext | null;
  setFanContext: (context: FanContext) => void;
  clearFanContext: () => void;
  isHydrated: boolean;
}

const FanStateContext = createContext<FanStateContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = "midfielder_fan_context";

export function FanStateProvider({ children }: { children: React.ReactNode }) {
  const [fanContext, setFanContextState] = useState<FanContext | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setFanContextState(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse stored FanContext", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const setFanContext = (context: FanContext) => {
    setFanContextState(context);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(context));
    } catch (e) {
      console.error("Failed to save FanContext to localStorage", e);
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
