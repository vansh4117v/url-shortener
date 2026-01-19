import { deleteUrl, fetchUrlDetails } from "@/api/url";
import { useAuth } from "@/context/context";
import useFetch from "@/hooks/use-fetch";
import { Calendar, Copy, Eye, LinkIcon, QrCode, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

function ShortLinkDetails() {
  const { id } = useParams();
  const {user} = useAuth();
  const { data: shortLink, loading, error, fn: getShortLinkFn } = useFetch(fetchUrlDetails);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  useEffect(() => {
    if (id) {
      getShortLinkFn(id);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(import.meta.env.VITE_BASE_URL+'/'+shortLink?.data?.shortId);
    setCopied(true);
  };

  const onBack = () => {
    navigate("/dashboard");
  }
  
  const onDelete = async () => {
    try {
      await deleteUrl(shortLink?.data?.shortId);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `${import.meta.env.VITE_BASE_URL}/${shortLink?.data?.shortId}`
  )}`;

  if (loading) {
    return <BarLoader className="w-full" color="#36d7b7" />;
  }

  if (!loading && error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md shadow-sm">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M12 5a7 7 0 00-7 7v.01a7 7 0 0014 0V12a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-600">Oops! Something went wrong</h2>
          <p className="text-gray-600 mt-2">
            {error.message ||
              "We couldn’t load this short link. It may have been deleted or never existed."}
          </p>
          <button
            onClick={onBack}
            className="mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center cursor-pointer text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </button>

        <div className="flex space-x-3">
          <button
            onClick={handleCopy}
            className={`flex items-center cursor-pointer px-4 py-2 rounded-lg font-medium transition-all ${
              copied ? "bg-green-100 text-green-700" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {copied ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </>
            )}
          </button>

          <button
            onClick={onDelete}
            className="flex items-center cursor-pointer px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <LinkIcon className="w-5 h-5 mr-2 text-blue-600" />
            {shortLink?.data?.title || "My Short Link"}
          </h2>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - URL Details */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Short URL
                </h3>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {/* <span className="text-gray-500">{import.meta.env.VITE_BASE_URL}/</span> */}
                  <Link
                    to={`/${shortLink?.data?.shortId}`}
                    className="text-gray-500 cursor-pointer"
                  >
                    {import.meta.env.VITE_BASE_URL}/
                  </Link>
                  <Link
                    to={`/${shortLink?.data?.shortId}`}
                    className="text-blue-600 cursor-pointer flex-1 break-all"
                  >
                    {shortLink?.data?.shortId?.split("/").pop()}
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Original URL
                </h3>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 break-all">
                  {shortLink?.data?.longUrl}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    Created
                  </div>
                  <div className="font-medium">{shortLink?.data?.createdAt}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="w-4 h-4 mr-2" />
                    Total Clicks
                  </div>
                  <div className="font-medium text-2xl text-blue-600">
                    {shortLink?.data?.clicks?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">Created by</div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium mr-3">
                    {user?.name?.charAt(0)}
                  </div>
                  <div className="font-medium">{user?.name}</div>
                </div>
              </div>
            </div>

            {/* Right Column - QR Code */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center">
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </h3>
                </div>

                <div className="transition-all duration-300">
                  <div className="flex justify-center p-4 bg-white rounded-lg border border-gray-200">
                    <img
                      src={qrCodeUrl}
                      alt={`QR code for ${shortLink?.data?.shortId}`}
                      className="w-48 h-48"
                    />
                  </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-3">
                  Scan to open on mobile devices
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Why use QR codes?</h4>
                    <p className="text-gray-600 text-sm">
                      QR codes make it easy to share your short links in print materials,
                      presentations, and offline marketing. Simply scan with any smartphone camera
                      to visit the link instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortLinkDetails;
