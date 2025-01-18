import { useAuthContext } from '@/modules/auth';
import { useMemo } from 'react';
import { Ability } from '@casl/ability';
import { ReferralListAction, useReferralListSubject } from '@/modules/auth/hooks';

export function useShowReferralListView() {
  const { user } = useAuthContext();
  const referralListSubject = useReferralListSubject();
  const ability = useMemo(() => (user ? new Ability(user.abilities) : null), [user]);
  return useMemo(() => {
    return Boolean(ability) && ability.can(ReferralListAction.Create, referralListSubject);
  }, [ability]);
}
