import { ProgramCount } from './ProgramCount';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useController, useForm } from 'react-hook-form';

function ProgramCountForm({ defaultValue }) {
  const { control } = useForm();
  const { field } = useController({
    control,
    name: `programTypes.123`,
    defaultValue: defaultValue || 0,
  });

  return (
    <ProgramCount
      label="program type"
      value={field.value || 0}
      onChange={(value) => field.onChange(value)}
    />
  );
}

describe('Program count check', () => {
  it('component renders with buttons and correct name', async () => {
    render(<ProgramCountForm />);
    const decrement = screen.getByRole('button', { name: 'decrement' });

    expect(decrement).toBeInTheDocument();
    expect(decrement).toBeDisabled();
    expect(screen.getByRole('button', { name: 'increment' })).toBeInTheDocument();
    expect(screen.getByTestId('counter')).toHaveTextContent(0);
    expect(screen.getByText('program type')).toBeInTheDocument();
  });

  it('should increase count when plus button is clicked', async () => {
    render(<ProgramCountForm />);
    await userEvent.click(screen.getByRole('button', { name: 'increment' }));
    expect(screen.getByTestId('counter')).toHaveTextContent(1);
  });

  it('should decrease count when minus button is clicked', async () => {
    render(<ProgramCountForm defaultValue={2} />);
    await userEvent.click(screen.getByRole('button', { name: 'decrement' }));
    expect(screen.getByTestId('counter')).toHaveTextContent(1);
  });

  it('should not decrease to less than 0', async () => {
    render(<ProgramCountForm defaultValue={2} />);
    await userEvent.click(screen.getByRole('button', { name: 'decrement' }));
    await userEvent.click(screen.getByRole('button', { name: 'decrement' }));
    await userEvent.click(screen.getByRole('button', { name: 'decrement' }));

    expect(screen.getByTestId('counter')).toHaveTextContent(0);
  });
});
