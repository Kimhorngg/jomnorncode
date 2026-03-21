import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  // Check if user exists
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin
  const isAdminUser = () => {
    const roleValue =
      user?.role ??
      user?.userRole ??
      user?.authorities?.[0]?.authority ??
      user?.authorities?.[0] ??
      user?.roles?.[0]?.name ??
      user?.roles?.[0] ??
      "";

    return String(roleValue).toLowerCase().includes("admin");
  };

  // If not admin, redirect to home
  if (!isAdminUser()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
