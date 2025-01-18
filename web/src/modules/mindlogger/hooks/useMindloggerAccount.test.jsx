import { Suspense } from 'react';
import { useMindloggerAccount } from './useMindloggerAccount';
import { SWRConfig } from 'swr';
import { render, screen, nextTick } from '@/tools/app-test-utils';
import { accountFixtures } from '../api/fixtures';
import { mutate } from 'swr';

let mockAuthenticate = vi.fn().mockResolvedValue();
let mockCredentials = vi.fn().mockReturnValue(undefined);

vi.mock('@/modules/mindlogger/api', () => ({
  default: {
    Client: {
      authenticate: (args) => mockAuthenticate(args),
      get credentials() {
        return mockCredentials();
      },
    },
  },
}));

beforeEach(() => {
  mutate(() => true, undefined, false);
  vi.resetAllMocks();
});

async function setupAccount() {
  function Page() {
    const { data } = useMindloggerAccount();

    if (!data) {
      return <div>Loading...</div>;
    }

    return <div>{data.account.accountName}</div>;
  }

  const provider = () => new Map();

  return render(
    <SWRConfig value={{ dedupingInterval: 0, provider }}>
      <Suspense fallback="Zzzz">
        <Page />
      </Suspense>
    </SWRConfig>,
  );
}

it('tries to auth if credentials are provided', async () => {
  const payload = accountFixtures.defaultAuthResponse();
  mockCredentials.mockReturnValue('some-creds');
  mockAuthenticate.mockResolvedValue(payload);

  await setupAccount();

  await nextTick();

  const name = await screen.findByText(payload.account.accountName);

  expect(name).toBeInTheDocument();
  expect(mockAuthenticate).toHaveBeenCalled();
});

it('skips auth call if credentials are not set', async () => {
  mockCredentials.mockReturnValue(undefined);

  await setupAccount();

  await nextTick();

  expect(mockAuthenticate).not.toHaveBeenCalled();
});
