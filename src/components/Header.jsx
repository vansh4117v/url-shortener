import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../store/userSlice";
import authService from "../appwrite/auth";

const Header = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

	const handleLogout = async () => {
		try {
			const response = await authService.logout();
			dispatch(removeUser());
			navigate("/login");
		} catch (error) {
			console.error("🚀 ~ handleLogout ~ error:", error);
		}
		dispatch(removeUser());
		navigate("/login");
	};

	return (
		<div className="flex justify-between items-center py-3 px-14 italic cursor-pointer text-white">
			<Link to="/" className="text-2xl font-bold">
				4117v
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
					<Link to="/register" className="cursor-pointer">
						Register
					</Link>
				)}
			</div>
		</div>
	);
};

export default Header;
