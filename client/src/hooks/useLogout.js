import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { signOut } from "../api/auth";

export const useLogout = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  const logout = async () => {
    try {
      // Call backend to clear refresh token cookie
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state and token
      clearAuth();
      navigate("/auth/signin", { replace: true });
    }
  };

  return logout;
};
