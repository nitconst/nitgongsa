import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// push testing
const firebaseConfig = {
  apiKey: "AIzaSyDFJzAEwTuo4my8nQ4fsIS_ktyXv2YhN4g",
  authDomain: "gongsa-d233a.firebaseapp.com",
  projectId: "gongsa-d233a",
  storageBucket: "gongsa-d233a.appspot.com",
  messagingSenderId: "772155270923",
  appId: "1:772155270923:web:d64c6b9118ca3cfee8640e",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const authService = getAuth();
export const dbService = getFirestore();
export const storageService = getStorage();
