import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import {
  IoClose,
  IoEyeOffOutline,
  IoEyeOutline,
  IoMailOutline,
  IoLockClosedOutline,
} from "react-icons/io5";
import { useLoginMutation, useRegisterMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
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
  const token =
    data?.token ||
    data?.accessToken ||
    data?.jwt ||
    data?.data?.token ||
    data?.data?.accessToken ||
    null;
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
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const [register] = useRegisterMutation();
  const { logInWithGoogle, isPending: googlePending } = useGoogleAuth();
  const socialSubmittingRef = useRef(false);
  const isModal = typeof isOpen !== "undefined";

  const finishAuthSuccess = () => {
    if (isModal) onClose?.();
    else navigate("/profile");
  };

  const handleClose = () => {
    if (isModal) {
      onClose?.();
    } else {
      navigate(-1);
    }
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
        icon: "ជោគជ័យ",
        title: "ចូលបានជោគជ័យ",
        text: "ស្វាគមន៍មកកាន់ជំនាន់កូដ!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "កំហុស",
        title: "ចូលបរាជ័យ",
        text:
          err?.data?.message ||
          err?.message ||
          "អ៊ីមែល ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ",
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
      toast.success("ចូលដោយប្រើ Social-SignIn បានជោគជ័យ");
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

  const shouldRender = isOpen ?? true;
  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f2f4f]/60" onClick={handleClose} />
      <div
        className="relative w-full max-w-90 rounded-3xl bg-[#f7f5f2] p-6 shadow-2xl dark:bg-[#111827]"
        data-aos="zoom-in"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-slate-300 dark:hover:text-white"
        >
          <IoClose size={24} />
        </button>
        <h1 className="text-xl font-bold text-center text-[#1f3a5f] dark:text-white mb-1">
          សូមស្វាគមន៍​ការត្រឡប់មកវិញ
        </h1>
        <p className="text-center text-xs text-gray-500 dark:text-slate-300 mb-6">
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
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 bg-white text-slate-900 placeholder:text-gray-400 outline-none focus:border-[#4573a7] focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-[#6aa1e6] dark:focus:ring-blue-900/40"
            />
          </div>
          <div className="relative">
            <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              required
              type={showPassword ? "text" : "password"}
              placeholder="ពាក្យសម្ងាត់"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 text-sm rounded-xl border border-gray-300 bg-white text-slate-900 placeholder:text-gray-400 outline-none focus:border-[#4573a7] focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-[#6aa1e6] dark:focus:ring-blue-900/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#4573a7] dark:hover:text-[#6aa1e6]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4573a7] text-white py-2.5 rounded-xl font-bold hover:bg-[#355c87] disabled:opacity-50"
          >
            {isLoading ? "Checking..." : "ចូលគណនី"}
          </button>
        </form>
        <div className="flex items-center my-4 text-[10px] text-gray-400 dark:text-slate-400 uppercase tracking-widest">
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
          <span className="px-2">ឬ​បន្ត​ជា​មួយ</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
        </div>
        <div className="space-y-2">
          <button
            onClick={handleGoogleSocial}
            disabled={googlePending || socialSubmittingRef.current}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-xl bg-white py-2 text-sm font-semibold text-slate-900 hover:bg-gray-50 disabled:opacity-50 dark:border-slate-400 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-4 h-4"
            />
            <span className="text-slate-900 dark:text-white">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
