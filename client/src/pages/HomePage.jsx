import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Link, Hash, Tag } from "lucide-react";
import { useAuth, useUrl } from "@/context/context";
import useFetch from "@/hooks/use-fetch";
import { createShortLink } from "@/api/url";
import { useNavigate } from "react-router-dom";
import Error from "@/components/error";
import { useEffect } from "react";

const DANGEROUS_PROTOCOLS = ["javascript:", "data:", "vbscript:", "file:", "ftp:"];
const createUrlSchema = z.object({
  longUrl: z
    .string()
    .trim()
    .min(1, "Long URL is required")
    .max(2048, `URL cannot exceed 2048 characters`)
    .url("Invalid URL format")
    .refine(
      (url) => !DANGEROUS_PROTOCOLS.some((protocol) => url.toLowerCase().startsWith(protocol)),
      "URL contains dangerous protocol"
    )
    .refine((url) => {
      try {
        const urlObj = new URL(url);
        return ["http:", "https:"].includes(urlObj.protocol);
      } catch {
        return false;
      }
    }, "Only HTTP and HTTPS URLs are allowed"),
  shortId: z
    .string()
    .trim()
    .max(20, "Short ID cannot exceed 20 characters")
    .refine(
      (val) => val === "" || /^[a-zA-Z0-9_-]+$/.test(val),
      "Short ID can only contain letters, numbers, hyphens, and underscores"
    )
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  title: z.string().trim().max(200, "Title cannot exceed 200 characters").optional(),
});

const HomePage = () => {
  const { linkData, setLinkData } = useUrl();
  const { isLoggedIn } = useAuth();
  const { data, error, fn: fnCreateShortLink } = useFetch(createShortLink);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createUrlSchema),
    defaultValues: {
      longUrl: linkData.longUrl || "",
      shortId: linkData.shortId || "",
      title: linkData.title || "",
    },
  });

  const onSubmit = async (data) => {
    if (isLoggedIn) {
      await fnCreateShortLink(data);
    } else {
      setLinkData(data);
      navigate("/auth/signin");
    }
  };

  useEffect(() => {
    if (data && data.success) {
      setLinkData({
        longUrl: "",
        shortId: "",
        title: "",
      });
      navigate(`/link/${data.data.shortId}`);
    }
  }, [data, setLinkData, navigate]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Simplify Your Links
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform long URLs into short, memorable links with Clixly - the fastest URL shortener
            on the web
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center">
              <Link className="w-5 h-5 mr-2 text-blue-600" />
              Create Short URL
            </h2>
            {/* General error message */}
            {error && error.message && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <Error message={error.message} />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Long URL Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Link className="w-4 h-4 mr-2 text-blue-600" />
                Long URL
              </label>
              <div className="relative">
                <input
                  {...register("longUrl")}
                  type="url"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.longUrl
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  } focus:outline-none focus:ring-2 transition-all`}
                  placeholder="https://example.com/very/long/url"
                />
                {errors.longUrl && (
                  <div className="mt-1">
                    <Error message={errors.longUrl.message} />
                  </div>
                )}
                {/* API validation error for longUrl */}
                {error?.errors?.find((e) => e.field === "longUrl") && (
                  <div className="mt-1">
                    <Error message={error.errors.find((e) => e.field === "longUrl").message} />
                  </div>
                )}
              </div>
            </div>

            {/* Short ID Field*/}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Hash className="w-4 h-4 mr-2 text-purple-600" />
                Custom Short ID (Optional)
              </label>
              <div className="flex items-stretch border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-200">
                <div className="bg-gray-50 px-3 py-3 text-gray-500 text-sm border-r flex items-center whitespace-nowrap">
                  {import.meta.env.VITE_BASE_URL}/
                </div>
                <div className="flex-1 overflow-x-auto">
                  <input
                    {...register("shortId")}
                    type="text"
                    className={`w-full px-3 py-3 border-none outline-none ${
                      errors.shortId || error?.errors?.find((e) => e.field === "shortId")
                        ? "focus:ring-red-200"
                        : "focus:ring-blue-200"
                    }`}
                    placeholder="my-custom-id"
                    style={{ minWidth: 0 }}
                  />
                </div>
              </div>
              {/* Error messages below the input */}
              {errors.shortId && (
                <div className="mt-1">
                  <Error message={errors.shortId.message} />
                </div>
              )}
              {/* API validation error for shortId */}
              {error?.errors?.find((e) => e.field === "shortId") && (
                <div className="mt-1">
                  <Error message={error.errors.find((e) => e.field === "shortId").message} />
                </div>
              )}
              {/* Fixed height container to prevent layout shift */}
              <div className="h-5">
                {!errors.shortId && !error?.errors?.find((e) => e.field === "shortId") && (
                  <p className="text-xs text-gray-500">
                    3-15 characters, alphanumeric, hyphens and underscores only
                  </p>
                )}
              </div>
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-blue-600" />
                Link Title (Optional)
              </label>
              <input
                {...register("title")}
                type="text"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.title
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                } focus:outline-none focus:ring-2 transition-all`}
                placeholder="My important link"
              />
              {errors.title && <Error message={errors.title.message} />}
              {error?.errors?.find((e) => e.field === "title") && (
                <Error message={error.errors.find((e) => e.field === "title").message} />
              )}
              <p className="text-xs text-gray-500">Max 50 characters</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-medium hover:shadow-lg transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Shorten URL"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
