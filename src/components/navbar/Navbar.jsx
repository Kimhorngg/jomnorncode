import { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { logOut } from "../../features/auth/authSlice";
import { auth } from "../firebase/firebase-config";
import SignUp from "../../pages/SignUp";
import Login from "../../pages/LogIn";
import logoImage from "../../assets/jomnorncode_logo.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true",
  );

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {}

    dispatch(logOut());
    toast.success("Logout success");
    setUserOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `transition hover:text-[#3f71af] block py-2 md:py-0 font-medium text-base ${
      isActive ? "text-[#3f71af]" : "text-gray-700 dark:text-gray-300"
    }`;

  const avatarSrc =
    user?.profilePicture ||
    user?.photoURL ||
    user?.avatar ||
    user?.imageUrl ||
    user?.picture ||
    "";

  const getDisplayName = () => {
    if (user?.fullName) return user.fullName;
    if (user?.displayName) return user.displayName;
    if (user?.firstName || user?.lastName)
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    if (user?.username) return user.username;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const getInitial = () => {
    if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <nav className="w-full bg-white dark:bg-[#0f172a] relative z-100 shadow-sm">
      <div className="max-w-420 mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src={logoImage}
            alt="Logo"
            className="w-18 h-18 object-contain"
          />
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden lg:flex items-center space-x-10">
          <li>
            <NavLink to="/" end className={navLinkClass}>
              ទំព័រដើម
            </NavLink>
          </li>
          <li>
            <NavLink to="/learn" className={navLinkClass}>
              ចូលរៀន
            </NavLink>
          </li>
          <li>
            <NavLink to="/course" className={navLinkClass}>
              វគ្គសិក្សា
            </NavLink>
          </li>
          <li>
            <NavLink to="/document" className={navLinkClass}>
              ឯកសារ
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={navLinkClass}>
              អំពីយើង
            </NavLink>
          </li>
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-4">
          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileOpen((open) => !open)}
            className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
          {/* DARK MODE */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-slate-200"
          >
            {isDarkMode ? (
              <IoSunnyOutline size={22} />
            ) : (
              <IoMoonOutline size={22} />
            )}
          </button>

          {/* PROFILE */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserOpen(!userOpen)}
              className="flex items-center gap-2 rounded-full border px-1 py-1 pr-3 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {user ? (
                <>
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#3f71af] bg-gray-200">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="profile"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-[#3f71af] text-white font-bold">
                        {getInitial()}
                      </div>
                    )}
                  </div>

                  <span className="hidden sm:block text-sm font-semibold text-gray-700 dark:text-white">
                    {getDisplayName()}
                  </span>
                </>
              ) : (
                <div className="p-2 bg-gray-100 rounded-full dark:bg-slate-800">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </button>

            {userOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border py-2">
                {user ? (
                  <>
                    <div className="px-4 py-4 border-b dark:border-gray-700">
                      <p className="text-sm font-bold text-[#1f3a5f] dark:text-white">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      ប្រវត្តិរូបសង្ខេប
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      ចាកចេញពីគណនី
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsSignUpOpen(true);
                        setUserOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      បង្កើតគណនីថ្មី
                    </button>

                    <button
                      onClick={() => {
                        setIsLoginOpen(true);
                        setUserOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 font-bold"
                    >
                      ចូលប្រើប្រាស់
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800">
          <ul className="px-6 py-4 space-y-2">
            <li>
              <NavLink
                to="/"
                end
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                ទំព័រដើម
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/learn"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                ចូលរៀន
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/course"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                វគ្គសិក្សា
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/document"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                ឯកសារ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                អំពីយើង
              </NavLink>
            </li>
          </ul>
        </div>
      )}
      {/* LOGIN MODALS */}
      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        openSignUp={() => {
          setIsLoginOpen(false);
          setIsSignUpOpen(true);
        }}
      />

      <SignUp
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        openLogin={() => {
          setIsSignUpOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </nav>
  );
}
