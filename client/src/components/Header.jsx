import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/context";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "@/api/auth";

export default function Header() {
  const { isLoggedIn, setUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfile = () => {
    return navigate("/dashboard");
  };

  const onLogin = () => {
    return navigate("/auth");
  };

  const onLogout =  () => {
    logout();
    setUser(null);
    return navigate("/auth");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <Link to="/">Clixly</Link>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleProfile}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                </button>
                <button
                  onClick={onLogout}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
                >
                  Logout
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                </button>
              </>
            ) : (
              <>
                
                <button
                  onClick={onLogin}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-md transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                >
                  Login / Register
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3 pt-4">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      handleProfile();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-blue-600 font-medium py-2 px-2 hover:bg-gray-50 rounded transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-blue-600 font-medium py-2 px-2 hover:bg-gray-50 rounded transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-blue-600 font-medium py-2 px-2 hover:bg-gray-50 rounded transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:shadow transition-all"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
