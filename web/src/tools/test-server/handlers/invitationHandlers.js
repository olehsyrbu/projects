import { graphql } from 'msw';
import { invitationFixture } from '@/tools/test-fixtures';

export const teamMemberInvitationHandler = graphql.query(
  'listTeamMemberInvitations',
  (req, res, ctx) => {
    return res(
      ctx.data({
        invitationsPagination: invitationFixture.defaultTeamMembersList(),
      }),
    );
  },
);

export const createInvitationsHandler = graphql.mutation('CreateInvitations', (req, res, ctx) => {
  return res(
    ctx.data({
      createInvitations: invitationFixture.batchCreateOnlySuccess(),
    }),
  );
});

export const batchDeleteInvitationHandler = graphql.mutation(
  'deleteInvitations',
  (req, res, ctx) => {
    return res(
      ctx.data({
        deleteInvitations: invitationFixture.batchDeleteSuccess(),
      }),
    );
  },
);
