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