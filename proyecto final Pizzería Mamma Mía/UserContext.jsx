import React, { createContext, useState, useContext, useEffect } from 'react';


const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: null,
    token: null,
    profile: null, 
  });

  const logout = () => {
    setUser({
      email: null,
      token: null,
      profile: null,
    });
    console.log('Usuario deslogueado.');
  };

  
  const fetchUserProfile = async () => {
    try {
      if (!user.token) {
        console.warn('Token no disponible. Inicia sesión primero.');
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${user.token}`, 
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener el perfil del usuario');
      }

      const profileData = await response.json();
      setUser((prev) => ({ ...prev, profile: profileData }));
      console.log('Perfil obtenido:', profileData);
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
    }
  };


  const value = {
    user,
    setUser,
    logout,
    fetchUserProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};


export const useUserContext = () => useContext(UserContext);


export const LogoutButton = () => {
  const { logout } = useUserContext();

  const handleLogout = () => {
    logout();
    alert('Has cerrado sesión correctamente.');
  };

  return <button onClick={handleLogout}>Logout</button>;
};


export const UserProfile = () => {
  const { user, fetchUserProfile } = useUserContext();

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (!user.profile) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div>
      <h1>Perfil de Usuario</h1>
      <p><strong>Nombre:</strong> {user.profile.name}</p>
      <p><strong>Email:</strong> {user.profile.email}</p>
    </div>
  );
};
import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      alert('Login exitoso');
      
    } catch (err) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
