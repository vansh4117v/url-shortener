import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import RedirectUrl from "./pages/RedirectUrl";
import Layout from "./components/Layout";
import ShortLinkDetails from "./pages/ShortLinkDetails";
import RequireAuth from "./components/required-auth";
import { UrlProvider } from "./context/context";
import SignUpPage from "./pages/auth/SignUpPage";
import SignInPage from "./pages/auth/SignInPage";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <div>Error occurred</div>,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "auth",
        children: [
          {
            path: "signup",
            element: <SignUpPage />,
          },
          {
            path: "signin",
            element: <SignInPage />,
          },
          {
            path: "verify-email",
            element: <EmailVerificationPage />,
          },
          {
            path: "forgot-password",
            element: <ForgotPasswordPage />,
          },
          {
            path: "reset-password",
            element: <ResetPasswordPage />,
          },
        ],
      },
      {
        path: "dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: "/link/:id",
        element: (
          <RequireAuth>
            <ShortLinkDetails />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "/:shortId",
    element: <RedirectUrl />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
