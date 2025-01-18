import { ProtectedRoute } from './ProtectedRoute';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { useAuthContext } from '@/modules/auth';
import { invitationByOrganizationId, InvitationAction } from '@/modules/auth/hooks';
import { organizationFixtures, userProfileFixtures } from '@/tools/test-fixtures';

vi.mock('@/core/mixpanel', () => ({
  default: {
    set_group: vi.fn(),
  },
}));

vi.mock('@/modules/auth', () => ({
  useAuthContext: vi.fn(),
}));

function renderRoute(children) {
  render(
    <MemoryRouter>
      <Routes>
        <Route index element={children} />
        <Route path="not-found" element="Page Not Found" />
      </Routes>
    </MemoryRouter>,
  );
}

it('render default fallback as not-found', () => {
  useAuthContext.mockReturnValue({ user: null });

  renderRoute(<ProtectedRoute>Protected Content</ProtectedRoute>);

  expect(screen.getByText('Page Not Found')).toBeInTheDocument();
});

it('render custom fallback', () => {
  useAuthContext.mockReturnValue({ user: null });

  renderRoute(<ProtectedRoute fallback="Custom Fallback">Protected Content</ProtectedRoute>);

  expect(screen.getByText('Custom Fallback')).toBeInTheDocument();
});

it('render component if user pressed but no permissions provided', () => {
  useAuthContext.mockReturnValue({ user: userProfileFixtures.defaultReferralCoordinatorProfile() });

  renderRoute(<ProtectedRoute fallback="Custom Fallback">Protected Content</ProtectedRoute>);

  expect(screen.queryByText('Page Not Found')).not.toBeInTheDocument();
  expect(screen.getByText('Protected Content')).toBeInTheDocument();
});

it('render not-found if ability check failed', () => {
  useAuthContext.mockReturnValue({ user: userProfileFixtures.defaultTeamMemberProfile() });

  renderRoute(
    <ProtectedRoute
      check={{ action: InvitationAction.Read, subject: invitationByOrganizationId('any') }}
    >
      Protected Content
    </ProtectedRoute>,
  );

  expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  expect(screen.getByText('Page Not Found')).toBeInTheDocument();
});

it('render target component if check pass', () => {
  const org = organizationFixtures.demoOrganization();

  useAuthContext.mockReturnValue({ user: userProfileFixtures.defaultReferralCoordinatorProfile() });

  renderRoute(
    <ProtectedRoute
      check={{ action: InvitationAction.Read, subject: invitationByOrganizationId(org.id) }}
    >
      Protected Content
    </ProtectedRoute>,
  );

  expect(screen.getByText('Protected Content')).toBeInTheDocument();
});
