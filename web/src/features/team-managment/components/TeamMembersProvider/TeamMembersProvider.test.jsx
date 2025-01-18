import { TeamMemberContext, TeamMembersProvider } from './TeamMembersProvider';
import { render, screen } from '@/tools/app-test-utils';
import { Suspense, useContext } from 'react';
import { act, waitFor } from '@testing-library/react';
import {
  invitationFixture,
  organizationFixtures,
  userProfileFixtures,
} from '@/tools/test-fixtures';
import { TeamManagementActions, teamManagementReducer } from './teamManagmentReducer';
import { noop } from '@/core/utils';
import { ROLE_NAMES } from '@/core/definitions';
import { SWRConfig } from 'swr';
import { setupServer } from '@/tools/test-server/setupServer';

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

async function setup(options = {}) {
  const doRemove = options.doRemove;
  const doToggle = options.doToggle || noop;

  const user = userProfileFixtures.defaultTeamMemberProfile();
  const organization = organizationFixtures.demoOrganization();

  const returnVal = {};
  function TestComponent() {
    Object.assign(returnVal, useContext(TeamMemberContext));
    return null;
  }

  render(
    <Suspense fallback="Loading...">
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <TeamMembersProvider
          userId={user.id}
          organizationId={organization.id}
          doRemove={doRemove}
          doToggle={doToggle}
        >
          <TestComponent />
        </TeamMembersProvider>
      </SWRConfig>
    </Suspense>,
  );

  return returnVal;
}

it('renders with children', async () => {
  render(
    <TeamMembersProvider userId="testUserId" organizationId="testOrgId">
      Test
    </TeamMembersProvider>,
  );

  expect(screen.getByText(/Test/i)).toBeInTheDocument();
});

it('checks default context value', async () => {
  const val = await setup();

  expect(val.members).toEqual([]);
  expect(val.add).toBeInstanceOf(Function);
  expect(val.remove).toBeInstanceOf(Function);
  expect(val.toggleRole).toBeInstanceOf(Function);
});

it('loads data by org id', async () => {
  let data = invitationFixture.defaultTeamMembersList();
  const val = await setup();
  const currentUserId = userProfileFixtures.defaultTeamMemberProfile().id;

  const { members, admins } = teamManagementReducer(null, {
    type: TeamManagementActions.INIT,
    payload: {
      invitations: data.items,
      currentUserId,
    },
  });

  await waitFor(() => {
    expect(val.admins).toEqual(admins);
  });

  expect(val.members).toEqual(members);
});

it('remove invitation and user by id', async () => {
  const invites = invitationFixture.defaultTeamMembersList().items;
  const invite = invites[0];
  const doRemove = vi.fn().mockReturnValue(Promise.resolve(null));
  const val = await setup({ doRemove });

  await act(async () => {
    await val.remove({ invitationId: invite.id });
  });

  expect(doRemove).toHaveBeenCalledWith({
    ids: [invite.id],
    cascadeUsers: true,
  });
  expect(val.admins.length).toBe(2);
});

it('switch role', async () => {
  let data = invitationFixture.defaultTeamMembersList();
  const thirdInvite = data.items[2];
  let user = thirdInvite.user;
  let userId = user.id;
  const doToggle = vi.fn().mockReturnValue(Promise.resolve(null));
  const val = await setup({ doToggle });

  await act(async () => {
    await val.toggleRole({ userId, invitationId: thirdInvite.id, role: user.role });
  });

  expect(doToggle).toHaveBeenCalledWith(userId, ROLE_NAMES.TEAM_MEMBER);
});
