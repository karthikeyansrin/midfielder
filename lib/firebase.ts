// ─────────────────────────────────────────────
//  Firebase client initialization — MIDFIELDER
//  Reads credentials from env vars at runtime.
//  Business logic is NOT implemented here.
// ─────────────────────────────────────────────

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

declare global {
  interface Window {
    __RUNTIME_ENV__: Record<string, string | undefined>;
  }
}

const getEnv = (key: string, originalKey: string) => {
  // 1. Try to get it from the runtime injection (Cloud Run fix)
  if (typeof window !== "undefined" && window.__RUNTIME_ENV__ && window.__RUNTIME_ENV__[key]) {
    return window.__RUNTIME_ENV__[key];
  }
  // 2. Fallback to standard process.env (Local dev / Build variables)
  return process.env[originalKey];
};

const firebaseConfig = {
  apiKey: getEnv("apiKey", "NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: getEnv("authDomain", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("projectId", "NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("storageBucket", "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("messagingSenderId", "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("appId", "NEXT_PUBLIC_FIREBASE_APP_ID"),
};


/** Singleton Firebase app instance */
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
  }
  return app;
}

export function getFirestoreDb(): Firestore {
  if (!db) {
    // In Next.js SSR/API routes, the Firebase client SDK can crash the Node process
    // with gRPC 'Listen' stream errors. Forcing long polling fixes this instability.
    try {
      db = initializeFirestore(getFirebaseApp(), { experimentalForceLongPolling: true });
    } catch (error) {
      // If already initialized somewhere else
      console.warn("Firestore already initialized, falling back to getFirestore:", error);
      db = getFirestore(getFirebaseApp());
    }
  }
  return db;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export { getFirebaseApp };
