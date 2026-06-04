import axios from "axios";
import { setToken, getToken } from "../utils/tokenUtils";

const api = axios.create({
  baseURL: "http://localhost:8082/api", // Use : instead of =
  timeout: 10000,                  // Use : instead of =
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
    (config)=>{
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }

);

api.interceptors.response.use(
  (response) => {
    // If the server returns a successful response, just pass it through
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // If Spring Boot returns 401 Unauthorized, the token is invalid or expired
      if (status === 401) {
        console.warn('Session expired or unauthorized. Logging out...');
        removeToken(); // Clear token from localStorage
        
        // Redirect to login page cleanly
        window.location.href = '/login'; 
      }
    } else if (error.request) {
      // The request was made but no response was received (Backend server might be down)
      console.error('Backend server is unreachable:', error.request);
    } else {
      console.error('Axios configuration error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;