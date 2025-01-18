import { useCallback, useState } from 'react';
import gqlClient from '@/core/api/graphQLClient';
import { AuthUtils } from './AuthUtils';

export function useAuthToken(key, offset = 0) {
  function handleTokenInit() {
    let token = localStorage.getItem(key);
    token = AuthUtils.validate(token, offset);

    if (token) {
      gqlClient.setAuth(token);
    } else {
      gqlClient.removeAuth();
      localStorage.removeItem(key);
    }
    return token;
  }

  function handleTokenReset() {
    localStorage.removeItem(key);
    gqlClient.removeAuth();
    setToken('');
  }

  function handleTokenSave(next) {
    next = AuthUtils.validate(next, offset);

    if (next) {
      localStorage.setItem(key, next);
      gqlClient.setAuth(next);
    } else {
      localStorage.removeItem(key);
      gqlClient.removeAuth();
    }
    setToken(next);
  }

  let [token, setToken] = useState(handleTokenInit);
  let reset = useCallback(handleTokenReset, [setToken, key]);
  let save = useCallback(handleTokenSave, [setToken, key, offset]);

  return [token, save, reset];
}
