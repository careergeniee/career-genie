import { initializeApp } from "firebase/app";
import { initializeAuth, browserLocalPersistence } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: browserLocalPersistence,
});

// Firestore's default transport (WebChannel streaming) gets silently blocked
// or mangled on some restrictive networks/proxies/browser extensions, which
// surfaces as getDoc() rejecting with "Failed to get document because the
// client is offline" even though the network and Firestore rules are both
// fine (reproduced live: same account, same rules, ad-blocker disabled —
// still failed). auto-detecting long-polling falls back to plain HTTP
// long-polling, which is far more compatible with those environments, at a
// small latency cost only paid when the default transport actually fails.
export const db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
});

export default app;
