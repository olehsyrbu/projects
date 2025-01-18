import { TeamManagementPage } from './TeamManagementPage';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from '@/tools/test-server/setupServer';

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

vi.mock('@/modules/auth', () => ({
  useAuthContext: vi.fn(() => ({ user: { id: 'x' } })),
}));

function renderPage(page) {
  render(
    <MemoryRouter initialEntries={['/team-management']}>
      <Routes>
        <Route path="team-management/*" element={page} />
        <Route path="*" element="Not Found" />
      </Routes>
    </MemoryRouter>,
  );
}

it('opens list team members by default', () => {
  renderPage(<TeamManagementPage organizationId="123" />);

  expect(screen.getByText(/Manage my team/i)).toBeInTheDocument();
});

it('renders add tea members', async () => {
  renderPage(<TeamManagementPage organizationId="123" />);

  await userEvent.click(screen.getByRole('button', { name: 'Add team members' }));

  expect(screen.getByRole('heading', { level: 1, name: /Add team members/i })).toBeInTheDocument();
});

it('redirects back to team members', async () => {
  renderPage(<TeamManagementPage organizationId="123" />);

  await userEvent.click(screen.getByRole('button', { name: 'Add team members' }));
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

  expect(screen.getByText(/Manage my team/i)).toBeInTheDocument();
});
