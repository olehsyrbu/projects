import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthUtils } from './AuthUtils';

export function useUrlAuthToken(query, offset = 0) {
  const location = useLocation();
  return useMemo(
    () => AuthUtils.validate(new URLSearchParams(location.search).get(query), offset),
    [location.search, query],
  );
}
