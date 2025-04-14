import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import authService from "../appwrite/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const longUrl = useSelector((state) => state.url.longUrl);

  const login = async () => {
    try {
      const response = await authService.login(data);
      // console.log("🚀 ~ login ~ response:", response)
      if (response) {
        dispatch(setUser({ name: response.name, email: response.email, id: response.$id }))
        if (longUrl!=="example") {
          navigate("/newLink");
        }
        else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      
    }
  }

  useEffect(() => {
    if (data) {
      login();
    }
  }, [data]);

	return <Form setData={setData} />;
};

export default Login;
