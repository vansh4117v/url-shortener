import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Avoid infinite redirect loops by checking current location
//       if (window.location.pathname !== "/auth") {
//         window.location.href = "/auth";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
