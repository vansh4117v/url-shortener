import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import service from "../appwrite/database";

const UrlRedirect = () => {
	const { shortUrl } = useParams();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const response = await service.getPost(shortUrl);
			if (response?.longUrl) {
				window.location.replace(response.longUrl);
			}
			else {
				setLoading(false);
			}
		};
		fetchData();
	}, []);
	return loading ? (
		<div className="text-2xl mt-8 text-center font-bold">loading...</div>
	) : (
		<div className="text-2xl mt-8 mx-auto">
			No such link found
		</div>
	);
};

export default UrlRedirect;
