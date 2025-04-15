import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Input from "../components/Input";
import SingleLink from "../components/SingleLink";
import service from "../appwrite/database";

const Profile = () => {
	const userData = useSelector((state) => state.user.userData)
	// console.log("🚀 ~ Profile ~ userData:", userData)
	// const inputRef = useRef(null);
	const [searchTxt, setSearchTxt] = useState("");
	const [links, setLinks] = useState([]);

	const onDelete = async (shortUrl) => {
		try {
			const response = await service.deletePost(shortUrl);
			if (response) {
				setLinks((prevLinks) => prevLinks.filter((link) => link.shortUrl !== shortUrl));
			}
		} catch (error) {
			console.error("Error deleting link:", error);
			
		}
	}

	useEffect(() => {
		const fetchLinks = async () => {
			const response = await service.getPosts(userData.id);
			setLinks(response.documents);
		};
		fetchLinks();
	}, []);

	const filteredLinks = useMemo(() => {
        const query = searchTxt.trim().toLowerCase();
        return links.filter(link =>
            link.title.toLowerCase().includes(query) ||
            link.shortUrl.toLowerCase().includes(query) ||
            link.longUrl.toLowerCase().includes(query)
        );
    }, [searchTxt, links]);

	return (
		<div className="w-11/12 mx-auto p-2 text-white bg-[#000319]">
			<h1 className="font-bold text-2xl">{userData.name}</h1>
			<div className="font-semibold text-lg mb-6">{userData.email}</div>
			<div className="w-11/12 mx-auto lg:mx-0 lg:w-full">
				<Input
					placeholder="Search Links"
					className="w-full"
					value={searchTxt}
					onChange={(e) => setSearchTxt(e.target.value)}
				/>
			</div>

			
			{filteredLinks?.map(data => (
				<SingleLink key={data.$id}
				data={data}
				onDelete={onDelete}
			/>
			))}
		</div>
	);
};

export default Profile;
