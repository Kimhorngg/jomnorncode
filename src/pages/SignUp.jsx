import React, { useRef, useState } from "react";
import {
  IoClose,
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { useFacebookAuth } from "../components/social-auth/FacebookAuth";
import { useGoogleAuth } from "../components/social-auth/GoogleAuth";
import { useRegisterMutation, useLoginMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const buildSocialFallbackUser = (firebaseUser) => {
  const safeEmail =
    firebaseUser?.email || `${firebaseUser?.uid || "socialuser"}@social.local`;

  const socialPassword = firebaseUser?.uid || "social-password";

  const nameParts = (firebaseUser?.displayName || "User Social")
    .trim()
    .split(/\s+/);

  const firstName = nameParts[0] || "User";
  const lastName = nameParts.slice(1).join(" ") || "Social";

  const emailPrefix = safeEmail
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return {
    email: safeEmail,
    password: socialPassword,
    firstName,
    lastName,
    username: `${emailPrefix}_${(firebaseUser?.uid || "social").slice(0, 6)}`,
    profilePicture: firebaseUser?.photoURL || "",
    photoURL: firebaseUser?.photoURL || "",
  };
};

const normalizeAuthResponse = (res, fallbackUser = null) => {
  const data = res?.data || res;

  if (!data || data.success === false) return null;

  const token = data?.token || null;
  const user = data?.user
    ? { ...(fallbackUser || {}), ...data.user }
    : fallbackUser;

  if (!user) return null;

  if (fallbackUser) {
    user.profilePicture =
      user.profilePicture || fallbackUser.profilePicture || "";
    user.photoURL =
      user.photoURL ||
      fallbackUser.photoURL ||
      fallbackUser.profilePicture ||
      "";
    user.firstName = user.firstName || fallbackUser.firstName || "";
    user.lastName = user.lastName || fallbackUser.lastName || "";
    user.email = user.email || fallbackUser.email || "";
    user.username = user.username || fallbackUser.username || "";
  }

  return { token, user };
};

export default function SignUp({ isOpen, onClose, openLogin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { logInWithFacebook, isPending: facebookPending } = useFacebookAuth();
  const { logInWithGoogle, isPending: googlePending } = useGoogleAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [login] = useLoginMutation();

  const socialSubmittingRef = useRef(false);
  const isModal = typeof isOpen !== "undefined";

  const shouldRender = isOpen ?? true;
  if (!shouldRender) return null;

  const finishAuthSuccess = () => {
    if (isModal) onClose?.();
    else navigate("/profile");
  };

  const showSuccessAlert = (name) => {
    Swal.fire({
      icon: "success",
      title: "Sign up success",
      text: `Welcome to JomnornCode, ${name}!`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const syncSocialUserToBackend = async (
    firebaseUser,
    providerName = "Social",
  ) => {
    if (!firebaseUser?.uid) {
      throw new Error(`${providerName} user data not found`);
    }

    if (socialSubmittingRef.current) return;
    socialSubmittingRef.current = true;

    const fallbackUser = buildSocialFallbackUser(firebaseUser);

    const payload = {
      username: fallbackUser.username,
      email: fallbackUser.email,
      password: fallbackUser.password,
      firstName: fallbackUser.firstName,
      lastName: fallbackUser.lastName,
      profilePicture: fallbackUser.profilePicture,
    };

    try {
      let authPayload = null;

      try {
        const registerRes = await register(payload).unwrap();
        authPayload = normalizeAuthResponse(registerRes, fallbackUser);
      } catch (registerErr) {
        console.error(`${providerName} register failed:`, registerErr);

        const loginRes = await login({
          email: payload.email,
          password: payload.password,
        }).unwrap();

        authPayload = normalizeAuthResponse(loginRes, fallbackUser);
      }

      if (!authPayload?.token) {
        throw new Error(`${providerName} auth failed: token not returned`);
      }

      dispatch(setCredentials(authPayload));
      toast.success(`${providerName} sign in success`);
      finishAuthSuccess();
    } catch (err) {
      const message =
        err?.data?.message || err?.message || `${providerName} sign in failed`;

      Swal.fire({
        icon: "error",
        title: `${providerName} Sign In Failed`,
        text: message,
      });

      console.error(`${providerName} auth error:`, err);
    } finally {
      socialSubmittingRef.current = false;
    }
  };

  const handleGoogleSocial = async () => {
    try {
      const firebaseUser = await logInWithGoogle();

      if (!firebaseUser?.uid) {
        throw new Error(
          "Google sign in succeeded but no Firebase user was returned",
        );
      }

      console.log("Google Firebase user:", firebaseUser);
      toast.success("Google sign in success");
      finishAuthSuccess();
    } catch (err) {
      toast.error(err?.message || "Google sign in cancelled or failed");
      console.error("Google sign in error:", err);
    }
  };

  const handleFacebookSocial = async () => {
    try {
      const firebaseUser = await logInWithFacebook();

      console.log("Facebook firebase user:", firebaseUser);

      if (!firebaseUser?.uid) {
        throw new Error(
          "Facebook sign in succeeded but no Firebase user was returned",
        );
      }

      await syncSocialUserToBackend(firebaseUser, "Facebook");
    } catch (err) {
      toast.error(err?.message || "Facebook sign in cancelled or failed");
      console.error("Facebook sign in error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) return;

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const trimmedPassword = formData.password.trim();

    const nameParts = trimmedName.split(/\s+/);
    const firstName = nameParts[0] || "User";
    const lastName =
      nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Student";

    const emailPrefix = trimmedEmail
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    const username = `${emailPrefix}_${Date.now().toString().slice(-5)}`;

    try {
      const registerRes = await register({
        username,
        email: trimmedEmail,
        password: trimmedPassword,
        firstName,
        lastName,
        profilePicture: "",
      }).unwrap();

      let authPayload = normalizeAuthResponse(registerRes);

      if (!authPayload?.token) {
        const loginRes = await login({
          email: trimmedEmail,
          password: trimmedPassword,
        }).unwrap();

        authPayload = normalizeAuthResponse(loginRes);
      }

      if (!authPayload?.token) {
        throw new Error("Register succeeded but login failed");
      }

      dispatch(setCredentials(authPayload));
      toast.success("Sign up success");
      showSuccessAlert(firstName);
      finishAuthSuccess();
    } catch (err) {
      const message = err?.data?.message || err?.message || "Register failed";

      toast.error(message);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: message,
      });

      console.error("Email sign up error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f2f4f]/60" onClick={onClose} />

      <div
        className="relative w-full max-w-[360px] rounded-3xl bg-[#f7f5f2] p-6 shadow-2xl dark:bg-[#1e293b]"
        data-aos="zoom-in"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <IoClose size={24} />
        </button>

        <h1 className="mb-1 text-center text-xl font-bold text-[#1f3a5f] dark:text-white">
          បង្កើតគណនី
        </h1>

        <p className="mb-6 text-center text-xs text-gray-500">
          មានគណនីហើយ?{" "}
          <button onClick={openLogin} className="font-bold text-[#ffa500]">
            ចូលគណនី
          </button>
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <IoPersonOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              required
              type="text"
              placeholder="ឈ្មោះពេញ"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <IoMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              required
              type="email"
              placeholder="អាសយដ្ឋានអ៊ីមែល"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              required
              type="password"
              placeholder="ពាក្យសម្ងាត់"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full rounded-xl bg-[#4573a7] py-2.5 font-bold text-white hover:bg-[#355c87] disabled:opacity-50"
          >
            {isRegistering ? "Creating..." : "បង្កើតគណនី"}
          </button>
        </form>

        <div className="my-4 flex items-center text-[10px] uppercase tracking-widest text-gray-400">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="px-2">ឬ​បន្ត​ជា​មួយ</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleSocial}
            disabled={googlePending || socialSubmittingRef.current}
            className="flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-xs hover:bg-gray-50 disabled:opacity-50 dark:text-white"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-4 w-4"
            />
            Google
          </button>

          <button
            type="button"
            onClick={handleFacebookSocial}
            disabled={facebookPending || socialSubmittingRef.current}
            className="flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-xs hover:bg-gray-50 disabled:opacity-50 dark:text-white"
          >
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
              className="h-4 w-4"
            />
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
