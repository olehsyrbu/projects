import { render, fireEvent, screen } from '@testing-library/react';
import { DatePicker } from './DatePicker';

function setupDatePicker(handleChange) {
  render(<DatePicker label="test" onChange={handleChange} />);
}

it('should update the value correctly when typing in the input', () => {
  const handleChange = vi.fn();
  setupDatePicker(handleChange);

  const input = screen.getByLabelText('test');
  fireEvent.change(input, { target: { value: '02/20/2023' } });

  expect(input.value).toBe('02/20/2023');
  expect(handleChange).toHaveBeenCalledWith('2023-02-20');
});

it('should add slashes when typing in the input', () => {
  const handleChange = vi.fn();
  setupDatePicker(handleChange);

  const input = screen.getByLabelText('test');
  fireEvent.change(input, { target: { value: '02202023' } });

  expect(input.value).toBe('02/20/2023');
  expect(handleChange).toHaveBeenCalledWith('2023-02-20');
});

it('should not allow invalid characters when typing in the input', () => {
  const handleChange = vi.fn();
  setupDatePicker(handleChange);

  const input = screen.getByLabelText('test');

  fireEvent.change(input, { target: { value: 'invalid' } });
  expect(input.value).toBe('');
  expect(handleChange).not.toHaveBeenCalled();
});
