import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} 
from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase-config";

export const useGoogleAuth = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [user, setUser] = useState(null);

  // Create provider instance
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const logInWithGoogle = async () => {
    setError(null);
    setIsPending(true);
    try {
      // FIX: Pass (auth, provider) and use await
      const res = await signInWithPopup(auth, provider);

      if (!res) {
        throw new Error("Could not complete signup");
      }

      setUser(res.user);
      setIsPending(false);
    } catch (err) {
      setError(err.message);
      setIsPending(false);
      console.error("Google Login Error: ", err.message);
    }
  };

  const googleLogout = async () => {
    setError(null);
    setIsPending(true);
    try {
      await signOut(auth);
      setIsPending(false);
      console.log("Logout successfully");
    } catch (err) {
      setError(err.message);
      setIsPending(false);
    }
  };

  // Return everything inside the hook
  return { googleLogout, logInWithGoogle, isPending, error, user };
};