import {
  batchDeleteTeamNotesByIds,
  createTeamNote,
  deleteAllTeamNotesByProviderId,
  fetchTeamNotedByProviderId,
} from './TeamNotesAPI';
import { setupServer } from '@/tools/test-server/setupServer';
import {
  organizationFixtures,
  pageInfoFixtures,
  providerFixtures,
  teamNotesFixtures,
} from '@/tools/test-fixtures';

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

it('lists team notes by provider and org id', async () => {
  const provider = providerFixtures.defaultProviderForTeamNotes();
  const organization = organizationFixtures.demoOrganization();
  const result = await fetchTeamNotedByProviderId({
    id: provider.id,
    organizationId: organization.id,
  });

  expect(result).toEqual({
    items: teamNotesFixtures.defaultProviderForTeamNotes(),
    pageInfo: pageInfoFixtures.defaultPageInfo(),
  });
});

it('created team note for provider', async () => {
  const provider = providerFixtures.defaultProviderForTeamNotes();
  const note = teamNotesFixtures.teamNoteOnCreate();
  const organization = organizationFixtures.demoOrganization();

  const actual = await createTeamNote({
    text: note.text,
    providerId: provider.id,
    organizationId: organization.id,
  });

  expect(actual).toEqual(note);
});

it('deletes all team notes by provider id', async () => {
  const provider = providerFixtures.defaultProviderForTeamNotes();
  const expected = teamNotesFixtures.teamNoteResponseOnDeleteAll();
  const organization = organizationFixtures.demoOrganization();

  const actual = await deleteAllTeamNotesByProviderId({
    id: provider.id,
    organizationId: organization.id,
  });

  expect(actual).toEqual(expected);
});

it('deletes notes by ids', async () => {
  let ids = ['aaa', 'bbb'];
  const actual = await batchDeleteTeamNotesByIds({ ids });
  expect(actual).toEqual(ids);
});
