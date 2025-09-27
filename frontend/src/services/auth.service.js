import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
  async register(data) {
    let role = (data.role || '').trim().toLowerCase();
    if (role === 'doctor') role = 'doktor';
    if (role === 'nurse') role = 'infermier';
    const payload = {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role
    };
    console.log('Register payload sending:', payload);
    return axios.post(API_URL + 'register', payload);
  }

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
    } catch {
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

    async refresh() {
    const stored = this.getCurrentUser();
    if (!stored || !stored.refreshToken) return null;
    const res = await axios.post(API_URL + 'refresh', { refreshToken: stored.refreshToken });
    const data = res.data;
    if (data && data.accessToken) {
      const updated = {
        ...stored,
        accessToken: data.accessToken,
        // keep same refreshToken (backend returns same one per your controller)
      };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated.accessToken;
    }
    return null;
  }
  
}

const authServiceInstance = new AuthService();

export const register = (data) => authServiceInstance.register(data);

export default authServiceInstance;