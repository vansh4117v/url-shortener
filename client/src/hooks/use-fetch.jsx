import { useState } from "react";

const useFetch = (cb) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      // If API returns success: false, treat as error
      if (response && response.success === false) {
        setError({
          message: response.message || "Unknown error",
          errors: response.errors || [],
        });
        setData(response);
      } else {
        setData(response);
        setError(null);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError({
          message: err.response.data.message || err.message,
          errors: err.response.data.errors || [],
        });
      } else {
        setError({ message: err.message || "Unknown error", errors: [] });
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
