import { render, screen } from '@/tools/app-test-utils';
import { RecipientCard } from './RecipientCard';
import { DismissCircle20Filled as DismissCircle } from '@fluentui/react-icons';
import userEvent from '@testing-library/user-event';
import { MailBadge } from './MailBadge';

it('renders recipient and email', () => {
  render(<RecipientCard name="Joe Joe" email="joe@example.com" />);

  expect(screen.getByRole('heading', { level: 3, name: /Joe Joe/i })).toBeInTheDocument();
  expect(screen.getByText(/joe@example.com/i)).toBeInTheDocument();
});

it('renders with badge', () => {
  render(
    <RecipientCard
      name="Joe Joe"
      email="joe@example.com"
      badge={<MailBadge label="Mail not sent" />}
    />,
  );

  expect(screen.getByText(/Mail not sent/i)).toBeInTheDocument();
  expect(screen.getByTestId('joe@example.com')).toBeInTheDocument();
});

it('renders with actions', () => {
  render(
    <RecipientCard
      name="Joe Joe"
      email="joe@example.com"
      actions={
        <button className="mir-button text">
          <DismissCircle />
          <span>Remove</span>
        </button>
      }
    />,
  );

  expect(screen.getByText(/Remove/i)).toBeInTheDocument();
});

it('renders with listitem role by default', () => {
  render(<RecipientCard email="booo@email.com" name="Zzzz" />);
  expect(screen.getByRole('listitem')).toBeInTheDocument();
});

it('handles clicks', async () => {
  const handler = vi.fn();

  render(<RecipientCard name="Joe Joe" email="joe@example.com" onClick={handler} />);

  const item = screen.getByRole('listitem');

  await userEvent.click(item);

  expect(handler).toHaveBeenCalledTimes(1);
});
