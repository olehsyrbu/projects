import { graphql } from 'msw';
import {
  organizationFixtures,
  pageInfoFixtures,
  providerFixtures,
  teamNotesFixtures,
} from '@/tools/test-fixtures';

export const listTeamNotesHandler = graphql.query('listTeamNotesByProvider', (req, res, ctx) => {
  let providerId = providerFixtures.defaultProviderForTeamNotes().id;
  let organizationId = organizationFixtures.demoOrganization().id;
  if (req.variables.id === providerId && req.variables.organizationId === organizationId) {
    return res(
      ctx.data({
        listTeamNotes: {
          items: teamNotesFixtures.defaultProviderForTeamNotes(),
          pageInfo: pageInfoFixtures.defaultPageInfo(),
        },
      }),
    );
  }

  return null;
});

export const createTeamNoteHandler = graphql.mutation('createTeamNote', (req, res, ctx) => {
  const { providerId } = req.variables;
  let organizationId = organizationFixtures.demoOrganization().id;
  const defaultProvider = providerFixtures.defaultProviderForTeamNotes();

  if (providerId === defaultProvider.id && req.variables.organizationId === organizationId) {
    return res(
      ctx.data({
        createTeamNote: teamNotesFixtures.teamNoteOnCreate(),
      }),
    );
  }

  return null;
});

export const deleteTeamNoteHandler = graphql.mutation('deleteTeamNoteByIds', (req, res, ctx) => {
  const { ids } = req.variables;

  return res(
    ctx.data({
      deleteTeamNotes: ids,
    }),
  );
});

export const deleteAllTeamNoteHandler = graphql.mutation(
  'deleteAllNotesByProviderId',
  (req, res, ctx) => {
    const { id } = req.variables;
    let organizationId = organizationFixtures.demoOrganization().id;

    const response = teamNotesFixtures.teamNoteResponseOnDeleteAll();

    if (id === response.id && req.variables.organizationId === organizationId) {
      return res(
        ctx.data({
          deleteAllProviderTeamNotes: response,
        }),
      );
    }

    return null;
  },
);
