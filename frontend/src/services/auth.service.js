import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
    login(email, password) {
        return axios
        .post(API_URL + 'login', { email, password})
        .then(response => {
            if (response.data.accessToken && response.data.refreshToken) {
                localStorage.setItem('user', JSON.stringify({
                    email: email,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken
                }));
            }
            return response.data;
        });
    }

    logout() {
        localStorage.removeItem('user');
    }

    refreshToken() {
        const user = JSON.parse(localStorage.getItem('user'));
        if(!user || !user.refreshToken) return Promise.reject('No refresh token available');

        return axios
        
        .post(API_URL + 'refresh', { refreshToken: user.refreshToken })
        .then(response => {
            if (response.data.accessToken) {
                const updatedUser = {
                    ...user,
                    accessToken: response.data.accessToken
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            return response.data;
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();
