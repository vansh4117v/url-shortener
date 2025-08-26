import { z } from "zod";

const passwordSchema = z
  .string()
  .trim()
  .min(6, "Password must be at least 6 characters long")
  .max(128, "Password cannot exceed 128 characters");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .max(254, "Email cannot exceed 254 characters")
  .email("Invalid email format");

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters long")
  .max(50, "Name cannot exceed 50 characters");

export const signUpSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
  }).strict();

export const signInSchema = z.object({
    email: emailSchema,
    password: z
      .string()
      .trim()
      .min(1, "Password is required")
      .max(128, "Password cannot exceed 128 characters"),
  }).strict();

export const changePasswordSchema = z.object({
    currentPassword: z.string().trim().min(1, "Current password is required"),
    newPassword: passwordSchema,
  }).strict();

export const resetPasswordSchema = z.object({
    email: emailSchema,
    token: z.string().trim().min(1, "Reset token is required"),
    password: passwordSchema,
  }).strict();

export const updateProfileSchema = z.object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, "At least one field must be provided for update");
