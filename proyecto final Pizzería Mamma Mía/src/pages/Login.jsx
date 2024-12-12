import React from 'react';
import { useUserContext } from './UserContext';

const Login = () => {
  const { setUser } = useUserContext();

  const handleLogin = () => {
    
    const userData = {
      email: 'user@example.com',
      token: 'abc123',
    };
    setUser(userData);
    alert('Has iniciado sesión.');
  };

  return <button onClick={handleLogin}>Login</button>;
};

import React, { createContext, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const response = await axios.post('/api/auth/register', formData);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, login, register }}>
      {children}
    </UserContext.Provider>
  );
};

export default Login;
