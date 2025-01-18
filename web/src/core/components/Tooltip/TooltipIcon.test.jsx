import { render, screen } from '@testing-library/react';
import { TooltipIcon } from './TooltipIcon';

it('should render TooltipLabel component', () => {
  render(<TooltipIcon id="tooltip" label="Tooltip" />);
  expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
});
