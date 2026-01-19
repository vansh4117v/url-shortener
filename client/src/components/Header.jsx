import { useState } from "react";
import { useAuth } from "@/context/context";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetCode } from "@/api/auth";
import { env } from "@/config/env";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Briefcase, KeyRound, LogOut, User2 } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import { Button } from "./ui/button";

export default function Header() {
  const { user, loading } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();
  const [sendingCode, setSendingCode] = useState(false);

  const handleProfile = () => {
    return navigate("/dashboard");
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;

    setSendingCode(true);

    try {
      await sendPasswordResetCode(null, user.email);
      navigate("/auth/reset-password", { state: { email: user.email } });
    } catch (error) {
      console.error("Failed to send reset code:", error);
      navigate("/auth/reset-password", { state: { email: user.email } });
    } finally {
      setSendingCode(false);
    }
  };

  return (
    <header>
      <nav className="flex py-4 justify-between items-center">
        <Link to="/">
          <h1 className="text-2xl md:text-3xl font-semibold cursor-pointer italic">{env.SITE_NAME}</h1>
        </Link>
        <div className="flex gap-8 items-center">
          {!user && !loading && (
            <Button variant="outline" onClick={() => navigate("/auth/signin")}>
              Login
            </Button>
          )}
          {user && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full px-3 py-2 flex items-center gap-2 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <User2 size={18} />
                    </div>
                    <span className="hidden md:inline text-sm font-medium">
                      {user.name || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-gray-900 border-gray-800 text-white"
                >
                  <DropdownMenuLabel className="text-gray-400">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-gray-800" />

                  <DropdownMenuItem
                    onClick={handleProfile}
                    className="cursor-pointer text-gray-100 hover:bg-gray-800 focus:bg-gray-800 focus:text-white disabled:opacity-50"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem
                    onClick={handleChangePassword}
                    disabled={sendingCode}
                    className="cursor-pointer text-gray-100 hover:bg-gray-800 focus:bg-gray-800 focus:text-white disabled:opacity-50"
                  >
                    <KeyRound className="mr-2 h-4 w-4" />
                    {sendingCode ? "Sending code..." : "Change Password"}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-gray-800" />

                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-red-400 hover:bg-gray-800 focus:bg-gray-800 focus:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
