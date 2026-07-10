// ─────────────────────────────────────────────
//  Firebase client initialization — MIDFIELDER
//  Reads credentials from env vars at runtime.
//  Business logic is NOT implemented here.
// ─────────────────────────────────────────────

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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
    } catch {
      // If already initialized somewhere else
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
