import {
  FacebookAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
}
from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase-config";

export const useFacebookAuth = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [user, setUser] = useState(null);

  const createFacebookProvider = () => {
    const provider = new FacebookAuthProvider();
    provider.addScope("email");
    provider.setCustomParameters({ display: "popup" });
    return provider;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const logInWithFacebook = async () => {
    setError(null);
    setIsPending(true);
    try {
      const res = await signInWithPopup(auth, createFacebookProvider());

      if (!res) {
        throw new Error("Could not complete signup");
      }

      setUser(res.user);
      setIsPending(false);
      console.log("Firebase Login Success:", res.user.displayName);
    } catch (err) {
      setError(err.message);
      setIsPending(false);
      console.error("Facebook Login Error: ", err.message);
    }
  };

  const facebookLogout = async () => {
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

  // Note: API Signup logic (signUpRequest) removed because API is not yet available.

  return { facebookLogout, logInWithFacebook, isPending, error, user };
};
