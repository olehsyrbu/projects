import { Toolbar, ToolbarButton } from '../index';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('should render toolbar without children', () => {
  render(<Toolbar aria-label="Options" />);
  expect(screen.getByLabelText('Options')).toBeInTheDocument();
});

it('should render toolbar and children', () => {
  render(
    <Toolbar aria-label="Options" value={['option-1', 'option-2']}>
      <ToolbarButton value="option-1">Option 1</ToolbarButton>
      <ToolbarButton value="option-2">Option 2</ToolbarButton>
      <ToolbarButton value="option-3">Option 3</ToolbarButton>
    </Toolbar>,
  );
  expect(screen.getAllByRole('button').length).toBe(3);
});

it('toolbar, check onChange handler', async () => {
  const handleChange = vi.fn();
  render(
    <Toolbar aria-label="Options" value={['option-1']} onChange={handleChange}>
      <ToolbarButton value="option-1">Option 1</ToolbarButton>
      <ToolbarButton value="option-2">Option 2</ToolbarButton>
    </Toolbar>,
  );
  let button = screen.getByRole('button', { name: /Option 2/i });
  await userEvent.click(button);

  await waitFor(() => {
    expect(handleChange).toHaveBeenLastCalledWith(['option-1', 'option-2']);
  });

  await userEvent.click(button);
  await waitFor(() => {
    expect(handleChange).toHaveBeenLastCalledWith(['option-1']);
  });
});

it('toolbar, check keyboard', async () => {
  const handleChange = vi.fn();
  render(
    <Toolbar aria-label="Options" value={[]} onChange={handleChange}>
      <ToolbarButton value="option-1">Option 1</ToolbarButton>
      <ToolbarButton value="option-2">Option 2</ToolbarButton>
    </Toolbar>,
  );
  await userEvent.tab();
  await userEvent.keyboard('[Enter]');
  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenLastCalledWith(['option-1']);

  await userEvent.tab();
  await userEvent.keyboard('[Enter]');
  expect(handleChange).toHaveBeenCalledTimes(2);
  expect(handleChange).toHaveBeenLastCalledWith(['option-1', 'option-2']);

  await userEvent.keyboard('[Enter]');
  expect(handleChange).toHaveBeenCalledTimes(3);
  expect(handleChange).toHaveBeenLastCalledWith(['option-1']);
});
