import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
import { Loader2, AlertCircle, MailCheck } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { signIn } from "@/api/auth";
import { setAccessToken } from "@/utils/auth";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function SignInPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { fn: loginUser, loading, error, data } = useFetch(signIn);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Clear previous API errors when form values change
  useEffect(() => {
    const subscription = form.watch((value, { name: fieldName }) => {
      if (fieldName && error?.errors?.some((err) => err.field === fieldName)) {
        form.clearErrors(fieldName);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, error]);

  // Handle API field-specific errors
  useEffect(() => {
    if (error?.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err) => {
        if (err.field && formSchema.keyof().options.includes(err.field)) {
          form.setError(err.field, {
            type: "manual",
            message: err.message,
          });
        }
      });
    }
  }, [error, form]);

  const onSubmit = (values) => {
    form.clearErrors();
    loginUser(values);
  };

  useEffect(() => {
    if (data?.success && !error) {
      if (data.token) {
        setAccessToken(data.token);
      }
      if (data.data) {
        setUser(data.data);
      }
      const redirectTo = location.state?.redirectTo || "/";
      navigate(redirectTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.success, error, navigate, setUser]);

  const isUnverifiedAccount =
    error?.status === 403 || (error?.message && error.message.includes("Account is not verified"));

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Sign in to access your account and continue your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isUnverifiedAccount ? (
            <Alert variant="destructive" className="mb-6">
              <MailCheck className="h-4 w-4" />
              <AlertTitle>Account Not Verified</AlertTitle>
              <AlertDescription>
                {error.message || "Your account is not verified. Please verify your email address."}
                <br />
                <Link
                  to="/auth/verify-email"
                  state={{
                    email: form.getValues("email"),
                    redirectTo: location.state?.redirectTo,
                  }}
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 mt-2 inline-block"
                >
                  Complete verification now →
                </Link>
              </AlertDescription>
            </Alert>
          ) : error && !isUnverifiedAccount ? (
            <Alert variant="destructive" className="mb-6 animate-shake">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Failed</AlertTitle>
              <AlertDescription>
                {error.message || "Invalid email or password. Please try again."}
              </AlertDescription>
            </Alert>
          ) : null}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
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
              <div className="flex justify-end">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-5 text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              state={{ redirectTo: location.state?.redirectTo }}
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Create account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
