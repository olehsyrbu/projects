import {
  ListTeamNotesByProvider,
  CreateTeamNote,
  BatchDeleteTeamNotes,
  DeleteAllTeamNotesByProviderId,
} from './graphql';
import client from './graphQLClient';

export async function fetchTeamNotedByProviderId(options) {
  let response = await client.request(ListTeamNotesByProvider, {
    ...options,
  });

  return response.listTeamNotes;
}

export async function createTeamNote({ text, providerId, organizationId }) {
  let response = await client.request(CreateTeamNote, {
    note: { text },
    providerId,
    organizationId,
  });
  return response.createTeamNote;
}

export async function batchDeleteTeamNotesByIds({ ids }) {
  let response = await client.request(BatchDeleteTeamNotes, { ids });
  return response.deleteTeamNotes;
}

export async function deleteAllTeamNotesByProviderId({ id, organizationId }) {
  let response = await client.request(DeleteAllTeamNotesByProviderId, { id, organizationId });
  return response.deleteAllProviderTeamNotes;
}
