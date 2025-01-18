import { render, screen } from '@/tools/app-test-utils';
import { MindloggerAccount } from './MindloggerAccount';

let mockUseMindloggerAccount = vi.fn().mockResolvedValue();

vi.mock('@/modules/mindlogger/hooks', () => ({
  useMindloggerAccount: (args) => {
    return mockUseMindloggerAccount(args);
  },
}));

beforeEach(() => {
  vi.resetAllMocks();
});

it('renders children if data ok', async () => {
  mockUseMindloggerAccount.mockReturnValue({ data: {} });

  await render(<MindloggerAccount>Done</MindloggerAccount>);

  expect(screen.getByText('Done')).toBeInTheDocument();
});

it("renders fallback if auth wasn't succeed", async () => {
  mockUseMindloggerAccount.mockReturnValue({ error: new Error('boom!') });

  await render(<MindloggerAccount fallback={<div>Failed</div>}>Done</MindloggerAccount>);

  expect(screen.getByText('Failed')).toBeInTheDocument();
});
