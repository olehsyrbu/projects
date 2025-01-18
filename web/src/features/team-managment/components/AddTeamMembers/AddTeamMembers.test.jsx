import { render, screen } from '@/tools/app-test-utils';
import userEvent from '@testing-library/user-event';
import { setupServer } from '@/tools/test-server/setupServer';
import { AddTeamMembers } from './AddTeamMembers';
import { waitFor } from '@testing-library/react';

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

function setupAddTeamMembers(args) {
  render(<AddTeamMembers {...args} />);
}

it('check title', async () => {
  setupAddTeamMembers({ organizationId: 'demo' });

  expect(screen.getByRole('heading', { level: 1, name: /Add team members/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add team member' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add to team' })).toBeInTheDocument();
});

it('submits new members and call handler on success', async () => {
  const handleAddToTeam = vi.fn();
  setupAddTeamMembers({ organizationId: 'demo', onAddToTeam: handleAddToTeam });

  await userEvent.type(screen.getByLabelText(/First name/i), 'test');
  await userEvent.type(screen.getByLabelText(/Last name/i), 'test');
  await userEvent.type(screen.getByLabelText(/Email/i), 'test@email.com');

  let button = screen.getByRole('button', { name: /Add to team/i });
  await userEvent.click(button);

  await waitFor(() => {
    expect(handleAddToTeam).toHaveBeenCalledTimes(1);
  });
});

it('triggers cancel of adding team members', async () => {
  const handleCancel = vi.fn();
  setupAddTeamMembers({ organizationId: 'demo', onCancel: handleCancel });

  let button = screen.getByRole('button', { name: /Cancel/i });
  await userEvent.click(button);

  expect(handleCancel).toHaveBeenCalledTimes(1);
  // await waitFor(() => {});
});
