import { Tooltip } from './Tooltip';
import { render, screen } from '@testing-library/react';

it('should render tooltip and children', () => {
  render(
    <Tooltip id="tooltip" content="Tooltip">
      <button />
    </Tooltip>,
  );

  expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
  expect(screen.getByRole('button')).toBeInTheDocument();
});
