import { fireEvent, screen } from '@testing-library/react';
import { renderWithReactHookForm } from '@/tools/app-test-utils/renderWithReactHookForm';
import { defineMatchMediaGlobally } from '@/tools/app-test-utils/matchMediaMock';
import { LocationField } from './LocationField';

const setup = () => {
  defineMatchMediaGlobally(true);
  const utils = renderWithReactHookForm(
    <LocationField defaultValue="" placeholder="Label placeholder" label="Label placeholder" />,
    { location: '' },
  );
  const input = screen.getByTestId('address');
  return {
    input,
    ...utils,
  };
};

it('Location field with default props', async () => {
  setup();
  expect(screen.getByText('Label placeholder')).toBeInTheDocument();
});

it('Location field with set in input value', async () => {
  const { input } = setup();
  expect(screen.getByText('Label placeholder')).toBeInTheDocument();

  fireEvent.change(input, { target: { value: '123' } });
  expect(input.value).toBe('123');
});
