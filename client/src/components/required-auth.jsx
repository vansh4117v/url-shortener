import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { useAuth } from "@/context/context";

function RequireAuth({ children }) {
  const navigate = useNavigate();

  const { loading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn && loading === false) navigate("/auth/signin");
  }, [isLoggedIn, loading, navigate]);

  if (loading) return <BarLoader width={"100%"} color="#36d7b7" />;

  if (isLoggedIn) return children;
}

export default RequireAuth;
