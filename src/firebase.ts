import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBsNoLSS62UWLgudug6J0et8PtxCgjjNCI",
  authDomain: "moto-cross-f74a8.firebaseapp.com",
  projectId: "moto-cross-f74a8",
  storageBucket: "moto-cross-f74a8.firebasestorage.app",
  messagingSenderId: "630610203452",
  appId: "1:630610203452:web:8d38dcefc98d2285c58439",
  measurementId: "G-6Z8572B9JF"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
