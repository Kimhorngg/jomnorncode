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
  const safeEmail = firebaseUser.email || `${firebaseUser.uid}@social.local`;
  const nameParts = (firebaseUser.displayName || "User Social")
    .trim()
    .split(" ");
  const firstName = nameParts[0] || "User";
  const lastName = nameParts.slice(1).join(" ") || "Social";
  return {
    email: safeEmail,
    password: `${firebaseUser.uid}_social_password`,
    firstName,
    lastName,
    username: `${safeEmail.split("@")[0]}_${firebaseUser.uid.substring(0, 4)}`
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, ""),
    // profilePicture: firebaseUser.photoURL || "",
    // photoURL: firebaseUser.photoURL || "",
  };
};

const normalizeAuthResponse = (res, fallbackUser = null) => {
  const data = res?.data || res;
  if (!data || data.success === false) return null;
  const token = data.token || null;
  const user = data.user
    ? { ...(fallbackUser || {}), ...data.user }
    : fallbackUser;
  if (user && fallbackUser) {
    if (!user.profilePicture)
      user.profilePicture = fallbackUser.profilePicture || "";
    if (!user.photoURL)
      user.photoURL =
        fallbackUser.photoURL || fallbackUser.profilePicture || "";
    if (!user.firstName) user.firstName = fallbackUser.firstName || "";
    if (!user.lastName) user.lastName = fallbackUser.lastName || "";
    if (!user.email) user.email = fallbackUser.email || "";
  }
  if (!user) return null;
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

  const finishAuthSuccess = () => {
    if (isModal) onClose?.();
    else navigate("/profile");
  };

  const setSocialLocalProfile = (firebaseUser) => {
    const user = buildSocialFallbackUser(firebaseUser);
    dispatch(setCredentials({ token: null, user }));
    toast.success("Social sign in success");
    finishAuthSuccess();
  };

  const syncSocialUserToBackend = async (firebaseUser) => {
    if (!firebaseUser || socialSubmittingRef.current) return;
    socialSubmittingRef.current = true;

    const fallbackUser = buildSocialFallbackUser(firebaseUser);
    const payload = { ...fallbackUser, password: firebaseUser.uid };

    try {
      const registerRes = await register(payload).unwrap();
      const authPayload = normalizeAuthResponse(registerRes, fallbackUser);
      if (!authPayload)
        throw new Error(registerRes?.message || "Register failed");
      dispatch(setCredentials(authPayload));
      toast.success("Social sign up success");
      finishAuthSuccess();
    } catch (registerErr) {
      try {
        const loginRes = await login({
          email: payload.email,
          password: payload.password,
        }).unwrap();
        const authPayload = normalizeAuthResponse(loginRes, fallbackUser);
        if (!authPayload) throw new Error(loginRes?.message || "Login failed");
        dispatch(setCredentials(authPayload));
        toast.success("Social login success");
        finishAuthSuccess();
      } catch (loginErr) {
        const message =
          registerErr?.data?.message ||
          registerErr?.message ||
          loginErr?.data?.message ||
          loginErr?.message ||
          "Social login failed";
        if (String(message).toLowerCase().includes("already exists")) {
          toast("Existing email is not linked to social password on backend.", {
            icon: "i",
          });
        } else {
          toast.error(`${message}. Using social profile only.`);
        }
        setSocialLocalProfile(firebaseUser);
      }
    } finally {
      socialSubmittingRef.current = false;
    }
  };

  const handleGoogleSocial = async () => {
    try {
      const firebaseUser = await logInWithGoogle();
      await syncSocialUserToBackend(firebaseUser);
    } catch {
      toast.error("Google sign in cancelled or failed");
    }
  };

  const handleFacebookSocial = async () => {
    try {
      const firebaseUser = await logInWithFacebook();
      await syncSocialUserToBackend(firebaseUser);
    } catch {
      toast.error("Facebook sign in cancelled or failed");
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) return;

    const nameParts = formData.name.trim().split(" ");
    const firstName = nameParts[0] || "User";
    const lastName =
      nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Student";

    try {
      const registerRes = await register({
        username: formData.email
          .split("@")[0]
          .toLowerCase()
          .replace(/[^a-z0-9]/g, ""),
        email: formData.email,
        password: formData.password,
        firstName,
        lastName,
        profilePicture: "",
      }).unwrap();

      const authPayload = normalizeAuthResponse(registerRes);
      if (!authPayload || !authPayload.token) {
        throw new Error(registerRes?.message || "Register failed");
      }

      dispatch(setCredentials(authPayload));
      toast.success("Sign up success");
      showSuccessAlert(firstName);
      finishAuthSuccess();
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Register failed");
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err?.data?.message || err?.message || "Register failed",
      });
    }
  };

  const shouldRender = isOpen ?? true;
  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f2f4f]/60" onClick={onClose} />
      <div className="relative w-full max-w-90 bg-[#f7f5f2] dark:bg-[#1e293b] rounded-3xl shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <IoClose size={24} />
        </button>

        <h1 className="text-xl font-bold text-center text-[#1f3a5f] dark:text-white mb-1">
          បង្កើតគណនី
        </h1>
        <p className="text-center text-xs text-gray-500 mb-6">
          មានគណនីហើយ?{" "}
          <button onClick={openLogin} className="text-[#ffa500] font-bold">
            ចូលបគណនី
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
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="relative">
            <IoMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              required
              type="email"
              placeholder="អាស័យដ្ឋានអ៊ីមែល"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-100"
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
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border  dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={isRegistering}
            className="w-full bg-[#4573a7] text-white py-2.5 rounded-xl font-bold hover:bg-[#355c87] disabled:opacity-50"
          >
            {isRegistering ? "Creating..." : "បង្កើតគណនី"}
          </button>
        </form>

        <div className="flex items-center my-4 text-[10px] text-gray-400 uppercase tracking-widest">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-2">ឬ​បន្ត​ជា​មួយ</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <div className="space-y-2">
          <button
            onClick={handleGoogleSocial}
            disabled={googlePending || socialSubmittingRef.current}
            className="w-full flex items-center justify-center gap-2 border rounded-xl py-2 text-xs dark:text-white hover:bg-gray-50 disabled:opacity-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-4 h-4"
            />
            Google
          </button>
          <button
            onClick={handleFacebookSocial}
            disabled={facebookPending || socialSubmittingRef.current}
            className="w-full flex items-center justify-center gap-2 border rounded-xl py-2 text-xs dark:text-white hover:bg-gray-50 disabled:opacity-50"
          >
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              className="w-4 h-4"
            />
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
