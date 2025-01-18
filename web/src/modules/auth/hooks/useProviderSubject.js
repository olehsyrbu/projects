import { useMemo } from 'react';
import { useAuthContext } from '@/modules/auth';
import { subject } from '@casl/ability';

export const ProviderAction = {
  Read: 'read',
  Unaffiliate: 'unaffiliate',
  Delete: 'delete',
  Paginate: 'paginate',
};

export function useProviderSubject() {
  const { user } = useAuthContext();

  const organization_ids = user?.organizations?.map((o) => o.id);

  return useMemo(
    () =>
      subject('Provider', {
        organization_ids,
      }),
    [organization_ids],
  );
}
