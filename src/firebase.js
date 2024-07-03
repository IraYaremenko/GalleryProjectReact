// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCj2f9TtzJ4y9tIRk-__VflpZP4dDl4UkY",
  authDomain: "galleryira-cc32d.firebaseapp.com",
  projectId: "galleryira-cc32d",
  storageBucket: "galleryira-cc32d.appspot.com",
  messagingSenderId: "176145077059",
  appId: "1:176145077059:web:bc0690bd084cfb428795f6",
  measurementId: "G-HGCW5RBX9E"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);