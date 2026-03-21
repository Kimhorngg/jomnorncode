// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyChYHJmSD-iDEIDn2XhrwDYzLzE8K6e_Dc",
  authDomain: "jomnorncode.firebaseapp.com",
  projectId: "jomnorncode",
  storageBucket: "jomnorncode.firebasestorage.app",
  messagingSenderId: "1052785221916",
  appId: "1:1052785221916:web:14e2d128ea3c7b794e9ad9",
  measurementId: "G-VLWQ476RQ8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth + Database + Storage
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Google provider
const googleProvider = new GoogleAuthProvider();

// Export
export { auth, db, storage, googleProvider };
