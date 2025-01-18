import { render, screen } from '@testing-library/react';
import { SurveyStep } from './SurveyStep';

it('renders element from props', () => {
  render(<SurveyStep element={<div data-testid="element" />} />);
  expect(screen.getByTestId('element')).toBeInTheDocument();
});
