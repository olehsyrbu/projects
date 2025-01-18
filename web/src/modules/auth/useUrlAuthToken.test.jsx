import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { useUrlAuthToken } from './useUrlAuthToken';

const queryKey = 'auth_token';

const mockValidToken = vi.fn().mockReturnValue('');

vi.mock('@/modules/auth/AuthUtils', () => ({
  AuthUtils: {
    validate: (origin) => mockValidToken(origin),
  },
}));

afterEach(() => {
  mockValidToken.mockRestore();
});

function renderAuth({ initialEntries } = {}) {
  function Auth() {
    let token = useUrlAuthToken(queryKey);

    if (!token) {
      return (
        <div>
          <p>Empty</p>
        </div>
      );
    }

    return (
      <div>
        <p>{token}</p>
      </div>
    );
  }

  render(
    <MemoryRouter initialEntries={initialEntries || ['/']}>
      <Auth />
    </MemoryRouter>,
  );
}

describe('on init token', () => {
  it('finds no token', () => {
    renderAuth();

    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('reads token from query parameter', () => {
    let token = 'foo';

    mockValidToken.mockReturnValue(token);

    renderAuth({ initialEntries: [`?${queryKey}=${token}`] });

    expect(mockValidToken).toHaveBeenCalledWith(token);
    screen.getByText(token);
  });

  it('resets token if not valid', () => {
    let token = 'foo';

    renderAuth({ initialEntries: [`?${queryKey}=${token}`] });

    expect(screen.getByText('Empty')).toBeInTheDocument();
  });
});
