import { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close user dropdown when clicking outside
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
    `transition hover:text-[#3f71af] ${
      isActive ? "text-[#3f71af]" : "text-gray-700"
    }`;

  return (
    <nav className="w-full bg-white shadow-lg relative">
      <div className="max-w-425 mx-auto px-6 lg:px-35 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="src/assets/jomnorncode_logo (2).png"
            alt="Logo"
            className="w-18 h-20 object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-10 font-medium">
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

        {/* Right Side */}
        <div className="flex items-center space-x-6 relative">
          {/* Profile with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserOpen(!userOpen)}
              className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 transition"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5.121 17.804A4 4 0 019 16h6a4 4 0 013.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {userOpen && (
              <div className="absolute right-0 mt-3 w-44 bg-white rounded-lg shadow-lg border py-2">
                <Link
                  to="/signup"
                  onClick={() => setUserOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  បង្កើតគណនី
                </Link>
                <Link
                  to="/login"
                  onClick={() => setUserOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  ចូលគណនី
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
     {/* Mobile Menu */}
{mobileOpen && (
  <div className="md:hidden bg-blue-100 border-t">

    <div className="flex flex-col text-lg font-medium">

      <NavLink
        to="/"
        end
        onClick={() => setMobileOpen(false)}
        className="px-6 py-5 border-b border-gray-300"
      >
        ទំព័រដើម
      </NavLink>

      <NavLink
        to="/learn"
        onClick={() => setMobileOpen(false)}
        className="px-6 py-5 border-b border-blue-300"
      >
        ចូលរៀន
      </NavLink>

      <NavLink
        to="/course"
        onClick={() => setMobileOpen(false)}
        className="px-6 py-5 border-b border-gray-300"
      >
        វគ្គសិក្សា
      </NavLink>

      <NavLink
        to="/document"
        onClick={() => setMobileOpen(false)}
        className="px-6 py-5 border-b border-gray-300"
      >
        ឯកសារ
      </NavLink>

      <NavLink
        to="/about"
        onClick={() => setMobileOpen(false)}
        className="px-6 py-5"
      >
        អំពីយើង
      </NavLink>

    </div>

  </div>
)}
    </nav>
  );
}
