import { render, screen } from '@testing-library/react';
import { GuidedSearchContext } from '../../GuidedSearchContext';
import answersMapping from '../../answersMapping.json';
import { ProblemStep } from './ProblemStep';

vi.mock('@/modules/survey/hooks', () => ({
  useSurvey: () => ({}),
}));

function renderWithContext(children) {
  let state = [{}, () => {}];
  render(<GuidedSearchContext.Provider value={state}>{children}</GuidedSearchContext.Provider>);
}

it('renders all possible answers', () => {
  renderWithContext(<ProblemStep />);

  let answers = Object.keys(answersMapping['problem']);
  let inputs = screen.getAllByRole('checkbox');

  expect(inputs.length).toBe(answers.length);

  for (let answer of answers) {
    let input = inputs.find((i) => i.name === 'problem' && i.value === answer);
    expect(input).toBeDefined();
  }
});
