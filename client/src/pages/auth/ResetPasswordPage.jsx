import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Mail, RefreshCw, Lock, CheckCircle } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { sendPasswordResetCode, resetPassword } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAuth } = useAuth();
  const {
    fn: resetUserPassword,
    loading: resetting,
    error: resetError,
    data: resetData,
  } = useFetch(resetPassword);
  const {
    fn: resendCode,
    loading: resending,
    error: resendError,
  } = useFetch(sendPasswordResetCode);

  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Initialize with email from location state if available
  const defaultEmail = location.state?.email || "";

  const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    otp: z
      .string()
      .min(6, { message: "Verification code must be 6 digits." })
      .max(6, { message: "Verification code must be 6 digits." })
      .regex(/^\d+$/, { message: "Verification code must contain only numbers." }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(100, { message: "Password cannot exceed 100 characters." })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: defaultEmail,
      otp: "",
      newPassword: "",
    },
  });

  // Reset form errors when user starts typing
  useEffect(() => {
    const subscription = form.watch((value, { name: fieldName }) => {
      if (fieldName === "otp" && resetError) {
        form.clearErrors("otp");
      }
      if (fieldName === "newPassword" && resetError) {
        form.clearErrors("newPassword");
      }
    });
    return () => subscription.unsubscribe();
  }, [form, resetError]);

  // Map server-side validation errors to form fields
  useEffect(() => {
    if (resetError?.errors && Array.isArray(resetError.errors)) {
      const currentValues = form.getValues();
      resetError.errors.forEach((err) => {
        if (err && err.field && Object.prototype.hasOwnProperty.call(currentValues, err.field)) {
          form.setError(err.field, {
            type: "manual",
            message: err.message || "Invalid value",
          });
        }
      });
    }
  }, [resetError, form]);

  // Handle resend code cooldown
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Redirect on successful password reset
  useEffect(() => {
    if (resetData?.success && !resetError) {
      // Clear any existing session tokens before redirecting to sign-in
      clearAuth();
      setTimeout(() => {
        navigate("/auth/signin", { state: { passwordReset: true } });
      }, 2500);
    }
  }, [resetData?.success, resetError, navigate, clearAuth]);

  const handleResendCode = async () => {
    const email = form.getValues("email");
    if (email) {
      setResendSuccess(false);
      await resendCode(email);
      setResendCooldown(60);
      setResendSuccess(true);

      setTimeout(() => {
        setResendSuccess(false);
      }, 3000);
    }
  };

  const onSubmit = (values) => {
    resetUserPassword(values.email, values.otp, values.newPassword);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Set New Password
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Enter the verification code sent to your email and create a new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(resetError || resendError) && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {resetError?.message ||
                  resendError?.message ||
                  "Failed to reset password. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          {resetData?.success && !resetError ? (
            <div className="space-y-6">
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/50">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Password Reset Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your password has been successfully updated. Redirecting to sign in...
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Redirecting in 2.5 seconds...
                </div>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          readOnly={!!defaultEmail}
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Verification Code
                      </FormLabel>
                      <FormControl>
                        <div className="flex justify-center gap-1.5 w-full">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <Input
                              key={index}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              className="w-10 h-10 text-center text-xl border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white focus:z-10 sm:w-12 sm:h-12"
                              value={field.value[index] || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (/^\d?$/.test(val)) {
                                  const otpArr = field.value.split("");
                                  otpArr[index] = val;
                                  const newOtp = otpArr.join("");
                                  field.onChange(newOtp);
                                  if (val && index < 5) {
                                    document.getElementById(`otp-input-${index + 1}`)?.focus();
                                  }
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Backspace" && !field.value[index] && index > 0) {
                                  document.getElementById(`otp-input-${index - 1}`)?.focus();
                                }
                              }}
                              id={`otp-input-${index}`}
                              autoComplete="one-time-code"
                              aria-label={`Digit ${index + 1} of verification code`}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={resending || resendCooldown > 0}
                    className="flex-1 flex items-center justify-center space-x-2 py-5 sm:py-2"
                  >
                    {resending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : resendSuccess ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <RefreshCw className={`h-4 w-4 ${resendCooldown > 0 ? "rotate-180" : ""}`} />
                    )}
                    <span>
                      {resending
                        ? "Sending..."
                        : resendSuccess
                        ? "Sent!"
                        : resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : "Resend Code"}
                    </span>
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-5 sm:py-2"
                    disabled={resetting}
                  >
                    {resetting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{" "}
            <Link
              to="/auth/signin"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
