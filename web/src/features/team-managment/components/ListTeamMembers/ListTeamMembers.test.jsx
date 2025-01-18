import { ListTeamMembers } from './ListTeamMembers';
import { render, screen } from '@/tools/app-test-utils';
import userEvent from '@testing-library/user-event';
import { TeamMembersProvider } from '../TeamMembersProvider';
import {
  invitationFixture,
  organizationFixtures,
  userProfileFixtures,
} from '@/tools/test-fixtures';
import { within, waitFor } from '@testing-library/react';
import { setupServer } from '@/tools/test-server/setupServer';
import { ROLE_NAMES } from '@/core/definitions';

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

async function setupMemberList({ handleNew } = {}) {
  const organization = organizationFixtures.demoOrganization();
  const user = userProfileFixtures.defaultTeamMemberProfile();
  await render(
    <TeamMembersProvider userId={user.id} organizationId={organization.id}>
      <ListTeamMembers onNewTeamMember={handleNew} />
    </TeamMembersProvider>,
    {
      user,
      organization,
      enableAllWrappers: true,
    },
  );
}

it('check title', async () => {
  await setupMemberList();
  expect(screen.getByRole('heading', { level: 1, name: /Manage my team/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: /Admins/i })).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { level: 2, name: /Team members/i }),
  ).not.toBeInTheDocument();

  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
});

it('check add team members handler', async () => {
  const handleNewTeamMember = vi.fn();

  await setupMemberList({
    initialList: invitationFixture.emptyList(),
    handleNew: handleNewTeamMember,
  });

  let button = screen.getByRole('button', { name: /Add team members/i });

  await userEvent.click(button);

  expect(handleNewTeamMember).toHaveBeenCalledTimes(1);
});

it('renders admin and member headings', async () => {
  await setupMemberList({ initialList: invitationFixture.defaultTeamMembersList() });

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /Team members/i })).toBeInTheDocument();
  });

  const items = screen.queryAllByRole('listitem');
  expect(items.length).toBe(6);

  const admins = screen.queryByTestId('adminGroup');
  expect(within(admins).queryAllByRole('listitem').length).toBe(3);
  expect(within(admins).getByText(/RC4 RC4/i)).toBeInTheDocument();
  expect(within(admins).getByText(/New RC 1/i)).toBeInTheDocument();
  expect(within(admins).getByText(/New RC 2/i)).toBeInTheDocument();

  const members = screen.queryByTestId('memberGroup');
  expect(within(members).queryAllByRole('listitem').length).toBe(3);
  expect(within(members).getByText(/TM1 TM1/i)).toBeInTheDocument();
  expect(within(members).getByText(/tm2 tm2/i)).toBeInTheDocument();
  expect(within(members).getByRole('heading', { name: /TM5/i })).toBeInTheDocument();
});

it('remove admin and then team member', async () => {
  const initialList = invitationFixture.defaultTeamMembersList();
  const itemToDelete = initialList.items[0];
  await setupMemberList({ initialList: initialList });

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /Team members/i })).toBeInTheDocument();
  });

  const items = screen.queryAllByRole('listitem');
  const lastMember = items[items.length - 1];

  const elementToDelete = screen.queryByTestId(itemToDelete.email);
  let button = within(elementToDelete).getByRole('button');

  await userEvent.click(button);

  await waitFor(() => {
    expect(screen.getByText(/Remove team member/i)).toBeInTheDocument();
  });

  expect(
    screen.getByText(
      /Removing this team member means they will no longer be on your team. Are you sure you want to remove them?/i,
    ),
  ).toBeInTheDocument();

  let confirm = screen.getByRole('button', { name: /Confirm/i });
  await userEvent.click(confirm);

  await waitFor(() => {
    expect(elementToDelete).not.toBeInTheDocument();
  });

  button = within(lastMember).getByRole('button');
  await userEvent.click(button);

  await waitFor(() => {
    expect(screen.getByText(/Remove team member/i)).toBeInTheDocument();
  });

  expect(
    screen.getByText(
      /Removing this team member means they will no longer be on your team. Are you sure you want to remove them?/i,
    ),
  ).toBeInTheDocument();

  confirm = screen.getByRole('button', { name: /Confirm/i });
  await userEvent.click(confirm);

  await waitFor(() => {
    expect(screen.queryByTestId('tm5@provider.com')).not.toBeInTheDocument();
  });
});

it('closes confirmation dialog', async () => {
  await setupMemberList();

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /Team members/i })).toBeInTheDocument();
  });

  const items = screen.queryAllByRole('listitem');
  const firstAdmin = items[0];

  let button = within(firstAdmin).getByRole('button');

  await userEvent.click(button);

  await waitFor(() => {
    expect(screen.getByText(/Remove team member/i)).toBeInTheDocument();
  });

  expect(
    screen.getByText(
      /Removing this team member means they will no longer be on your team. Are you sure you want to remove them?/i,
    ),
  ).toBeInTheDocument();

  let cancel = screen.getByRole('button', { name: /Cancel/i });
  await userEvent.click(cancel);

  await waitFor(() => {
    expect(screen.getByTestId('rc4+igornester@gmail.com')).toBeInTheDocument();
  });
});

it('switch admin to member', async () => {
  const initialList = invitationFixture.defaultTeamMembersList().items;

  const adminInvite = initialList.find(
    ({ user }) => user?.role === ROLE_NAMES.REFERRAL_COORDINATOR,
  );

  await setupMemberList();

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /Team members/i })).toBeInTheDocument();
  });

  const email = adminInvite.user.email;

  let toggle = within(screen.queryByTestId(email)).getByRole('switch');

  await userEvent.click(toggle);

  await waitFor(() => {
    const members = screen.queryByTestId('memberGroup');
    expect(within(members).queryAllByRole('listitem').length).toBe(4);
  });
});

it('switch member to admin', async () => {
  const initialList = invitationFixture.defaultTeamMembersList().items;
  const teamMemberInvite = initialList.find(({ user }) => user?.role === ROLE_NAMES.TEAM_MEMBER);

  await setupMemberList();

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /Team members/i })).toBeInTheDocument();
  });

  const email = teamMemberInvite.user.email;
  const card = screen.getByTestId(email);

  const control = within(card).getByRole('switch');

  await userEvent.click(control);

  await waitFor(() => {
    const admins = screen.queryByTestId('adminGroup');
    expect(within(admins).queryAllByRole('listitem').length).toBe(4);
  });
});
