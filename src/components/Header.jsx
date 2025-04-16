import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../store/userSlice";
import authService from "../appwrite/auth";
import Loading from "./Loading";

const Header = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const [loading, setLoading] = useState(false);

	const handleLogout = async () => {
		setLoading(true);
		try {
			const response = await authService.logout();
			dispatch(removeUser());
			navigate("/login");
		} catch (error) {
			console.error("🚀 ~ handleLogout ~ error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading && <Loading />}
			<div className="flex justify-between items-center py-3 lg:py-4 px-12 lg:px-20 border-b-2 border-slate-400 italic cursor-pointer text-white">
				<Link to="/" className="text-2xl font-bold">
					Clixly
				</Link>
				<div className="flex justify-between gap-6 text-xl">
					{isLoggedIn && (
						<Link to="/profile" className="cursor-pointer">
							Profile
						</Link>
					)}
					{isLoggedIn && (
						<div onClick={handleLogout} className="cursor-pointer">
							Logout
						</div>
					)}
					{!isLoggedIn && (
						<Link to="/login" className="cursor-pointer">
							Login
						</Link>
					)}
					{!isLoggedIn && (
						<Link to="/signup" className="cursor-pointer hidden lg:block">
							Register
						</Link>
					)}
				</div>
			</div>
		</>
	);
};

export default Header;
