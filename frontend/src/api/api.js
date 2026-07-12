import axios from 'axios';

/**
 * Base URL resolution:
 * - Uses Vite's env variable convention (import.meta.env.VITE_*)
 * - Falls back to local dev backend if not set, so the app still
 *   runs out-of-the-box during the hackathon without a .env file
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Centralized Axios instance.
 * All frontend API modules (tripApi, maintenanceApi, etc.) should
 * import and use THIS instance rather than importing axios directly,
 * so base URL, headers, timeout, and interceptors stay consistent
 * across the whole app.
 */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10s — prevents requests from hanging indefinitely
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor.
 * Attaches the auth token (once auth exists) to every outgoing request.
 * Reads from localStorage defensively — if auth isn't wired up yet,
 * this simply does nothing and requests go out unauthenticated.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Something went wrong building the request itself (rare)
    return Promise.reject(error);
  }
);

/**
 * Response interceptor.
 * Normalizes all errors into a consistent shape so every page/component
 * can rely on `error.message` and `error.statusCode` without manually
 * digging into Axios's response structure each time.
 */
api.interceptors.response.use(
  (response) => {
    // Successful responses pass through unchanged
    return response;
  },
  (error) => {
    let message = 'Something went wrong. Please try again.';
    let statusCode = 500;

    if (error.response) {
      // Server responded with an error status (4xx/5xx)
      // Matches your backend's { success, message, data } error shape
      statusCode = error.response.status;
      message = error.response.data?.message || message;

      // Handle expired/invalid auth token globally
      if (statusCode === 401) {
        localStorage.removeItem('token');
        message = 'Session expired. Please log in again.';
      }
    } else if (error.request) {
      // Request was sent but no response received (network issue, backend down)
      message = 'Unable to reach the server. Please check your connection.';
      statusCode = 0;
    } else {
      // Something failed while setting up the request
      message = error.message;
    }

    // Attach normalized fields so callers don't need to re-parse the error
    const normalizedError = new Error(message);
    normalizedError.statusCode = statusCode;
    normalizedError.original = error;

    return Promise.reject(normalizedError);
  }
);

export default api;