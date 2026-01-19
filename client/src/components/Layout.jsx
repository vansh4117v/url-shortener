import { Outlet } from "react-router-dom";
import Header from "./Header";
import { AuthProvider, UrlProvider } from "@/context/context";

const Layout = () => {
  return (
    <AuthProvider>
      <UrlProvider>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <header className="container mx-auto px-4 py-4">
            <Header />
          </header>

          <main className="flex-1 container mx-auto px-4">
            <Outlet />
          </main>

          <footer className="bg-white border-t border-gray-100 py-4">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
              Made by vansh4117v
            </div>
          </footer>
        </div>
        </UrlProvider>
    </AuthProvider>
  );
};

export default Layout;
