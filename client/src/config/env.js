  export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  SITE_NAME: import.meta.env.VITE_SITE_NAME,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  SOCKET_SERVER_URL: import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:5000',
};
