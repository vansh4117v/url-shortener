import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Mail, RefreshCw } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { sendEmailVerificationCode, verifyEmail } from "@/api/auth";
import { setAccessToken } from "@/utils/auth";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  otp: z
    .string()
    .min(6, { message: "Verification code must be 6 digits." })
    .max(6, { message: "Verification code must be 6 digits." })
    .regex(/^\d+$/, { message: "Verification code must contain only numbers." }),
});

export default function EmailVerificationPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    fn: verifyUser,
    loading: verifying,
    error: verifyError,
    data: verifyData,
  } = useFetch(verifyEmail);
  const {
    fn: resendCode,
    loading: resending,
    error: resendError,
  } = useFetch(sendEmailVerificationCode);

  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Initialize with email from location state if available
  const defaultEmail = location.state?.email || "";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: defaultEmail,
      otp: "",
    },
  });

  // Reset form errors when user starts typing
  useEffect(() => {
    const subscription = form.watch((value, { name: fieldName }) => {
      if (fieldName === "otp" && (verifyError || resendError)) {
        form.clearErrors("otp");
      }
    });
    return () => subscription.unsubscribe();
  }, [form, verifyError, resendError]);

  // Map server-side validation errors to form fields
  useEffect(() => {
    const serverError = verifyError || resendError;
    if (serverError?.errors && Array.isArray(serverError.errors)) {
      const currentValues = form.getValues();
      serverError.errors.forEach((err) => {
        if (err && err.field && Object.prototype.hasOwnProperty.call(currentValues, err.field)) {
          form.setError(err.field, {
            type: "manual",
            message: err.message || "Invalid value",
          });
        }
      });
    }
  }, [verifyError, resendError, form]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (verifyData?.success && !verifyError) {
      if (verifyData.token) {
        setAccessToken(verifyData.token);
      }
      if (verifyData.data) {
        setUser(verifyData.data);
      }
      const redirectTo = location.state?.redirectTo || "/";
      setTimeout(() => {
        navigate(redirectTo);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyData?.success, verifyError, navigate, setUser]);

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
    verifyUser({ email: values.email, otp: values.otp });
  };

  return (
    <div className="md:mt-5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center">
              <Mail className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            We've sent a verification code to your email. Please enter it below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(verifyError || resendError) && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>
                {verifyError?.message ||
                  resendError?.message ||
                  "Failed to verify email. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          {verifyData?.success && !verifyError ? (
            <div className="space-y-6">
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/50">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Email Verified Successfully!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your email address has been verified. Redirecting to home page...
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Redirecting in 2 seconds...
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
                    disabled={verifying}
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Email"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
