import { message } from 'antd';
import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    timeoutWarning?: NodeJS.Timeout;
}

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_INSIGHT_BACKEND}/api/${import.meta.env.VITE_API_VERSION}`,
    timeout: 30000
});

let warningDisplayed = false;
let warningMessage: (() => void) | null = null;

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const customConfig = config as CustomInternalAxiosRequestConfig;
        customConfig.timeoutWarning = setTimeout(() => {
            if (!warningDisplayed) {
                warningDisplayed = true;
                warningMessage = message.loading('This request is taking longer than usual (15-20 seconds expected). Please wait...', 0);
            }
        }, 10000);

        config.timeout = 20000;
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        const config = response.config as CustomInternalAxiosRequestConfig;
        clearTimeout(config.timeoutWarning);
        if (warningDisplayed && warningMessage) {
            warningMessage();
            warningDisplayed = false;
        }
        return response;
    },
    (error: AxiosError) => {
        const config = error.config as CustomInternalAxiosRequestConfig;
        if (config?.timeoutWarning) {
            clearTimeout(config.timeoutWarning);
            if (warningDisplayed && warningMessage) {
                warningMessage();
                warningDisplayed = false;
            }
        }

        if (error.response) {
            const responseData = error.response.data as { error: string };
            if (error.response.status === 401 && responseData.error === "Token has expired, please log in again") {
                message.error(responseData.error, 4);
                setTimeout(() => {
                    localStorage.clear();
                    window.location.href = '/auth';
                }, 2500);
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