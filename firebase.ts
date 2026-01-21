
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

// 1. Inicializa o App ANTES de tudo
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Inicializa os serviços usando a instância do app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// 3. Analytics condicional
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
