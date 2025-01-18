import { useMemo } from 'react';
import { useAuthContext } from '@/modules/auth';
import { subject } from '@casl/ability';

export const InvitationAction = {
  Read: 'read',
  Write: 'write',
  Delete: 'delete',
  Create: 'create',
};

export const invitationByOrganizationId = (organization_ids) =>
  subject('Invitation', {
    organization_ids: organization_ids,
  });

export function useInvitationSubject() {
  const { user } = useAuthContext();
  const organization_ids = user?.organizations?.map((o) => o.id);
  return useMemo(() => invitationByOrganizationId(organization_ids), [organization_ids]);
}
