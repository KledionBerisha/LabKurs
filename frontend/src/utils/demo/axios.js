import axios from 'axios';
import AuthService from '../services/auth.service';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
});

instance.interceptors.request.use(
    (config) => {
        const user = AuthService.getCurrentUser();
        if (user && user.accessToken) {
            config.headers['Authorization'] = 'Bearer' + user.accessToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await AuthService.refreshToken();
                const user = AuthService.getCurrentUser();
                originalRequest.headers['Authorization'] = 'Bearer' + user.accessToken;
                return instance(originalRequest);
            } catch (refreshError) {
                AuthService.logout();
                window.location = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;

