import { Select } from './Select';
import { render, screen } from '@/tools/app-test-utils';
import userEvent from '@testing-library/user-event';
import { defineMatchMediaGlobally } from '@/tools/app-test-utils/matchMediaMock';

const options = [
  { value: '1', label: 'Academy of Certified Social Workers License (ACSW)' },
  { value: '2', label: 'Board Certified Behavior Analyst (BCBA)' },
  { value: '3', label: 'Certified Addiction Counselor (CAC)' },
];

function setupSelect({ ...rest }) {
  render(<Select {...rest} />);
}

it('filters by provided message', async () => {
  defineMatchMediaGlobally(false);
  setupSelect({ options, label: 'Modalities' });

  const placeholder = screen.getByText('Modalities');

  await userEvent.click(placeholder);
  await userEvent.paste('Academy of Certified Social Workers License (ACSW)');

  expect(
    screen.getByText('Academy of Certified Social Workers License (ACSW)'),
  ).toBeInTheDocument();
});

it('selects element by click', async () => {
  defineMatchMediaGlobally(true);
  setupSelect({ options, label: 'Modalities', value: {}, isMulti: true });

  const placeholder = screen.getByText(/Modalities/i);

  await userEvent.click(placeholder);
  await userEvent.type(placeholder, 'Aca');

  const item = screen.queryByText('Academy of Certified Social Workers License (ACSW)');

  await userEvent.click(item);
  expect(screen.getByTestId('chip-basic')).toBeInTheDocument();
});
