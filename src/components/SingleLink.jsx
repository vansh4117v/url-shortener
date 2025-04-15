import React from "react";

const SingleLink = ({ data, onDelete }) => {
	const handleDelete = () => {
		onDelete(data.shortUrl);
	};
	
	return (
		<div className="w-full mx-auto flex border-2 border-white mt-4 lg:mt-6 p-2 rounded-md gap-1 h-26 lg:h-30 items-center">
			<img
				className="w-[75px] h-[75px] lg:w-[100px] lg:h-[100px] object-contain"
				src={`https://api.qrserver.com/v1/create-qr-code/?size=${
					window.innerWidth > 1024 ? "100x100" : "75x75"
				}&data=${`${window.location.origin}/p/${data?.shortUrl}`}`}
				alt=""
			/>
			<div className="px-2 w-[calc(100%-75px)] lg:w-[calc(100%-100px)] -mt-1">
				<div className="font-semibold text-xl w-full truncate flex justify-between relative">
					<div>{data.title}</div>
					<div className="flex gap-4 h-full items-center">
					<div
						className="cursor-pointer text-base"
						onClick={(e) => {
							navigator.clipboard.writeText(
								`${window.location.origin}/p/${data?.shortUrl}`
							);
							e.target.innerText = "Copied!";
							setTimeout(() => {
								e.target.innerText = "Copy";
							}, 2000);
						}}
					>
						Copy
						</div>
						<div onClick={handleDelete} className="cursor-pointer">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
						</div>
					</div>
				</div>
				<a
					href={`${window.location.origin}/p/${data?.shortUrl}`}
					className="text-blue-500 text-sm md:text-lg block w-full truncate"
				>
					{`${window.location.origin}/p/${data?.shortUrl}`}
				</a>
				<a
					href={data?.longUrl}
					className="text-xs lg:text-sm block text-blue-500 w-full truncate"
				>
					{data?.longUrl}
				</a>
			</div>
		</div>
	);
};

export default SingleLink;
