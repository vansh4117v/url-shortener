import { useDispatch, useSelector } from "react-redux";
import { setUrl } from "../store/urlSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Input from "../components/Input";

const Home = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	// console.log("🚀 ~ Home ~ isLoggedIn:", isLoggedIn);
	const ref = useRef();

	const handleClick = (e) => {
		e.preventDefault();
		dispatch(setUrl({longUrl:ref.current.value}));
		if (isLoggedIn) {
			navigate("/newLink");
		} else {
			navigate("/login");
		}
	};

	useEffect(() => {
		dispatch(setUrl({longUrl:"example"}));
	},[])

	return (
		<div className="flex-1 text-white p-5 text-center flex flex-col items-center">
			<h1 className="text-center font-extrabold text-3xl my-12 lg:my-10 lg:text-5xl">
				URL Shortener
			</h1>
			<form onSubmit={handleClick} className="flex flex-col w-full lg:flex-row lg:w-2/3 gap-4 items-center justify-center">
				<Input
					placeholder="Enter link to shorten"
					type="url"
					ref={ref}
				/>
				<button
					className="bg-red-500 w-4/5 lg:w-1/5 p-2 rounded-lg"
					type="submit"
				>
					Shorten!
				</button>
			</form>
		</div>
	);
};

export default Home;
