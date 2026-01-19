import { z } from "zod";

export const emailSchema = z
  .string({ required_error: "Email is required" })
  .trim()
  .toLowerCase()
  .email("Please provide a valid email address");

const passwordSchema = z
  .string({ required_error: "Password is required" })
  .trim()
  .min(6, "Password must be at least 6 characters")
  .max(100, { message: "Password cannot exceed 100 characters." })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  .regex(/[0-9]/, { message: "Password must contain at least one number." });

export const signInValidationSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .trim()
    .min(1, "Password is required")
    .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const signUpValidationSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: emailSchema,
  password: passwordSchema,
});

export const verifyEmailSchema = z.object({
  email: emailSchema,
  otp: z.string({ required_error: "OTP is required" }).length(6, "OTP must be 6 characters"),
});

export const sendCodeSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  otp: z.string({ required_error: "OTP is required" }).length(6, "OTP must be 6 characters"),
  newPassword: passwordSchema,
});
