import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  
  const loginUser = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Error al iniciar sesión");
      }

      const data = await response.json(); 
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Error en login:", error.message);
      throw error;
    }
  };

  
  const registerUser = async (email, password) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Error al registrar usuario");
      }

      const data = await response.json(); // { token, email }
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Error en register:", error.message);
      throw error;
    }
  };


  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Register = () => {
  const { register } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('Registro exitoso');
      // Redirige al usuario a la página de inicio de sesión u otra
    } catch (err) {
      setError('Ocurrió un error al registrarse. Inténtalo nuevamente.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="register-page">
      <form onSubmit={handleRegister}>
        <h2>Registro</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;

