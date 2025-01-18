import { setupServer } from '@/tools/test-server/setupServer';
import { fetchUserProfile, switchRole } from '@/core/api/UserAPI';
import { userProfileFixtures } from '@/tools/test-fixtures';
import { parseAbilities } from '@/core/api/utils';
import { ROLE_NAMES } from '@/core/definitions';
import { userFixtures } from '@/tools/test-fixtures/userFixtures';

const server = setupServer();
const token = 'secret';

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

function setupClient(returnValue) {
  return {
    request: vi.fn().mockReturnValue(Promise.resolve(returnValue)),
  };
}

it('call for user with no me', async () => {
  const client = setupClient({
    me: null,
  });

  const actual = await fetchUserProfile(token, client);

  expect(actual).toBeNull();
});

it('call for user query and return me', async () => {
  const client = setupClient({
    me: {
      abilities: [],
    },
  });

  const actual = await fetchUserProfile(token, client);

  expect(actual.abilities).toEqual([]);
});

it('replace abilities with parsed abilities', async () => {
  const client = setupClient({
    me: {
      abilities: [
        {
          subject: 'Provider',
          action: ['read', 'unaffiliate', 'delete', 'paginate'],
          conditions: ['{"owner.organization.id":"571c9349-502a-47ce-9aee-24f780891fa8"}'],
        },
        {
          subject: 'Invitation',
          action: ['read', 'write', 'delete', 'create', 'paginate'],
          conditions: ['{"owner.organization.id":"571c9349-502a-47ce-9aee-24f780891fa8"}'],
        },
      ],
    },
  });

  const actual = await fetchUserProfile(token, client);

  expect(actual.abilities).toMatchSnapshot();
});

it('call with default client', async () => {
  const actual = await fetchUserProfile();

  let expected = userProfileFixtures.defaultReferralCoordinatorProfileWithRawConditions();
  expect(actual).toEqual({
    ...expected,
    abilities: parseAbilities(expected.abilities),
  });
});

it('switches role for user', async () => {
  const actual = await switchRole('some-id', ROLE_NAMES.TEAM_MEMBER);
  expect(actual).toEqual(userFixtures.successResponseOnUserUpdate());
});
