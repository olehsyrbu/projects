import { useAuthContext } from '@/modules/auth';
import { getRedirectUrlByAccount } from '../utils';

export function useUserRedirect() {
  let { user } = useAuthContext();
  return getRedirectUrlByAccount(user);
}
