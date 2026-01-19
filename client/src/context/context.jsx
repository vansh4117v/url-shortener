import { getUser, refreshToken } from "@/api/auth";
import { getAccessToken, removeAccessToken, setAccessToken } from "@/utils/auth";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();
const UrlContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to clear auth state
  const clearAuth = useCallback(() => {
    setUser(null);
    removeAccessToken();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      
      // If no access token, try to refresh first
      if (!getAccessToken()) {
        try {
          const refreshData = await refreshToken();
          if (refreshData?.token) {
            setAccessToken(refreshData.token);
          } else {
            setUser(null);
            setError(null);
            setLoading(false);
            return;
          }
        } catch {
          setUser(null);
          setError(null);
          setLoading(false);
          return;
        }
      }

      try {
        const data = await getUser();
        setUser(data.data || null);
        setError(null);
      } catch (err) {
        clearAuth();
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [clearAuth]);

  const isLoaded = !loading;
  const isLoggedIn = Boolean(user);

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        loading, 
        isLoggedIn,
        error, 
        setUser, 
        isLoaded, 
        clearAuth 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UrlProvider = ({ children }) => {
  const [linkData, setLinkData] = useState({
    longUrl: "",
    shortId: "",
    title: "",
  });
  return <UrlContext.Provider value={{ linkData, setLinkData }}>{children}</UrlContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useUrl = () => {
  return useContext(UrlContext);
};
