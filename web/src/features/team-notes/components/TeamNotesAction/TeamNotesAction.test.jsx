import { render, screen } from '@/tools/app-test-utils';
import { TeamNotesAction } from './TeamNotesAction';
import { within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  organizationFixtures,
  providerFixtures,
  teamNotesFixtures,
  userProfileFixtures,
} from '@/tools/test-fixtures';
import { setupServer } from '@/tools/test-server/setupServer';
import { TeamNotesActions, TeamNoteSubject } from '@/modules/auth/hooks';
import { defineMatchMediaGlobally } from '@/tools/app-test-utils/matchMediaMock';
import { AbilityProvider } from '@/modules/ability/components';

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  defineMatchMediaGlobally(false);
});

function setupTeamNoteAction({ user, ...rest } = {}) {
  if (!rest.providerId) {
    rest.providerId = providerFixtures.defaultProviderForTeamNotes().id;
  }

  let defaultAbilities = [{ subject: 'TeamNote', action: ['paginate', 'write', 'delete'] }];

  render(
    <AbilityProvider rules={user?.abilities ?? defaultAbilities}>
      <TeamNotesAction {...rest} />
    </AbilityProvider>,
    { user, enableAllWrappers: true },
  );
}

function excludeAbilityBy(abilities, subject, action) {
  return abilities.filter((item) => {
    return item.subject === subject ? !item.action.includes(action) : true;
  });
}

describe('team notes action as a button', () => {
  it('renders team notes action with label', async () => {
    const expected = 'See team notes';
    setupTeamNoteAction({ label: expected });

    const button = screen.queryByRole('button');

    expect(within(button).getByText(expected, { exact: false })).toBeInTheDocument();
  });

  it('renders team notes without label', () => {
    setupTeamNoteAction();
    expect(screen.getByRole('button')).toHaveTextContent('');
  });

  it('renders indicator that notes are available', () => {
    setupTeamNoteAction({ hasNotes: true });
    expect(screen.getByTestId('team-note-indicator')).toBeInTheDocument();
  });

  it('renders no indicator', () => {
    setupTeamNoteAction({ hasNotes: false });
    expect(screen.queryByTestId('team-note-indicator')).not.toBeInTheDocument();
  });
});

