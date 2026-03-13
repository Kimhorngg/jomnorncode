import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase-config";

export const useGoogleAuth = () => {
  const [isPending, setIsPending] = useState(false);

  const logInWithGoogle = async () => {
    setIsPending(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);

      console.log("Google auth result:", result);
      console.log("Google auth user:", result.user);

      if (!result?.user) {
        throw new Error("Google sign in worked but Firebase returned no user");
      }

      return result.user;
    } catch (error) {
      console.error("Google auth error:", error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { logInWithGoogle, isPending };
};
