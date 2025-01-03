import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '../hooks/useApiClient.ts';
import axios from 'axios';

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
  const client = useApiClient();

  const [accessToken, setAccessToken] = useLocalStorage<string | null>(
    'accessToken',
    null
  );
  const onLogin = async (loginData: LoginData) => {
    try {
      const res = await client.postUserLogin(loginData);
      if ('accessToken' in res.data && res.data.accessToken) {
        setAccessToken(res.data.accessToken);
        navigate('/', { replace: true });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.errors[0]);
      }
    }
  };

  const onLogout = () => {
    setAccessToken(null);
    navigate('/auth/login', { replace: true });
  };

  const onRegister = async (registerData: RegisterData) => {
    try {
      const res = await client.postUserRegister(registerData);
      if ('user' in res.data) {
        const loginData: LoginData = {
          identifier: registerData.email,
          password: registerData.password,
          type: 'email'
        };
        await onLogin(loginData);
        return;
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.errors[0]);
      } else {
        throw new Error('Registration failed');
      }
    }
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
