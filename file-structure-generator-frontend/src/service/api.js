import axios from 'axios';

// 1. Get the API URL directly from the environment variable.
// This is the single source of truth for your backend's address.
const API_BASE_URL = import.meta.env.VITE_API_URL;

// 2. Add a check to fail early if the URL is not configured.
// This helps you catch configuration errors during development.
if (!API_BASE_URL) {
  throw new Error("VITE_API_URL is not defined. Please check your .env file or hosting provider's environment variables.");
}

// 3. Create a central axios instance with the correct configuration.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // This header is important to bypass the ngrok warning page.
    'ngrok-skip-browser-warning': 'true',
  },
});

// 4. Use an interceptor to automatically add the auth token to every request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // This will handle errors in the request configuration.
    return Promise.reject(error);
  }
);

export default api;