/// <reference types="vite/client" />
// Firebase Configuration & Fallback Persistence Engine

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDriveSenseDefaultKeyForProductionMode",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "drivesense-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "drivesense-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "drivesense-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109876543210",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:109876543210:web:abcdef1234567890",
};

// Check if actual Firebase credentials are ready or use robust local Firestore mock repository
export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID
);

// Key for local storage persistence
export const LOCAL_STORAGE_USER_KEY = 'drivesense_user_session';
export const LOCAL_STORAGE_TRIPS_KEY = 'drivesense_trips_data';
export const LOCAL_STORAGE_SETTINGS_KEY = 'drivesense_settings_data';
export const LOCAL_STORAGE_CONTACTS_KEY = 'drivesense_contacts_data';
export const LOCAL_STORAGE_NOTIFS_KEY = 'drivesense_notifs_data';
