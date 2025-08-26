import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Error from "./error";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";

import useFetch from "@/hooks/use-fetch";
import { signup } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/context";

const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name cannot exceed 50 characters"),
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
      .min(6, "Password must be at least 6 characters long")
      .max(128, "Password cannot exceed 128 characters"),
  })
  .strict();

const Signup = () => {
    const { setUser } = useAuth()
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const { loading, error, fn: fnSignup, data } = useFetch(signup);

  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    await fnSignup(formData);
    
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
        <CardTitle>Signup</CardTitle>
        <CardDescription>Create a new account if you haven’t already</CardDescription>
        {/* General error message */}
        {error && error.message && <Error message={error.message} />}
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input type="text" placeholder="Enter Name" {...register("name")} />
          {/* Zod validation error */}
          {errors.name && <Error message={errors.name.message} />}
          {/* API validation error */}
          {error?.errors?.find(e => e.field === "name") && (
            <Error message={error.errors.find(e => e.field === "name").message} />
          )}
        </div>

        <div className="space-y-1">
          <Input type="email" placeholder="Enter Email" {...register("email")} />
          {errors.email && <Error message={errors.email.message} />}
          {error?.errors?.find(e => e.field === "email") && (
            <Error message={error.errors.find(e => e.field === "email").message} />
          )}
        </div>

        <div className="space-y-1">
          <Input type="password" placeholder="Enter Password" {...register("password")} />
          {errors.password && <Error message={errors.password.message} />}
          {error?.errors?.find(e => e.field === "password") && (
            <Error message={error.errors.find(e => e.field === "password").message} />
          )}
        </div>

        
      </CardContent>

      <CardFooter>
        <Button onClick={handleSubmit(onSubmit)}>
          {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Create Account"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
