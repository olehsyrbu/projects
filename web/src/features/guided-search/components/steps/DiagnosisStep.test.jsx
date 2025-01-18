import { render, screen } from '@testing-library/react';
import { GuidedSearchContext } from '../../GuidedSearchContext';
import answersMapping from '../../answersMapping.json';
import { DiagnosisStep } from './DiagnosisStep';

vi.mock('@/modules/survey/hooks', () => ({
  useSurvey: () => ({}),
}));

function renderWithContext(children) {
  let state = [{ previousDiagnosis: [] }, () => {}];
  render(<GuidedSearchContext.Provider value={state}>{children}</GuidedSearchContext.Provider>);
}

it('renders all possible answers', () => {
  renderWithContext(<DiagnosisStep />);

  let answers = Object.keys(answersMapping['previousDiagnosis']);
  let inputs = screen.getAllByRole('checkbox');

  expect(inputs.length).toBe(answers.length);

  for (let answer of answers) {
    let input = inputs.find((i) => i.name === 'previousDiagnosis' && i.value === answer);
    expect(input).toBeDefined();
  }
});
