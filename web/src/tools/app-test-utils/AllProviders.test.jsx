import { render, screen } from './index';
import { organizationFixtures, userProfileFixtures } from '@/tools/test-fixtures';
import { mockFlags, resetLDMocks } from 'vitest-launchdarkly-mock';
import { useFlags } from 'launchdarkly-react-client-sdk';

beforeEach(() => {
  resetLDMocks();
});

function TestComponent() {
  const { devTestFlag } = useFlags();
  return devTestFlag ? 'on' : 'off';
}

it('renders children and data', async () => {
  await render(<span>Test</span>, {
    enableAllWrappers: true,
    user: userProfileFixtures.defaultReferralCoordinatorProfile(),
    organization: organizationFixtures.demoOrganization(),
  });

  expect(screen.getByText('Test')).toBeInTheDocument();
});

it('renders children by default', async () => {
  await render(<span>Test</span>, {
    enableAllWrappers: true,
  });

  expect(screen.getByText('Test')).toBeInTheDocument();
});

it('renders with feature turned off', async () => {
  mockFlags({ devTestFlag: false });

  await render(<TestComponent />, { enableAllWrappers: true });

  expect(screen.getByText('off')).toBeInTheDocument();
});

it('renders with feature turned on', async () => {
  mockFlags({ devTestFlag: true });

  await render(<TestComponent />, { enableAllWrappers: true });

  expect(screen.getByText('on')).toBeInTheDocument();
});
