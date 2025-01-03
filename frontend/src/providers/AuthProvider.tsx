import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import { useNavigate } from 'react-router-dom';

export type LoginData = {
  identifier: string;
  password: string;
  type: string;
};
export type RegisterData = {
  username: string;
  email: string;
  password: string;
};
export type User = {
  id: string,
  email: string,
  username: string,
  iat: number,
  exp: number,
  iss: string
};

type AuthContext = {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  actions: {
    logout: () => void;
    login: (loginData: LoginData) => Promise<void>;
    register: (registerData: RegisterData) => Promise<void>;
  };
};

const authContext = React.createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useLocalStorage<string | null>(
    'accessToken',
    null
  );

  const onLogin = async (loginData: LoginData) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.errors.join(', '));
    }
    if ('accessToken' in data && data.accessToken) {
      setAccessToken(data.accessToken);
      navigate('/', { replace: true });
    }
  };

  const onLogout = () => {
    setAccessToken(null);
    navigate('/auth/login', { replace: true });
  };

  const onRegister = async (registerData: RegisterData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.errors.join(', '));
    }
    if ('user' in data && res.ok) {
      const loginData: LoginData = {
        identifier: registerData.email,
        password: registerData.password,
        type: 'email'
      };
      await onLogin(loginData);
      return;
    }
    throw new Error('Registration failed');
  };

  const user = accessToken ? JSON.parse(atob(accessToken.split('.')[1])) : null;
  return (
    <authContext.Provider
      value={{
        user,
        accessToken,
        isLoggedIn: !!user,
        actions: {
          logout: onLogout,
          login: onLogin,
          register: onRegister
        }
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(authContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
