import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUrl } from "../store/urlSlice";

const Result = () => {
	const reduxUrl = useSelector((state) => state.url);
	const [urlInfo, setUrlInfo] = useState();
	// console.log("🚀 ~ Result ~ longUrl, shortUrl, title:", urlInfo);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
	    setUrlInfo(reduxUrl)
		// console.log("🚀 ~ useEffect ~ reduxUrl:", reduxUrl)
		if (reduxUrl&&!reduxUrl.shortUrl) {
			navigate("/");
		}
		return () => {
			dispatch(clearUrl());
		}
	}, [urlInfo]);
	return (
		<div className="text-white w-4/5 lg:w-2/3 mx-auto mt-10">
			<div className="text-3xl font-bold text-center">{urlInfo?.title}</div>
            <div className="mt-8 flex items-center gap-3">
                <span className="text-3xl font-bold">ShortUrl</span>
                <span className="text-lg cursor-pointer border-2 border-gray-600 pb-1 px-3 rounded-xl" onClick={(e) => {
                    navigator.clipboard.writeText(`${window.location.origin}/p/${urlInfo?.shortUrl}`);
                    e.target.innerText = "copied!";
                    setTimeout(() => {
                        e.target.innerText = "copy";
                    }, 2000);
                }}>copy</span>
            </div>
			<a
                href={`${window.location.origin}/p/${urlInfo?.shortUrl}`}
                className="text-xl font-semibold text-blue-500"
            >{`${window.location.origin}/p/${urlInfo?.shortUrl}`}</a>
            
			<div className="text-3xl font-bold mt-8">LongUrl</div>
			<a
                href={urlInfo?.longUrl}
                className="text-xl font-semibold text-blue-500 mb-8 max-w-4/5 block whitespace-nowrap text-ellipsis overflow-hidden"
            >{`${window.location.origin}/p/${urlInfo?.longUrl}`}</a>
            
            <img className="mx-auto" src={`https://api.qrserver.com/v1/create-qr-code/?size=${(window.innerWidth>1024)?"300x300":"200x200"}&data=${`${window.location.origin}/p/${urlInfo?.shortUrl}`}`} alt="qr code loading" />
		</div>
	);
};

export default Result;
