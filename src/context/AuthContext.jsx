import { createContext, useContext, useState } from 'react';
import { login, logout, register } from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);

  const authLogin = async (email, password) => {
    const data = await login(email, password);
    setUser(data.user);
    setToken(data.jwt);
    localStorage.setItem('authToken', data.jwt);
  };

  const authLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const authRegister = async (userData) => {
    const data = await register(userData);
    setUser(data.user);
    setToken(data.jwt);
    localStorage.setItem('authToken', data.jwt);
  };

  const value = {
    user,
    token,
    login: authLogin,
    logout: authLogout,
    register: authRegister
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}