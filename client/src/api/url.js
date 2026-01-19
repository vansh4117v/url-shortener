import api from "./axios";

export const createShortLink = async (_,data) => {
  const response = await api.post('/urls/shorten', data);
  return response.data;
}

export const deleteUrl = async (_, id) => {
  const response = await api.delete(`/urls/${id}`);
  return response.data;
}

export const fetchUserUrls = async () => {
  const response = await api.get('/urls/');
  return response.data;
}

export const fetchUrlDetails = async (_, id) => {
  const response = await api.get(`/urls/${id}/info`);
  return response.data;
}

export const redirectToLongUrl = async (_, shortId) => {
  const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/urls/${shortId}`);
  return response.data;
}