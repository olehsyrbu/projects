import { AppRedirect } from './AppRedirect';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { useAuthContext } from '@/modules/auth';

vi.mock('@/modules/auth', () => ({
  useAuthContext: vi.fn(),
}));

function Router(props) {
  return (
    <MemoryRouter {...props}>
      <Routes>
        <Route index element="root" />
        <Route path="provider/*">
          <Route index element="provider" />
          <Route path="dashboard" element={<span>provider dashboard</span>} />
        </Route>
        <Route path="program/*" element={<Outlet />}>
          <Route index element="program" />
          <Route path="resources" element="program resources" />
        </Route>
        <Route path="group-practice-admin" element="group-practice" />
        <Route path="group-practice/*" element={<Outlet />}>
          <Route index element="group practice" />
          <Route path="resources" element="group practice resources" />
        </Route>
        <Route path="referral-coordinator/*" element={<Outlet />}>
          <Route index element="referral coordinator" />
          <Route path="resources" element="referral coordinator resources" />
        </Route>
      </Routes>
      <AppRedirect />
    </MemoryRouter>
  );
}

it('renders app redirect with root', () => {
  useAuthContext.mockReturnValue({ user: null });
  render(<Router />);
  expect(screen.getByText('root')).toBeInTheDocument();
});

it('redirects provider', () => {
  useAuthContext.mockReturnValue({ user: { role: '' } });
  render(<Router initialEntries={['/provider']} />);
  expect(screen.getByText('provider dashboard')).toBeInTheDocument();
});

it('redirects RC', () => {
  useAuthContext.mockReturnValue({ user: { role: 'REFERRAL_COORDINATOR' } });
  render(<Router initialEntries={['/referral-coordinator']} />);
  expect(screen.getByText('referral coordinator resources')).toBeInTheDocument();
});

it('redirects GPA', () => {
  useAuthContext.mockReturnValue({ user: { role: 'GPA' } });
  render(<Router initialEntries={['/group-practice-admin']} />);
  expect(screen.getByText('group practice resources')).toBeInTheDocument();
});

it('redirects TM', () => {
  useAuthContext.mockReturnValue({ user: { role: 'TEAM_MEMBER' } });
  render(<Router initialEntries={['/referral-coordinator']} />);
  expect(screen.getByText('referral coordinator resources')).toBeInTheDocument();
});
