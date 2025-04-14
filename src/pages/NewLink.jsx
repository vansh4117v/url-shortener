import { useDispatch, useSelector } from "react-redux";
import { setUrl } from "../store/urlSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import service from "../appwrite/database";
import { nanoid } from "@reduxjs/toolkit";

const NewLink = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const defaultUrl = useSelector((state) => state.url.longUrl);
	const userId = useSelector((state) => state.user.userData.id);
	// console.log("🚀 ~ NewLink ~ defaultUrl:", defaultUrl);
	const {
		register,
		handleSubmit,
		setValue,
		setError,
		formState: { errors },
	} = useForm({
		defaultValues: {
			url: defaultUrl === "example" ? "" : defaultUrl,
			title: "",
			customLink: "",
		},
	});

	const onSubmit = async (data) => {
		// console.log("🚀 ~ onSubmit ~ data:", data);
		try {
			const response = await service.createPost({
				shortUrl: data.customLink || nanoid(5),
				longUrl: data.url,
				title: data.title,
				userId: userId,
			});
			// console.log("🚀 ~ onSubmit ~ response:", response);
			if (response == 409 && !data.customLink) {
				try {
					shortUrl = nanoid(5);
					const response = await service.createPost({
						shortUrl,
						longUrl: data.url,
						title: data.title,
						userId,
					});

					dispatch(
						setUrl({
							longUrl: response.longUrl,
							title: response.title,
							shortUrl: response.shortUrl,
						})
					);
					navigate("/result");
					return;
				} catch (err) {
					console.log("⚠️ Second attempt also failed:", err);
					setError("customLink", {
						type: "manual",
						message: `Failed to generate a unique link. Try again.`,
					});
				}
			}
			if (response == 409) {
				console.log("🚀 ~ onSubmit ~ response inside if:", response);
				setError("customLink", {
					type: "manual",
					message: `${data.customLink} is already taken`,
				});
			} else {
				dispatch(
					setUrl({
						longUrl: response.longUrl,
						title: response.title,
						shortUrl: response.shortUrl,
					})
				);
				navigate("/result");
			}
		} catch (error) {
			console.log("🚀 ~ onSubmit ~ error:", error);
		}
	};

	useEffect(() => {
		if (defaultUrl === "example") {
			// console.log("🚀 ~ useEffect ~ defaultUrl:", defaultUrl);
			setValue("url", "", { shouldRender: true });
		}
	}, [defaultUrl, setValue]);

	if (defaultUrl === undefined)
		return <p className="text-white">Loading...</p>;

	return (
		<div className="flex-1 text-white p-5 text-center flex flex-col items-center">
			<h1 className="text-center font-extrabold text-3xl my-12 lg:my-10 lg:text-5xl">
				URL Shortener
			</h1>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col w-full lg:w-2/3 gap-4 items-center justify-center"
			>
				<Input
					placeholder="Enter link to shorten"
					type="url"
					{...register("url", { required: "URL is required" })}
				/>
				{errors.url && (
					<p className="text-red-600 -mt-4 text-center">
						{errors.url.message}
					</p>
				)}
				<Input
					placeholder="Link Title"
					{...register("title", { required: "Title is required" })}
				/>
				{errors.title && (
					<p className="text-red-600 -mt-4 text-center">
						{errors.title.message}
					</p>
				)}
				<Input
					placeholder="Custom URL(optional)"
					{...register("customLink", {
						pattern: {
							value: /^[a-zA-Z0-9-_]*$/,
							message:
								"Only alphanumeric, hyphen and underscore allowed",
						},
					})}
				/>
				{errors.customLink && (
					<p className="text-red-600 -mt-4 text-center">
						{errors.customLink.message}
					</p>
				)}
				<button
					type="submit"
					className="bg-red-500 w-4/5 lg:w-1/5 p-2 rounded-lg"
				>
					Shorten!
				</button>
			</form>
		</div>
	);
};

export default NewLink;
