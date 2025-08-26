import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Error from "./error";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { login } from "@/api/auth";
import { useAuth } from "@/context/context";

const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Email is required")
      .max(254, "Email cannot exceed 254 characters")
      .email("Invalid email format"),
    password: z
      .string()
      .trim()
      .min(1, "Password is required")
      .max(128, "Password cannot exceed 128 characters"),
  })
  .strict();

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth()

  const { fn: fnLogin, loading, error, data } = useFetch(login);

  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData) => {
    await fnLogin(formData);
    
  };

  useEffect(() => {
  if (data && data.success) {
    setUser(data.data);
    navigate('/');
  }
}, [data, setUser, navigate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>to your account if you already have one</CardDescription>
        {/* General error message */}
        {error && error.message && <Error message={error.message} />}
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Input type="email" placeholder="Enter Email" {...register("email")} />
            {/* Zod validation error */}
            {errors.email && <Error message={errors.email.message} />}
            {/* API validation error */}
            {error?.errors?.find((e) => e.field === "email") && (
              <Error message={error.errors.find((e) => e.field === "email").message} />
            )}
          </div>

          <div className="space-y-1">
            <Input type="password" placeholder="Enter Password" {...register("password")} />
            {errors.password && <Error message={errors.password.message} />}
            {error?.errors?.find((e) => e.field === "password") && (
              <Error message={error.errors.find((e) => e.field === "password").message} />
            )}
          </div>
        </CardContent>
        <CardFooter className="mt-2">
          <Button type="submit">
            {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
