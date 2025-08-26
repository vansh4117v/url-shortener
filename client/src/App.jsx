import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import RedirectUrl from "./pages/RedirectUrl";
import Layout from "./components/Layout";
import ShortLinkDetails from "./pages/ShortLinkDetails";
import RequireAuth from "./components/required-auth";
import { UrlProvider } from "./context/context";

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
        element: <Auth />,
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
