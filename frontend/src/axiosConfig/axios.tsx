import axios from 'axios';

// an Axios instance
const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_INSIGHT_BACKEND}/api/${import.meta.env.VITE_API_VERSION}`,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log('Request sent: ', config);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response received: ', response);
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.error('Unauthorized - Token expired');
                window.location.href = '/auth';
            } else {
                console.error('Error Response:', error.response);
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Axios error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
