
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBOL8qmprwHQH-DVzfshaGpgzNzL9sS7aY",
  authDomain: "smart-crm-7b2a4.firebaseapp.com",
  projectId: "smart-crm-7b2a4",
  storageBucket: "smart-crm-7b2a4.firebasestorage.app",
  messagingSenderId: "365935652934",
  appId: "1:365935652934:web:c9334b8091d277b7145a47",
  measurementId: "G-C5VPDMZMX2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
