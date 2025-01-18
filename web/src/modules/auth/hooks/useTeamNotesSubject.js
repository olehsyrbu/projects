import { subject } from '@casl/ability';
import { useAuthContext } from '@/modules/auth';
import { useMemo } from 'react';

export const TeamNotesActions = {
  Read: 'read',
  Paginate: 'paginate',
  Write: 'write',
  Delete: 'delete',
};

export const TeamNoteSubject = 'TeamNote';

export function useTeamNotesSubject() {
  const { user } = useAuthContext();
  const organizationId = user?.organization?.id;

  return useMemo(
    () =>
      subject(TeamNoteSubject, {
        organization: {
          id: organizationId,
        },
      }),
    [organizationId],
  );
}
