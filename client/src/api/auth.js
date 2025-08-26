import api from "./axios";

export const signup = async (data) => {
  const response = await api.post('/auth/signup', data);
  return response.data;
}

export const login = async (data) => {
  const response = await api.post('/auth/signin', data);
  return response.data;
}

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
}

export const fetchUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
  
}
