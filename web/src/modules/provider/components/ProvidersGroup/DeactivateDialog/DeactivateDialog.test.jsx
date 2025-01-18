import { fireEvent, render, screen } from '@testing-library/react';
import { DeactivateDialog } from './DeactivateDialog';

it('should render correctly', () => {
  render(<DeactivateDialog open />);

  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Deactivate profile');
  expect(screen.getByTestId('dialog-content')).toHaveTextContent(
    'Deactivating your profile means it is removed from search results when prospective clients/patients search for a provider.',
  );

  let buttons = screen.getAllByRole('button');

  expect(buttons[1]).toHaveTextContent('Cancel');
  expect(buttons[2]).toHaveTextContent('Deactivate');
});

it('should not render when not open', () => {
  const { container } = render(<DeactivateDialog open={false} />);

  expect(container).toBeEmptyDOMElement();
});

it('should call actions on buttons click', () => {
  const doDeactivate = vi.fn();
  const doClose = vi.fn();

  render(<DeactivateDialog open onDeactivate={doDeactivate} onClose={doClose} />);

  const buttons = screen.getAllByRole('button');

  fireEvent.click(buttons[1]);
  expect(doClose).toHaveBeenCalledTimes(1);

  fireEvent.click(buttons[2]);
  expect(doDeactivate).toHaveBeenCalledTimes(1);
});
