import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

import ImageLight from '../assets/img/login-office.jpeg';
import ImageDark from '../assets/img/login-office-dark.jpeg';
import { Label, Input, Button } from '@windmill/react-ui';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const decodeJwtPayload = (token) => {
    try {
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(payload).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // remove any stale stored user that could force wrong redirects
    try { localStorage.removeItem('user'); } catch (ignored) {}

    try {
      const data = await AuthService.login(email, password); // backend response object

      // try to read token from common fields
      const token = data?.accessToken || data?.token || data?.jwt || data?.access_token;

      // prefer role returned by backend
      let roleRaw = data?.role || data?.roles || data?.authorities || null;

      // if role is not present, try decoding token payload
      if (!roleRaw && token) {
        const payload = decodeJwtPayload(token);
        roleRaw = payload?.role || payload?.roles || payload?.authorities || null;
      }

      // normalize roleRaw to a single uppercase string
      if (Array.isArray(roleRaw) && roleRaw.length) roleRaw = roleRaw[0];
      roleRaw = (roleRaw || '').toString().trim().toUpperCase();

      // strict detection (infermier check first)
      const isInfermier = /INFERMIER|INFERMIERI|NURSE|INFERM/i.test(roleRaw);
      const isDoctor = /DOCTOR|DOKTOR|MD|(^|\\s)DR(\\.|\\s|$)/i.test(roleRaw) || /DOCTOR|DOKTOR/i.test(roleRaw);

      // persist fresh stored user (overwrite)
      try {
        const userToStore = {
          email,
          accessToken: token || null,
          refreshToken: data?.refreshToken || null,
          role: isInfermier ? 'INFERMIER' : (isDoctor ? 'DOCTOR' : (roleRaw || 'USER')),
          id: data?.id ?? null,
          emriMbiemri: data?.emriMbiemri ?? null
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
      } catch (err) {
        // ignore storage errors
      }

      // redirect based on detected role
      if (isInfermier) {
        history.push('/app/InfermierDashboard'); // InfermieriDashboard
      } else if (isDoctor) {
        history.push('/app/DoctorPage'); // DoctorPage
      } else {
        history.push('/app/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img aria-hidden="true" className="object-cover w-full h-full dark:hidden" src={ImageLight} alt="Office" />
            <img aria-hidden="true" className="hidden object-cover w-full h-full dark:block" src={ImageDark} alt="Office" />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Login</h1>
              <form onSubmit={handleLogin}>
                <Label>
                  <span>Email</span>
                  <Input className="mt-1" type="email" placeholder="user@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </Label>
                <Label className="mt-4">
                  <span>Password</span>
                  <Input className="mt-1" type="password" placeholder="***************" value={password} onChange={e => setPassword(e.target.value)} required />
                </Label>
                {error && <div className="text-red-500 mt-2">{error}</div>}
                <Button className="mt-4" block type="submit">Log in</Button>
              </form>
              <hr className="my-8" />
              <div className='text-center'>
                <Link to="/register" className="text-blue-600 hover:underline font-medium">Register Here!</Link> 
                <p className='mt2 text-sm text-gray-600 dark:text-gray-400'>
                  Krijoni një llogari për të pasur qasje në platformë. Nëse jeni mjek ose infermier, zgjidhni rolin përkatës gjatë procesit të regjistrimit.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;