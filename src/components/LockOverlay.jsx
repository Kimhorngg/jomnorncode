import { IoLockClosed } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function LockOverlay() {
  const authState = useSelector((state) => state.auth);
  const reduxUser = authState?.user;
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    // Check Redux state
    const hasReduxUser = !!reduxUser;
    
    // Check localStorage as fallback
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const hasLocalStorageAuth = !!(storedUser && storedToken);
    
    // User is logged in if EITHER Redux OR localStorage has auth
    const loggedIn = hasReduxUser || hasLocalStorageAuth;
    
    setIsUserLoggedIn(loggedIn);
    
    const info = `Redux User: ${hasReduxUser} | LocalStorage: ${hasLocalStorageAuth} | Logged In: ${loggedIn}`;
    setDebugInfo(info);
    
    console.log("🔒 LockOverlay - Auth Check:", {
      hasReduxUser,
      reduxUser,
      hasLocalStorageAuth,
      storedUser: storedUser ? "exists" : "empty",
      storedToken: storedToken ? "exists" : "empty",
      finalLoggedIn: loggedIn
    });
  }, [reduxUser]);

  // Show overlay ONLY if user is NOT logged in
  const shouldShowOverlay = !isUserLoggedIn;
  
  console.log("🔒 Should show overlay:", shouldShowOverlay);

  if (!shouldShowOverlay) {
    return null;
  }

  const handleLockClick = () => {
    alert("ដេីម្បីរៀនបានអ្នកត្រូវបង្កេីតគណនីនិងចូលគណនីជាមុនសិន");
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 cursor-pointer"
        onClick={handleLockClick}
        style={{ pointerEvents: "auto" }}
      >
        <div
          className="flex flex-col items-center justify-center space-y-6"
          onClick={(e) => {
            e.stopPropagation();
            handleLockClick();
          }}
        >
          <div 
            className="bg-white rounded-full p-8 flex items-center justify-center shadow-2xl hover:shadow-3xl transition-shadow cursor-pointer"
            onClick={handleLockClick}
          >
            <IoLockClosed size={80} className="text-red-500" />
          </div>
          <div className="text-center">
            <p className="text-white text-xl font-bold px-4 mb-2">
              មេរៀនត្រូវបានបិទទេ
            </p>
            <p className="text-white text-center text-lg font-semibold px-4">
              ក្លីកលើរូបតំណាងដើម្បីលម្អិត
            </p>
          </div>
        </div>
      </div>
      {/* Debug Info - Remove in production */}
      <div className="fixed bottom-4 left-4 bg-red-600 text-white p-3 rounded text-xs z-40 max-w-xs">
        <p className="font-bold mb-1">🔒 Debug Info:</p>
        <p>{debugInfo}</p>
      </div>
    </>
  );
}
