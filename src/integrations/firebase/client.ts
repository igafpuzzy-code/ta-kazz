import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || (typeof process !== "undefined" ? process.env.FIREBASE_API_KEY : undefined),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (typeof process !== "undefined" ? process.env.FIREBASE_AUTH_DOMAIN : undefined),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || (typeof process !== "undefined" ? process.env.FIREBASE_PROJECT_ID : undefined),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || (typeof process !== "undefined" ? process.env.FIREBASE_STORAGE_BUCKET : undefined),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || (typeof process !== "undefined" ? process.env.FIREBASE_MESSAGING_SENDER_ID : undefined),
  appId: import.meta.env.VITE_FIREBASE_APP_ID || (typeof process !== "undefined" ? process.env.FIREBASE_APP_ID : undefined),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || (typeof process !== "undefined" ? process.env.FIREBASE_MEASUREMENT_ID : undefined),
};

// Check for missing config in non-production, but don't crash immediately at build time
const isMissingConfig = !firebaseConfig.apiKey || !firebaseConfig.projectId;
if (isMissingConfig && typeof window !== "undefined") {
  console.warn(
    "[Firebase] Configuration variables are missing. Please define VITE_FIREBASE_* environment variables in your .env file."
  );
}

// Initialize Firebase App (ensure singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth & Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Safe initialization of Analytics for SSR
let analytics: any = null;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  });
}

// Sync Firebase Auth user info with localStorage on the client side
if (typeof window !== "undefined") {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Store token
      user.getIdToken().then((token) => {
        localStorage.setItem("token", token);
      });
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  });
}

export { app, auth, db, analytics };
export default app;


