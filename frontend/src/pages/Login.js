import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import AuthService from '../services/auth.service';

import ImageLight from '../assets/img/login-office.jpeg'
import ImageDark from '../assets/img/login-office-dark.jpeg'
import { Label, Input, Button } from '@windmill/react-ui'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await AuthService.login(email, password);
      history.push('/app/dashboard'); // or your dashboard route
    } catch (err) {
      setError('Invalid email or password');
    }
  };
  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Login</h1>
              <form onSubmit={handleLogin}>
  <Label>
    <span>Email</span>
    <Input
      className="mt-1"
      type="email"
      placeholder="john@doe.com"
      value={email}
      onChange={e => setEmail(e.target.value)}
      required
    />
                </Label>
                <Label className="mt-4">
                  <span>Password</span>
                  <Input
                    className="mt-1"
                    type="password"
                    placeholder="***************"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </Label>
                {error && <div className="text-red-500 mt-2">{error}</div>}
                <Button className="mt-4" block type="submit">
                  Log in
                </Button>
              </form>

              <hr className="my-8" />

            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Login
