import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRedirectUrlByAccount } from '@/modules/auth/utils';
import { useUrlAuthToken, useAuthContext } from '@/modules/auth';

export function LoginAsPage() {
  let navigate = useNavigate();
  let { token, user, setToken } = useAuthContext();
  let newToken = useUrlAuthToken('auth_token');

  useEffect(() => {
    if (token !== newToken) {
      setToken(newToken);
      navigate(0); // reload page
    } else {
      navigate(getRedirectUrlByAccount(user), { replace: true });
    }
  }, []);

  return 'Loading...';
}
