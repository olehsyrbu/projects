import AuthUser, { useAuthContext } from './AuthUser';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { userProfileFixtures } from '@/tools/test-fixtures';

let mockUser = vi.fn();
let mockToken = vi.fn();

vi.mock('@/core/api/UserQueries', () => ({
  useUser: (token) => ({
    data: mockUser(token),
  }),
  useRegisterUser: () => {},
  useLoginUser: () => {},
  useLogoutUser: () => {},
  useUpdateUser: () => {},
  useDeleteUser: () => {},
}));

vi.mock('@/modules/auth/useAuthToken', () => ({
  useAuthToken: () => [mockToken(), () => {}, () => {}],
}));

function renderWithAuth(children) {
  render(
    <MemoryRouter>
      <Suspense fallback="Loading...">
        <AuthUser>{children}</AuthUser>
      </Suspense>
    </MemoryRouter>,
  );
}

it('renders children', async () => {
  mockToken.mockReturnValue('');
  mockUser.mockReturnValue(undefined);
  renderWithAuth('Test');

  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});

it('provides user in a context', async () => {
  mockToken.mockReturnValue('test');
  let expected = userProfileFixtures.defaultReferralCoordinatorProfile();
  mockUser.mockReturnValue(expected);
  let userId = null;

  function Child() {
    let { user } = useAuthContext();
    userId = user.id;
    return null;
  }

  renderWithAuth(<Child />);

  expect(userId).toEqual(expected.id);
});
