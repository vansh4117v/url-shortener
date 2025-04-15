import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import authService from "../appwrite/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const Login = () => {
	const [data, setData] = useState();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const longUrl = useSelector((state) => state.url.longUrl);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const login = async () => {
		setError("");
		setLoading(true);
		try {
			const response = await authService.login(data);
			// console.log("🚀 ~ login ~ response:", response)
			if (response) {
				dispatch(
					setUser({
						name: response.name,
						email: response.email,
						id: response.$id,
					})
				);
				if (longUrl !== "example") {
					navigate("/newLink");
				} else {
					navigate("/");
				}
			}
		} catch (error) {
			console.error("Error logging in:", error);
			if (error?.message.toLowerCase() === "failed to fetch") {
				setError(
					"Some Error occurred. Please check your internet connection."
				);
			} else {
				setError(error?.message);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (data) {
			login();
		}
	}, [data]);

	return (
		<>
			{loading && <Loading />}
			<Form setData={setData} authError={error} setAuthError={setError} />
		</>
	);
};

export default Login;
