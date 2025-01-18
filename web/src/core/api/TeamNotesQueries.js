import useSWR from 'swr';
import { fetchTeamNotedByProviderId } from '@/core/api/TeamNotesAPI';

const defaultDeps = {
  listNotes: fetchTeamNotedByProviderId,
};

export function useTeamNotesByProvider(options, deps) {
  if (!options) {
    options = {};
  }

  const { id, organizationId } = options;
  const { listNotes } = deps || defaultDeps;

  const context = useSWR(
    id && organizationId ? ['teamNotesByProviderId', id, organizationId] : null,
    () => listNotes(options),
  );

  return {
    ...context,
    data: context.data || {
      items: [],
      pageInfo: {},
    },
  };
}
