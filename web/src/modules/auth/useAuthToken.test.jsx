import { render, screen } from '@testing-library/react';
import { useAuthToken } from './useAuthToken';
import userEvent from '@testing-library/user-event';

const storageKey = 'authToken';

const mockValidToken = vi.fn().mockReturnValue('');

vi.mock('@/modules/auth/AuthUtils', () => ({
  AuthUtils: {
    validate: (origin) => mockValidToken(origin),
  },
}));

const mockApiSetAuth = vi.fn();
const mockApiRemoveAuth = vi.fn();

vi.mock('@/core/api/graphQLClient', () => ({
  default: {
    setAuth: (token) => mockApiSetAuth(token),
    removeAuth: () => mockApiRemoveAuth(),
  },
}));

afterEach(() => {
  localStorage.clear();
  mockApiSetAuth.mockRestore();
  mockValidToken.mockRestore();
  mockApiRemoveAuth.mockRestore();
});

function renderAuth({ nextToken } = {}) {
  function Auth() {
    let [token, save, reset] = useAuthToken(storageKey);

    if (!token) {
      return (
        <div>
          <p>Empty</p>
          <button onClick={() => save(nextToken)}>Save</button>
        </div>
      );
    }

    return (
      <div>
        <p>{token}</p>
        <button onClick={reset}>Reset</button>
      </div>
    );
  }

  render(<Auth />);
}

describe('on init token', () => {
  it('finds no token', () => {
    renderAuth();

    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('finds valid token in local storage', () => {
    let token = 'foo';
    mockValidToken.mockReturnValue(token);
    localStorage.setItem(storageKey, token);

    renderAuth();

    screen.getByText(token);

    expect(mockApiSetAuth).toHaveBeenCalledTimes(1);
    expect(mockApiSetAuth).toHaveBeenCalledWith(token);
  });

  it('resets storage and api client, if token in store but not valid', () => {
    let token = 'foo';
    localStorage.setItem(storageKey, token);

    renderAuth();

    expect(mockApiSetAuth).not.toHaveBeenCalled();
    expect(mockApiRemoveAuth).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(storageKey)).toBeNull();
  });
});

describe('on edit token', () => {
  it('save token in store and api client', async () => {
    let token = 'foo';

    renderAuth({ nextToken: token });

    screen.getByText('Empty');

    mockValidToken.mockReturnValue(token);

    const save = screen.getByRole('button', { name: 'Save' });
    await userEvent.click(save);

    screen.getByText(token);

    expect(localStorage.getItem(storageKey)).toBe(token);
    expect(mockApiSetAuth).toHaveBeenCalledTimes(1);
    expect(mockApiSetAuth).toHaveBeenCalledWith(token);
  });

  it('resets token in store and api client', async () => {
    let token = 'foo';
    mockValidToken.mockReturnValue(token);
    localStorage.setItem(storageKey, token);

    renderAuth();

    screen.getByText(token);

    const reset = screen.getByRole('button', { name: 'Reset' });
    await userEvent.click(reset);

    screen.getByText('Empty');

    expect(localStorage.getItem(storageKey)).toBeNull();
    expect(mockApiRemoveAuth).toHaveBeenCalledTimes(1);
  });
});
