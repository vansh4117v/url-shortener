import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import authService from "../appwrite/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const Signup = () => {
	const [data, setData] = useState();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const longUrl = useSelector((state) => state.url.longUrl);

	const signup = async () => {
		setError("");
		setLoading(true);
		try {
			const response = await authService.createAccount(data);
			// console.log("🚀 ~ signup ~ response:", response);
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
			console.error("Error in Signup:", error);
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
			signup();
		}
	}, [data]);

	return (
		<>
			{loading && <Loading />}
			<Form
				signup={true}
				setData={setData}
				authError={error}
				setAuthError={setError}
			/>
		</>
	);
};

export default Signup;
