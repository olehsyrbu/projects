import { graphql } from 'msw';
import { userProfileFixtures } from '@/tools/test-fixtures';

export const registrationHandler = graphql.mutation('registerUser', (req, res, ctx) => {
  return res(
    ctx.data({
      register: {
        user: userProfileFixtures.defaultReferralCoordinatorProfileWithRawConditions(),
        token: {
          auth: 'some-code-here',
        },
      },
    }),
  );
});
