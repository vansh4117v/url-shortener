import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthLayout = ({ authenticationNeeded = true, children }) => {
	const isLoggedin = useSelector((state) => state.user.isLoggedIn);
	const [loader, setLoader] = useState(true);
	const navigate = useNavigate();

    useEffect(() => {
        setLoader(false);
        if (authenticationNeeded && !isLoggedin) {
            navigate("/login");
        }
        if (!authenticationNeeded && isLoggedin) {
            navigate("/");
        }
    },[])
	return loader?<div className="text-white text-2xl mt-8 mx-auto">loading...</div>: <>{children}</>;
};

export default AuthLayout;
