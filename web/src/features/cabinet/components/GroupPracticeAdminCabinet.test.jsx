import { GroupPracticeAdminCabinet } from './GroupPracticeAdminCabinet';
import { Suspense } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { useAuthContext } from '@/modules/auth';
import { setupServer } from '@/tools/test-server/setupServer';
import { userProfileFixtures } from '@/tools/test-fixtures';
import { defineMatchMediaGlobally } from '@/tools/app-test-utils/matchMediaMock';

vi.mock('@/core/mixpanel', () => ({
  default: {
    set_group: vi.fn(),
  },
}));

vi.mock('@/modules/auth', () => ({
  useAuthContext: vi.fn(),
}));

vi.mock('@/core/api/ProviderQueries', () => ({
  useGPAProviders: vi.fn(() => ({ data: { items: [] } })),
}));

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());
beforeEach(() => {
  defineMatchMediaGlobally(true);
});
afterEach(() => {
  defineMatchMediaGlobally(false);
  server.resetHandlers();
});

function renderRoute(children) {
  render(
    <Suspense fallback="Loading">
      <MemoryRouter initialEntries={['/group-practice/dashboard']}>
        <Routes>
          <Route index element="index page" />
          <Route path="/group-practice" element="GPA index page" />
          <Route path="/group-practice/*" element={children} />
        </Routes>
      </MemoryRouter>
    </Suspense>,
  );
}

it('GPA cabinet redirects to root if no user', () => {
  useAuthContext.mockReturnValue({ user: null });

  renderRoute(<GroupPracticeAdminCabinet />);

  expect(screen.getByText('GPA index page')).toBeInTheDocument();
});

it('redirects to root if just a user', () => {
  useAuthContext.mockReturnValue({ user: userProfileFixtures.defaultUser() });

  renderRoute(<GroupPracticeAdminCabinet />);

  expect(screen.getByText('Page not found')).toBeInTheDocument();
});

it.skip('renders all navigations for GPA', async () => {
  useAuthContext.mockReturnValue({ user: userProfileFixtures.defaultGPA() });

  renderRoute(<GroupPracticeAdminCabinet />);

  expect(screen.getByRole('link', { name: /My resources/i })).toBeInTheDocument();
});
