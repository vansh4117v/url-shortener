import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import AuthLayout from "./components/AuthLayout.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Result from "./pages/Result.jsx";
import UrlRedirect from "./pages/UrlRedirect.jsx";
import NewLink from "./pages/newLink.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: (
			<div className="text-center font-bold text-4xl">404 Not Found</div>
		),
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "login",
				element: (
					<AuthLayout authenticationNeeded={false}>
						<Login />
					</AuthLayout>
				),
			},
			{
				path: "signup",
				element: (
					<AuthLayout authenticationNeeded={false}>
						<Signup />
					</AuthLayout>
				),
			},
			{
				path: "newLink",
				element: (
					<AuthLayout authenticationNeeded={true}>
						<NewLink />
					</AuthLayout>
				),
			},
			{
				path: "result",
				element: (
					<AuthLayout authenticationNeeded={true}>
						<Result />
					</AuthLayout>
				),
			},
			
		],
	},
	{
		path: "/p/:shortUrl",
		element: <UrlRedirect />
	},
]);

createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>
);
