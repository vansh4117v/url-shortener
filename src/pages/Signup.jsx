import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import authService from "../appwrite/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";

const Signup = () => {
	const [data, setData] = useState();
	const dispatch = useDispatch();
	const longUrl = useSelector((state) => state.url.longUrl);

	const signup = async () => {
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
			console.error("Error logging in:", error);
		}
	};

	useEffect(() => {
		if (data) {
			signup();
		}
	}, [data]);

	return <Form signup={true} setData={setData} />;
};

export default Signup;
