import React, { useEffect } from "react";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import authService from "./appwrite/auth";
import { removeUser, setUser } from "./store/userSlice";
import { useDispatch } from "react-redux";

const App = () => {
	const dispatch = useDispatch();
	const [loading, setLoading] = React.useState(true);

	useEffect(() => {
		authService
			.getCurrentUser()
			.then((response) => {
				if (response) {
					dispatch(
						setUser({
							name: response.name,
							email: response.email,
							id: response.$id,
						})
					);
				} else {
					dispatch(removeUser());
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);
	return loading ? (
		<div className="text-3xl min-h-screen w-full flex justify-center items-center font-bold">
			loading.....
		</div>
	) : (
		<div className="bg-[#000319] h-screen flex flex-col">
			<Header />
			<Outlet />
		</div>
	);
};

export default App;
