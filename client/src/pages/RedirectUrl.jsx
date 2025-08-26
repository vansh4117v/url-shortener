import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

export default function RedirectUrl() {
  const { shortId } = useParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const res = await api.get(`/urls/${shortId}`);
        if (res.data.success) {
          window.location.replace(res.data.data.longUrl);
        } else {
          setError(res.data.message || "URL not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      }
    };

    fetchUrl();
  }, [shortId]);

  if (error) return (
    <div className="text-center mt-10">
      <p className="text-red-600 font-semibold">{error}</p>
  <p>Check the link or go back to <Link to="/" className="text-blue-500 underline">home</Link></p>
    </div>
  );

  return <p className="text-center mt-10">Redirecting...</p>;
}