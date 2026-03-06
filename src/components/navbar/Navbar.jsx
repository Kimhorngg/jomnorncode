import { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { logOut } from "../../features/auth/authSlice";
// import { useLogoutApiMutation } from "../../services/authApi";
import { auth } from "../firebase/firebase-config";
import SignUp from "../../pages/SignUp";
import Login from "../../pages/LogIn";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true",
  );

  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // const [logoutApi] = useLogoutApiMutation();

  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Dark Mode Logic
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
    } catch {
      // Ignore if not a Firebase session
    }

    dispatch(logOut()); // Clear Redux state
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
    `transition hover:text-[#3f71af] block py-2 md:py-0 font-medium ${
      isActive ? "text-[#3f71af]" : "text-gray-700 dark:text-gray-300"
    }`;

  const getInitial = () => {
    if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return "U";
  };
  const avatarSrc =
    user?.profilePicture ||
    user?.photoURL ||
    user?.avatar ||
    user?.imageUrl ||
    user?.picture ||
    "";

  return (
    <nav className="w-full bg-white dark:bg-[#0f172a] relative z-100 transition-colors duration-300 shadow-sm">
      <div className="max-w-360 mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="/src/assets/jomnorncode_logo.png"
            alt="Logo"
            className="w-16 h-16 object-contain dark:brightness-110"
          />
        </Link>

        <ul className="hidden md:flex items-center space-x-10">
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

        <div className="flex items-center space-x-4 relative">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-yellow-400"
          >
            {isDarkMode ? (
              <IoSunnyOutline size={22} />
            ) : (
              <IoMoonOutline size={22} />
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserOpen(!userOpen)}
              className="group flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-transparent focus:border-blue-400"
            >
              {user ? (
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#3f71af] flex items-center justify-center bg-gray-200">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#3f71af] flex items-center justify-center text-white font-bold text-sm">
                      {getInitial()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-200">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
              <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-110 animate-in fade-in zoom-in duration-200">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b dark:border-gray-700 mb-1">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">
                        គណនីរបស់អ្នក
                      </p>
                      <p className="text-sm font-bold text-[#1f3a5f] dark:text-white truncate">
                        {user.fullName ||
                          (user.firstName
                            ? `${user.firstName} ${user.lastName}`
                            : user.username || "អ្នកប្រើប្រាស់")}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      ប្រវត្តិរូបសង្ខេប
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold text-red-600 transition-colors"
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
                      className="w-full text-left block px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      បង្កើតគណនីថ្មី
                    </button>
                    <button
                      onClick={() => {
                        setIsLoginOpen(true);
                        setUserOpen(false);
                      }}
                      className="w-full text-left block px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-bold text-gray-700 dark:text-gray-200"
                    >
                      ចូលប្រើប្រាស់
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            className="md:hidden dark:text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-[#0f172a] border-t dark:border-gray-800 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          <ul className="flex flex-col space-y-4">
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
