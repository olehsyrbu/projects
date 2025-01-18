import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from './index';

it('should render correctly', () => {
  render(
    <Dialog isOpen>
      <DialogTitle>Dialog</DialogTitle>
      <DialogContent>Content</DialogContent>
      <DialogActions>
        <button>Ok</button>
        <button>Cancel</button>
      </DialogActions>
    </Dialog>,
  );

  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Dialog');
  expect(screen.getByTestId('dialog-content')).toHaveTextContent('Content');

  let buttons = screen.getAllByRole('button');

  expect(buttons[1]).toHaveTextContent('Ok');
  expect(buttons[2]).toHaveTextContent('Cancel');
});

it('should not render when not open', () => {
  let view = render(
    <Dialog isOpen={false}>
      <DialogTitle>Dialog</DialogTitle>
      <DialogContent>Content</DialogContent>
    </Dialog>,
  );

  expect(view.container).toBeEmptyDOMElement();
});

it('should set custom dialog width', () => {
  render(
    <Dialog isOpen width={300}>
      <DialogTitle>Dialog</DialogTitle>
      <DialogContent>Content</DialogContent>
    </Dialog>,
  );

  expect(screen.getByTestId('dialog')).toHaveStyle({ width: '300px' });
});

it('should call onDismiss on close button click', () => {
  let onDismiss = vi.fn();

  render(
    <Dialog isOpen onDismiss={onDismiss}>
      <DialogTitle>Dialog</DialogTitle>
      <DialogContent>Content</DialogContent>
    </Dialog>,
  );

  fireEvent.click(screen.getByRole('button'));

  expect(onDismiss).toHaveBeenCalledTimes(1);
});
