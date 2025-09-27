import AuthService from './auth.service';

export function getToken() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.accessToken || user?.token || user?.access_token || null;
  } catch (e) {
    return null;
  }
}

export function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchWithAuth(url, options = {}) {
  const firstHeaders = { ...(options.headers || {}), ...getAuthHeaders() };
  let res = await fetch(url, { ...options, headers: firstHeaders });
  if (res.status === 401) {
    const newToken = await AuthService.refresh().catch(()=>null);
    if (newToken) {
      const retryHeaders = { ...(options.headers || {}), 'Content-Type': 'application/json', Authorization: `Bearer ${newToken}` };
      res = await fetch(url, { ...options, headers: retryHeaders });
    }
  }
  return res;
}