import mem from 'memoize';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LoginResponse } from '../types';


// const baseURL = ''
const baseURL = import.meta.env.MODE === 'test' ? '' : import.meta.env.VITE_BACKEND_SERVER_URL;
const REFRESH_URL = '/auth/refresh'

const axiosInstance = axios.create({
    baseURL,
});

export interface HttpClient extends AxiosInstance {
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = unknown, U = unknown>(url: string, data?: T, config?: AxiosRequestConfig): Promise<U>;
    put<T = unknown, U = unknown>(url: string, data?: T, config?: AxiosRequestConfig): Promise<U>;
}

export const http: HttpClient = axiosInstance;

http.interceptors.request.use((config) => {
    if (!config.headers) return config;

    let token: string | null = null;

    if (config.url === REFRESH_URL) {
        token = localStorage.getItem('token');
    }

    if (token !== null) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const getRefreshToken = mem(async (): Promise<string | void> => {
    try {
        const result = await http.post<void, LoginResponse>(REFRESH_URL);
        const { token } = result;
        localStorage.setItem('token', token);

        return token;
    } catch (e) {
        localStorage.removeItem('token');
    }
}, { maxAge: 1000 })


http.interceptors.response.use(
    (res) => res.data,
    async (err) => {
        const { config, response: { status } } = err;

        if (config.url === REFRESH_URL || status !== 401 || config.sent) {
            return Promise.reject(err);
        }

        config.sent = true;
        const accessToken = await getRefreshToken();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            return http(config);
        }

        return Promise.reject(err);
    }
);
