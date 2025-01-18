import { TeamNotesList } from './TeamNotesList';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { providerFixtures, teamNotesFixtures } from '@/tools/test-fixtures';
import { useTeamNotesByProvider } from '@/core/api/TeamNotesQueries';
import { AbilityProvider } from '@/modules/ability/components';

vi.mock('@/modules/auth', () => ({
  useAuthContext: vi.fn(() => ({
    user: {
      organization: { id: 'org_id' },
    },
  })),
}));

vi.mock('@/core/api/TeamNotesQueries', () => ({
  useTeamNotesByProvider: vi.fn(),
}));

beforeEach(() => {
  useTeamNotesByProvider.mockReset();
});

it('renders team noted editor with not existing provider', () => {
  useTeamNotesByProvider.mockReturnValue({
    data: { items: [] },
    mutate: vi.fn(),
  });

  render(<TeamNotesList providerId="note-existing-id" />);
  expect(screen.queryByTestId('team-note-editor-list')).not.toBeInTheDocument();
});

it('renders notes list if provider id passed', async () => {
  let providerId = providerFixtures.defaultProviderForTeamNotes().id;
  let notes = teamNotesFixtures.defaultProviderForTeamNotes();

  useTeamNotesByProvider.mockReturnValue({
    data: { items: notes },
    mutate: vi.fn(),
  });

  render(
    <AbilityProvider rules={[]}>
      <TeamNotesList providerId={providerId} />
    </AbilityProvider>,
  );

  await waitFor(() => {
    expect(screen.getByTestId('team-note-editor-list')).toBeInTheDocument();
  });

  notes.forEach((note) => {
    expect(screen.getByTestId(note.id)).toBeInTheDocument();
  });
});

it('trigger changes on multiple delete', async () => {
  let providerId = providerFixtures.defaultProviderForTeamNotes().id;
  let notes = teamNotesFixtures.defaultProviderForTeamNotes();
  let handler = vi.fn();

  useTeamNotesByProvider.mockReturnValue({
    data: { items: notes },
    mutate: vi.fn(),
  });

  render(
    <AbilityProvider rules={[{ subject: 'TeamNote', action: ['delete'] }]}>
      <TeamNotesList providerId={providerId} onChange={handler} />
    </AbilityProvider>,
  );

  const buttons = screen.queryAllByRole('button', { name: /Delete/i });

  await Promise.all(buttons.map((button) => userEvent.click(button)));

  expect(handler).toHaveBeenCalledTimes(3);
  expect(handler.mock.calls[0][0]).toEqual({ id: notes[0].id, action: 'delete' });
  expect(handler.mock.calls[1][0]).toEqual({ id: notes[1].id, action: 'delete' });
  expect(handler.mock.calls[2][0]).toEqual({ id: notes[2].id, action: 'delete' });
});

it('remove items after click', async () => {
  let providerId = providerFixtures.defaultProviderForTeamNotes().id;
  let notes = teamNotesFixtures.defaultProviderForTeamNotes();

  useTeamNotesByProvider.mockImplementation(() => {
    let [data, setData] = useState({ items: notes });
    return { data, mutate: setData };
  });

  render(
    <AbilityProvider rules={[{ subject: 'TeamNote', action: ['delete'] }]}>
      <TeamNotesList providerId={providerId} />
    </AbilityProvider>,
  );

  const buttons = screen.queryAllByRole('button', { name: /Delete/i });

  await Promise.all(buttons.map((button) => userEvent.click(button)));

  await waitFor(() => {
    for (const note of notes) {
      expect(screen.queryByTestId(note.id)).not.toBeInTheDocument();
    }
  });
});
