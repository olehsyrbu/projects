import { render, screen } from '@/tools/app-test-utils';
import { TeamMemberCard } from './TeamMemberCard';
import { invitationFixture, userProfileFixtures } from '@/tools/test-fixtures';
import { userFixtures } from '@/tools/test-fixtures/userFixtures';
import userEvent from '@testing-library/user-event';

async function setupTeamCard({ invitation, onRemove, user, onAdminChange, account }) {
  await render(
    <TeamMemberCard
      invitation={invitation}
      onRemove={onRemove}
      user={user}
      onAdminChange={onAdminChange}
    />,
    {
      enableAllWrappers: true,
      user: account,
    },
  );
}

it('renders without user', async () => {
  const email = 'joe@email.com';
  const firstName = 'Joe';
  const lastName = 'Joe';

  const invitation = invitationFixture.invitationWithoutUser({
    email,
    lastName,
    firstName,
  });

  await setupTeamCard({ invitation });

  expect(screen.getByRole('heading', { name: invitation.recipientName })).toBeInTheDocument();
  expect(screen.getByText(email)).toBeInTheDocument();
  expect(screen.getByText(/Mail sent Nov 22, 2021/i)).toBeInTheDocument();

  expect(screen.getByRole('button', { name: /Remove/i })).toBeInTheDocument();
  expect(screen.queryByText(/Admin/i)).not.toBeVisible();
});

it('renders disabled remove action for user as current account', async () => {
  const invitation = invitationFixture.invitationWithoutUser({
    email: 'joe@email.com',
    lastName: 'Joe',
    firstName: 'Joe',
  });

  const user = userProfileFixtures.defaultReferralCoordinatorProfile();

  invitation.user = user;

  await setupTeamCard({ invitation, user, account: user });

  expect(screen.getByRole('button', { name: /Remove/i })).toBeDisabled();
});

it('renders disabled toggle action for user as current account', async () => {
  const invitation = invitationFixture.invitationWithoutUser({
    email: 'joe@email.com',
    lastName: 'Joe',
    firstName: 'Joe',
  });

  const user = userProfileFixtures.defaultReferralCoordinatorProfile();

  invitation.user = user;

  await setupTeamCard({ invitation, user, account: user });

  expect(screen.getByRole('switch')).toBeDisabled();
});

it('triggers on remove action without user', async () => {
  const invitation = invitationFixture.invitationWithoutUser({
    email: 'joe@email.com',
    lastName: 'Joe',
    firstName: 'Joe',
  });

  const handler = vi.fn();

  await setupTeamCard({ invitation, onRemove: handler });

  const button = screen.getByRole('button', { name: /Remove/i });

  await userEvent.click(button);

  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith({
    invitationId: invitation.id,
    userId: null,
    name: 'Joe Joe',
  });
});

it('renders with user as not an admin', async () => {
  const invitation = invitationFixture.invitationWithoutUser({
    email: 'joe@email.com',
    lastName: 'Joe',
    firstName: 'Joe',
  });

  const user = userFixtures.defaultUser({
    email: 'user@test.com',
    firstName: 'User',
    lastName: 'User',
    isAdmin: false,
  });

  await setupTeamCard({ invitation, user });

  screen.getByRole('heading', { name: `${user.firstName} ${user.lastName}` });
  screen.getByText(user.email);
  screen.getByText(/Logged in Nov 5, 2021/i);

  expect(screen.getByRole('button', { name: /Remove/i })).toBeInTheDocument();
  expect(screen.getByText(/Admin/i)).toBeInTheDocument();
  expect(screen.queryByRole('switch').checked).toBeFalsy();
});

it('renders with user as admin', async () => {
  await setupTeamCard({
    invitation: invitationFixture.invitationWithoutUser({
      email: 'joe@email.com',
      lastName: 'Joe',
      firstName: 'Joe',
    }),
    user: userFixtures.defaultUser({
      email: 'user@test.com',
      firstName: 'User',
      lastName: 'User',
      isAdmin: true,
    }),
  });

  expect(screen.getByRole('switch').checked).toBeTruthy();
});

it('triggers non-admin to admin', async () => {
  const handler = vi.fn();

  let user = userFixtures.defaultUser({
    email: 'user@test.com',
    firstName: 'User',
    lastName: 'User',
    isAdmin: false,
  });
  let invitation = invitationFixture.invitationWithoutUser({
    email: 'joe@email.com',
    lastName: 'Joe',
    firstName: 'Joe',
  });

  await setupTeamCard({ invitation, user, onAdminChange: handler });

  const control = screen.getByRole('switch');

  await userEvent.click(control);

  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith({
    userId: user.id,
    invitationId: invitation.id,
    role: user.role,
  });
});

it('triggers on remove action with user', async () => {
  const invitation = invitationFixture.invitationWithoutUser({
    email: 'joe@email.com',
    lastName: 'Joe',
    firstName: 'Joe',
  });

  const user = userFixtures.defaultUser({
    email: 'user@test.com',
    firstName: 'User',
    lastName: 'User',
    isAdmin: false,
  });

  const handler = vi.fn();

  await setupTeamCard({ invitation, user, onRemove: handler });

  const button = screen.getByRole('button', { name: /Remove/i });

  await userEvent.click(button);

  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith({
    invitationId: invitation.id,
    userId: user.id,
    name: `User User`,
  });
});
