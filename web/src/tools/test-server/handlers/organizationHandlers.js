import { graphql } from 'msw';
import { organizationFixtures } from '@/tools/test-fixtures';

export const organizationBySubDomainHandler = graphql.query(
  'organizationBySubdomain',
  (req, res, ctx) => {
    return res(
      ctx.data({
        organizationBySubdomain: organizationFixtures.demoOrganization(),
      }),
    );
  },
);
