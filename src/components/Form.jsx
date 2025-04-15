import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Input from "./Input";

const Form = ({ signup = "", setData, authError = null,setAuthError }) => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const submitForm = (data) => {
		setData(data);
	};

	const email = watch("email");
	const password = watch("password");

	useEffect(() => {
		if (authError && (email || password)) {
			setAuthError(null);
		}
	}, [email, password]);

	return (
		<form
			onSubmit={handleSubmit(submitForm)}
			className="border-2 border-white gap-8 text-white w-4/5 lg:w-1/3 rounded-md text-center flex flex-col mx-auto mt-10 items-center py-6 pb-12 lg:px-8"
		>
			<h1 className="text-3xl font-bold">
				{signup ? "Signup" : "Login"}
			</h1>
			<div className="-mt-6">
				{signup ? (
					<>
						Already have an account?{" "}<Link to="/login"><u>Login</u></Link>
					</>
				) : (
					<>
						Don't have any account?{" "}
						<Link to="/signup">
							<u>SignUp</u>
						</Link>
					</>
				)}
			</div>

			{authError && (
				<p className="text-red-600 text-center px-5">{authError}</p>
			)}

			{signup && (
				<>
					<Input
						placeholder="Name"
						type="text"
						{...register("name", { required: "Name is required" })}
					/>
					{errors.name && (
						<p className="text-red-600 -mt-4 text-center">
							{errors.name.message}
						</p>
					)}
				</>
			)}

			<Input
				placeholder="Email"
				type="email"
				{...register("email", { required: "Email is required" })}
			/>
			{errors.email && (
				<p className="text-red-600 -mt-4 text-center">
					{errors.email.message}
				</p>
			)}

			<Input
				placeholder="Password"
				type="password"
				{...register("password", {
					required: "Password is required",
					pattern: {
						value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
						message:
							"Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
					},
				})}
			/>

			{errors.password && (
				<p className="text-red-600 -mt-4 text-center">
					{errors.password.message}
				</p>
			)}

			{signup && (
				<>
					<Input
						placeholder="Confirm Password"
						type="password"
						{...register("confirmPassword", {
							required: "Please confirm your password",
							validate: (value) =>
								value === password || "Passwords do not match",
						})}
					/>
					{errors.confirmPassword && (
						<p className="text-red-600 -mt-4 text-center">
							{errors.confirmPassword.message}
						</p>
					)}
				</>
			)}

			<button
				type="submit"
				className="bg-inherit p-2 px-4 rounded-lg border-2 border-white hover:bg-white hover:text-black transition duration-300"
			>
				{signup ? "Sign Up" : "Login"}
			</button>
		</form>
	);
};

export default Form;
