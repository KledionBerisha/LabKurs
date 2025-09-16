import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
    async login(email, password) {
        const res = await axios.post(API_URL + 'login', { email, password });
        const data = res.data;
        if (data && data.accessToken && data.refreshToken) {
            const stored = {
                email,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                role: (data.role || 'USER').toString().toUpperCase(),
                id: data.id ?? null,
                emriMbiemri: data.emriMbiemri ?? null
            };
            localStorage.setItem('user', JSON.stringify(stored));
        }
        return data;
    }

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            return null;
        }
    }

    getToken() {
        const u = this.getCurrentUser();
        return u ? u.accessToken : null;
    }

    logout() {
        localStorage.removeItem('user');
    }
}

export default new AuthService();