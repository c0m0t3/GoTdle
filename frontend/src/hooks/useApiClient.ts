import { Configuration, DefaultApi } from '../adapter/api/__generated';
import { useMemo } from 'react';
import { useAuth } from '../providers/AuthProvider.tsx';
import axios from 'axios';

export function useApiClient() {
  const { accessToken } = useAuth();

  return useMemo(() => {
    const basePath = '/api';
    const authHeaders: Record<string, string> = accessToken
      ? { Authorization: `${accessToken}` }
      : {};
    const axiosInstance = axios.create({
      headers: authHeaders
    });
    const config = new Configuration({ basePath });
    return new DefaultApi(config, basePath, axiosInstance);
  }, [accessToken]);
}

