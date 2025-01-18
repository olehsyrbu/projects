import { graphql } from 'msw';
import { userProfileFixtures } from '@/tools/test-fixtures';

export const meAsRcHandler = graphql.query('selfProfile', (req, res, ctx) => {
  return res(
    ctx.data({
      me: userProfileFixtures.defaultReferralCoordinatorProfileWithRawConditions(),
    }),
  );
});