describe('visibility on permission', () => {
  it('hide action button if no rules', () => {
    const expected = 'See team notes';

    setupTeamNoteAction({
      label: expected,
      user: {
        ...userProfileFixtures.defaultReferralCoordinatorProfile(),
        abilities: [],
      },
    });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  // TODO: MIR-4604
  it.skip('hides text area if no write team note abilities', async () => {
    const user = userProfileFixtures.defaultReferralCoordinatorProfile();
    const abilities = excludeAbilityBy(user.abilities, TeamNoteSubject, TeamNotesActions.Write);

    setupTeamNoteAction({ user: { ...user, abilities } });

    const button = screen.queryByRole('button');
    await userEvent.click(button);

    expect(screen.getByText(/Team notes/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Your Note')).not.toBeInTheDocument();
  });

  it('hide delete all button if no delete ability', () => {
    const user = userProfileFixtures.defaultReferralCoordinatorProfile();
    const abilities = excludeAbilityBy(user.abilities, TeamNoteSubject, TeamNotesActions.Delete);

    setupTeamNoteAction({
      initDialog: true,
      user: { ...user, abilities },
    });

    expect(screen.queryByRole('button', { name: /Delete all notes/i })).not.toBeInTheDocument();
  });
});

describe('open/close dialog', () => {
  it('shows dialog with no handler passed in', async () => {
    setupTeamNoteAction();

    const button = screen.queryByRole('button');
    await userEvent.click(button);

    expect(screen.getByText(/Team notes/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Team notes/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Note')).toBeInTheDocument();
    expect(screen.getByText('500 charters max')).toBeInTheDocument();
  });

  it('shows dialog on init', () => {
    setupTeamNoteAction({ initDialog: true });
    expect(screen.getByRole('heading', { name: /Team notes/i })).toBeInTheDocument();
  });

  it('hides dialog when click confirm with no confirm handler', async () => {
    setupTeamNoteAction({ initDialog: true });

    const button = screen.queryByRole('button', { name: /Save/i });

    await userEvent.click(button);

    expect(screen.queryByRole('heading', { name: /Team notes/i })).not.toBeInTheDocument();
  });

  it('hides dialog and trigger doDelete and doCreate handlers', async () => {
    const doDelete = vi.fn().mockResolvedValue(null);
    const doCreate = vi.fn().mockResolvedValue(null);

    setupTeamNoteAction({ initDialog: true, doDelete, doCreate });

    const button = screen.queryByRole('button', { name: /Save/i });

    await userEvent.click(button);

    expect(doDelete).not.toHaveBeenCalled();
    expect(doCreate).not.toHaveBeenCalled();
  });

  it('hides dialog when click confirm', async () => {
    setupTeamNoteAction({ initDialog: true });

    const button = screen.queryByRole('button', { name: /Save/i });

    await userEvent.click(button);

    expect(screen.queryByRole('heading', { name: /Team notes/i })).not.toBeInTheDocument();
  });

  it('hides dialog when click dismiss', async () => {
    setupTeamNoteAction({ initDialog: true });

    const button = screen.queryByRole('button', { name: /Cancel/i });

    await userEvent.click(button);

    expect(screen.queryByRole('heading', { name: /Team notes/i })).not.toBeInTheDocument();
  });
});

describe('team note editor', () => {
  it('trigger delete if text area was modified', async () => {
    let deletePromise = Promise.resolve(null);
    const doDelete = vi.fn().mockReturnValue(deletePromise);
    let createPromise = Promise.resolve(null);
    const doCreate = vi.fn().mockReturnValue(createPromise);
    const onChange = vi.fn().mockReturnValue(Promise.resolve(null));

    setupTeamNoteAction({ initDialog: true, doCreate, doDelete, onChange });

    const text = 'New note';

    const textarea = screen.queryByPlaceholderText('Your Note');
    await userEvent.type(textarea, text);

    const button = screen.queryByRole('button', { name: /Save/i });
    await userEvent.click(button);

    await waitFor(() => Promise.all([deletePromise, createPromise]));

    expect(doDelete).not.toHaveBeenCalled();
    expect(doCreate).toHaveBeenCalledTimes(1);
    expect(doCreate).toHaveBeenCalledWith({
      text,
      providerId: providerFixtures.defaultProviderForTeamNotes().id,
      organizationId: organizationFixtures.demoOrganization().id,
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('deletes item with confirmation', async () => {
    const notes = teamNotesFixtures.defaultProviderForTeamNotes();
    const firstNote = notes[0];

    setupTeamNoteAction({ initDialog: true });

    await waitFor(() => {
      expect(screen.queryAllByRole('button', { name: 'Delete' }).length).toBeGreaterThanOrEqual(1);
    });

    const card = screen.getByTestId(`team-note-${firstNote.id}`);
    let button = within(card).getByRole('button', { name: 'Delete' });

    await userEvent.click(button);

    button = screen.queryByRole('button', { name: /Save/i });

    await userEvent.click(button);

    expect(screen.queryByTestId(`team-note-${firstNote.id}`)).not.toBeInTheDocument();
  });

  it('renders team note editor', async () => {
    let notes = teamNotesFixtures.defaultProviderForTeamNotes();
    setupTeamNoteAction({
      initDialog: true,
      doDelete: async () => {},
    });

    await waitFor(() => {
      expect(screen.getByTestId('team-note-editor')).toBeInTheDocument();
    });

    await waitFor(() => {
      notes.forEach((note) => {
        expect(screen.getByText(note.text, { exact: false })).toBeInTheDocument();
      });
    });
  });

  it('trigger delete all handler with provider id', async () => {
    const doDeleteAll = vi.fn(() => Promise.resolve());
    const onChange = vi.fn();

    setupTeamNoteAction({
      onChange,
      doDeleteAll,
      initDialog: true,
      shouldEnableDeleteAll: true,
    });

    const button = screen.queryByRole('button', { name: /Delete all notes/i });

    await userEvent.click(button);

    expect(doDeleteAll).toHaveBeenCalledWith({
      id: providerFixtures.defaultProviderForTeamNotes().id,
      organizationId: organizationFixtures.demoOrganization().id,
    });
    expect(onChange).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Team notes/i })).not.toBeInTheDocument();
    });
  });

  it('renders shot label for delete all', () => {
    defineMatchMediaGlobally(true);
    setupTeamNoteAction({ initDialog: true, shouldEnableDeleteAll: true });

    let button = screen.queryByRole('button', { name: /Delete all/i });

    expect(button).toBeInTheDocument();
  });
});
