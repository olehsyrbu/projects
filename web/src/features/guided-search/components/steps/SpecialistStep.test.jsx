import { render, screen } from '@testing-library/react';
import { GuidedSearchContext } from '../../GuidedSearchContext';
import answersMapping from '../../answersMapping.json';
import { SpecialistStep } from './SpecialistStep';

vi.mock('@/modules/survey/hooks', () => ({
  useSurvey: () => ({}),
}));
vi.mock('@/modules/search/hooks', () => ({
  useProgramSearchFlag: () => true,
}));

function renderWithContext(children) {
  let state = [{}, () => {}];
  render(<GuidedSearchContext.Provider value={state}>{children}</GuidedSearchContext.Provider>);
}

it('renders all possible answers', () => {
  renderWithContext(<SpecialistStep />);

  let answers = Object.keys({ ...answersMapping['programTypes'], ...answersMapping['lookingFor'] });
  let inputs = screen.getAllByRole('checkbox');
  expect(inputs.length).toBe(answers.length);

  for (let answer of answers) {
    let input = inputs.find(
      (i) => ['programTypes', 'lookingFor'].includes(i.name) && i.value === answer,
    );
    expect(input).toBeDefined();
  }
});
