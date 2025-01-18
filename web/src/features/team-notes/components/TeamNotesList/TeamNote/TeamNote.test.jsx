import { render, screen } from '@/tools/app-test-utils';
import { TeamNote } from './TeamNote';
import {
  organizationFixtures,
  teamNotesFixtures,
  userProfileFixtures,
} from '@/tools/test-fixtures';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

async function setupTeamNote({ children, user, ...rest }) {
  await render(<TeamNote {...rest}>{children}</TeamNote>, {
    enableAllWrappers: true,
    user,
  });
}

it('renders team note', async () => {
  const note = teamNotesFixtures.defaultSingleTeamNote();

  await setupTeamNote({
    id: note.id,
    fullName: note.fullName,
    children: note.text,
    author: userProfileFixtures.defaultReferralCoordinatorProfile(),
    organization: organizationFixtures.demoOrganization(),
  });

  expect(screen.getByText(note.text)).toBeInTheDocument();
  expect(screen.getByText(note.fullName)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  expect(screen.queryByTestId('team-note-time')).not.toBeInTheDocument();
  expect(screen.queryByTestId('team-note-date-distance')).not.toBeInTheDocument();
});

it('renders team note delete action for team member as author', async () => {
  const note = teamNotesFixtures.defaultSingleTeamNote();

  await setupTeamNote({
    user: userProfileFixtures.defaultTeamMemberProfile(),
    id: note.id,
    fullName: note.fullName,
    children: note.text,
    author: userProfileFixtures.defaultTeamMemberProfile(),
    organization: organizationFixtures.demoOrganization(),
  });

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });
});

it('disables delete if no the same author', async () => {
  const note = teamNotesFixtures.defaultSingleTeamNote();

  await setupTeamNote({
    user: userProfileFixtures.defaultTeamMemberProfile(),
    id: note.id,
    fullName: note.fullName,
    children: note.text,
    author: userProfileFixtures.defaultReferralCoordinatorProfile(),
    organization: organizationFixtures.demoOrganization(),
  });

  await waitFor(() => {
    expect(screen.queryByRole('button', { name: /Delete/i })).toBeDisabled();
  });
});

it('disables delete if no the same organization', async () => {
  const note = teamNotesFixtures.defaultSingleTeamNote();

  await setupTeamNote({
    user: userProfileFixtures.defaultTeamMemberProfile(),
    id: note.id,
    fullName: note.fullName,
    children: note.text,
    author: userProfileFixtures.defaultReferralCoordinatorProfile(),
    organization: organizationFixtures.orgWithoutAttributes(),
  });

  await waitFor(() => {
    expect(screen.queryByRole('button', { name: /Delete/i })).toBeDisabled();
  });
});

it('render not available author and date passed', async () => {
  const note = teamNotesFixtures.defaultSingleTeamNote();

  await setupTeamNote({
    id: note.id,
    fullName: note.fullName,
    children: note.text,
    createdAt: note.createdAt,
  });

  expect(screen.getByText(note.fullName + ' (deleted)')).toBeInTheDocument();
  expect(screen.getByTestId('team-note-time')).toBeInTheDocument();
  expect(screen.getByTestId('team-note-date-distance')).toBeInTheDocument();
});

it('triggers delete handler on click', async () => {
  const note = teamNotesFixtures.defaultSingleTeamNote();
  const handler = vi.fn();
  const organization = organizationFixtures.demoOrganization();

  await setupTeamNote({
    id: note.id,
    children: note.text,
    onDelete: handler,
    organization,
  });

  const button = screen.queryByRole('button', { name: /Delete/i });

  await userEvent.click(button);

  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith({ id: note.id, organizationId: organization.id });
});
