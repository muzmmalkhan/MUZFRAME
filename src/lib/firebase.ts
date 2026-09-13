import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};

// Initialize Firebase using environment variables (Render) or fallback directly to your MuzFrame keys
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyBqm57qn8ItQOaFDM4OeXYh3SE0aYZPpUo",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "muzframe-studio.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "muzframe-studio",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "muzframe-studio.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "328717242887",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:328717242887:web:54cf4e3161bea60decd0a2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Force prompt to always select account
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { signInWithPopup };


