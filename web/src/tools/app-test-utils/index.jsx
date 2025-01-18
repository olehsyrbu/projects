import { Suspense, useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mutate, SWRConfig } from 'swr';
import { render, act } from '@testing-library/react';
import { AuthUser } from '@/modules/auth';
import { userProfileFixtures } from '@/tools/test-fixtures';

const mockValidToken = vi.fn().mockReturnValue('');

vi.mock('@/modules/auth/AuthUtils', () => ({
  AuthUtils: {
    validate: (origin) => mockValidToken(origin),
  },
}));

export const customRender = (ui, options) => {
  /* eslint-disable react/prop-types */
  function AllProviders({
    children,
    user = userProfileFixtures.defaultReferralCoordinatorProfile(),
    initialRouterEntries,
  }) {
    return (
      <Suspense fallback="Loading...">
        <SWRConfig value={{ dedupingInterval: 0 }}>
          {user && <InitTestAccount account={user} />}

          <Suspense fallback="Loading...">
            <MemoryRouter initialEntries={initialRouterEntries}>
              <AuthUser>{children}</AuthUser>
            </MemoryRouter>
          </Suspense>
        </SWRConfig>
      </Suspense>
    );
  }

  function InitTestAccount({ account }) {
    useEffect(() => {
      localStorage.setItem('authToken', 'foo');

      mockValidToken.mockReset().mockReturnValue('foo');
      mutate('user', account).catch((err) => console.error(err));
    });

    return null;
  }

  AllProviders.defaultProps = options;

  if (options && options.enableAllWrappers) {
    return render(ui, { wrapper: AllProviders, ...options });
  }

  return render(ui, { ...options });
};

export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export const nextTick = () => act(() => sleep(1));

export * from '@testing-library/react';
export { customRender as render };
