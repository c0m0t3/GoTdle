import { Configuration, DefaultApi } from '../adapter/api/__generated';
import { useMemo } from 'react';

export const useApiClient = () => {
  const basePath = '/api';

  return useMemo(() => {
    const config = new Configuration({ basePath });
    return new DefaultApi(config, basePath);
  }, [basePath]);
};
