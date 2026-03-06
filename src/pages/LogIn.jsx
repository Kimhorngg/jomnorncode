import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import { IoClose, IoMailOutline, IoLockClosedOutline } from "react-icons/io5";
import { useLoginMutation, useRegisterMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useFacebookAuth } from "../components/social-auth/FacebookAuth";
import { useGoogleAuth } from "../components/social-auth/GoogleAuth";
import { useNavigate } from "react-router-dom";
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
    firstName,
    lastName,
    username: `${safeEmail.split("@")[0]}_${firebaseUser.uid.substring(0, 4)}`
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, ""),
    profilePicture: firebaseUser.photoURL || "",
    photoURL: firebaseUser.photoURL || "",
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

export default function Login({ isOpen, onClose, openSignUp }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const [register] = useRegisterMutation();
  const { logInWithGoogle, isPending: googlePending } = useGoogleAuth();
  const { logInWithFacebook, isPending: facebookPending } = useFacebookAuth();
  const socialSubmittingRef = useRef(false);
  const isModal = typeof isOpen !== "undefined";

  const finishAuthSuccess = () => {
    if (isModal) onClose?.();
    else navigate("/profile");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await login({ email, password }).unwrap();
      const authPayload = normalizeAuthResponse(loginRes);
      if (!authPayload || !authPayload.token) {
        throw new Error(loginRes?.message || "Login failed");
      }

      dispatch(setCredentials(authPayload));
      toast.success("Login success");
      finishAuthSuccess();
      Swal.fire({
        icon: "success",
        title: "Login success",
        text: "Welcome back",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text:
          err?.data?.message ||
          err?.message ||
          "Email or password is incorrect",
      });
    }
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
      toast.success("Social sign in success");
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
        dispatch(setCredentials({ token: null, user: fallbackUser }));
        finishAuthSuccess();
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
          សូមស្វាគមន៍​ការត្រឡប់មកវិញ
        </h1>
        <p className="text-center text-xs text-gray-500 mb-6">
          មិនទាន់មានគណនី?{" "}
          <button onClick={openSignUp} className="text-[#ffa500] font-bold">
            បង្កើតគណនី
          </button>
        </p>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="relative">
            <IoMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              required
              type="email"
              placeholder="អាស័យដ្ឋានអ៊ីមែល"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border dark:bg-gray-700 dark:text-white outline-none"
            />
          </div>
          <div className="relative">
            <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              required
              type="password"
              placeholder="ពាក្យសម្ងាត់"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border dark:bg-gray-700 dark:text-white outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4573a7] text-white py-2.5 rounded-xl font-bold hover:bg-[#355c87] disabled:opacity-50"
          >
            {isLoading ? "Checking..." : "ចូលគណនី"}
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
