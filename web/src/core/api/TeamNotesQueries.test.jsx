import { renderHook, waitFor } from '@testing-library/react';
import { useTeamNotesByProvider } from '@/core/api/TeamNotesQueries';
import {
  organizationFixtures,
  pageInfoFixtures,
  providerFixtures,
  teamNotesFixtures,
} from '@/tools/test-fixtures';
import { SWRConfig } from 'swr';
import { Suspense } from 'react';
import { setupServer } from '@/tools/test-server/setupServer';

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
});

function setupTeamNotesByProvider(options, deps) {
  function Wrapper({ children }) {
    return (
      <Suspense fallback="Loading...">
        <SWRConfig value={{ dedupingInterval: 0 }}>{children}</SWRConfig>
      </Suspense>
    );
  }

  return renderHook(() => useTeamNotesByProvider(options, deps), {
    wrapper: Wrapper,
  });
}

it('renders notes with deps', async () => {
  const providerId = 'fake-test-id';
  const expected = {
    items: [],
    pageInfo: {},
  };
  const listNotes = vi.fn().mockReturnValue(Promise.resolve(expected));
  let organizationId = organizationFixtures.demoOrganization().id;
  const { result } = setupTeamNotesByProvider({ id: providerId, organizationId }, { listNotes });

  await waitFor(() => {
    expect(listNotes).toHaveBeenCalledWith({ id: providerId, organizationId });
  });

  expect(result.current.data).toEqual(expected);
});

it('renders notes for provider by id with defaults', async () => {
  const provider = providerFixtures.defaultProviderForTeamNotes();
  let organizationId = organizationFixtures.demoOrganization().id;

  const { result } = setupTeamNotesByProvider({
    id: provider.id,
    organizationId,
  });

  await waitFor(() => {
    expect(result.current.data).toEqual({
      items: teamNotesFixtures.defaultProviderForTeamNotes(),
      pageInfo: pageInfoFixtures.defaultPageInfo(),
    });
  });
});

it('renders if no provider id passed', async () => {
  const { result } = setupTeamNotesByProvider(null);

  expect(result.current.data).toEqual({ items: [], pageInfo: {} });
});
