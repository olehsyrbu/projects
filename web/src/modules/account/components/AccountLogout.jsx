import { useEffect } from 'react';
import { useAuthContext } from '@/modules/auth';
import { useNavigate } from 'react-router-dom';

export function AccountLogout() {
  let navigate = useNavigate();
  let { logOut } = useAuthContext();

  useEffect(() => {
    logOut().then(() => navigate('/', { replace: true }));
  }, []);

  return null;
}
