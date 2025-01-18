import { graphql } from 'msw';
import { userFixtures } from '@/tools/test-fixtures';

export const updateUserHandler = graphql.mutation('updateUser', (req, res, ctx) => {
  return res(
    ctx.data({
      updateUser: userFixtures.successResponseOnUserUpdate(),
    }),
  );
});
