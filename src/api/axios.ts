
import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import useAppStore from '@/stores/useAppStore';

// Use Vite's import.meta.env to access environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const rawAxios = axios.create({
    headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json',
    },
    withCredentials: true,
});

const appAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Variable to store the refresh function - will be set during app initialization
let refreshTokenFn: (() => Promise<string>) | null = null;

// Function to set the refresh token function (called once during app startup)
export const setRefreshTokenFunction = (refreshFn: () => Promise<string>): void => {
    refreshTokenFn = refreshFn;
};

// Request interceptor - adds auth token and increments API count
appAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const store = useAppStore.getState();
        store.incrementApiCount();
        
        const token = store.auth?.accessToken;
        if (token && config.headers && !config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        const store = useAppStore.getState();
        store.decrementApiCount();
        return Promise.reject(error);
    }
);

// Response interceptor - handles token refresh and decrements API count
appAxios.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        const store = useAppStore.getState();
        store.decrementApiCount();
        return response;
    },
    async (error: AxiosError): Promise<AxiosResponse | AxiosError> => {
        const store = useAppStore.getState();
        store.decrementApiCount();
        
        const prevRequest = error?.config as InternalAxiosRequestConfig & { sent?: boolean };
        if (error?.response?.status === 403 && !prevRequest?.sent && refreshTokenFn) {
            prevRequest.sent = true;
            try {
                const newAccessToken = await refreshTokenFn();
                if (prevRequest.headers) {
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                }
                return appAxios(prevRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export { appAxios, rawAxios }