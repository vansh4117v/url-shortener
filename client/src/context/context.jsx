import { fetchUser } from "@/api/auth";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const UrlContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetchUser();
        if (response && response.success) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (loading) {
      fetchCurrentUser();
    }
  }, [loading]); 

  const isLoggedIn = !!user;
  
  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, loading }}>
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
