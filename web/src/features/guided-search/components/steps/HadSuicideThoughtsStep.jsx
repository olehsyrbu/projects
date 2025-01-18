import { useForm } from 'react-hook-form';
import mixpanel from '@/core/mixpanel';
import { object, mixed } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepInfo } from '@/modules/survey/components';
import ChipRadio from '@/core/components/Chips/ChipRadio';
import { useGuidedSearchState } from '../../hooks';
import { Controls } from '../Controls';

let scheme = object({
  hadSuicidalThoughts: mixed().oneOf(['yes', 'no']),
});

export function HadSuicideThoughtsStep() {
  let survey = useSurvey();
  let [state, updateState] = useGuidedSearchState();

  let { register, handleSubmit, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(scheme),
    defaultValues: {
      hadSuicidalThoughts:
        state.hadSuicidalThoughts === true
          ? 'yes'
          : state.hadSuicidalThoughts === false
          ? 'no'
          : null,
    },
  });

  function submitStep(patch) {
    let hadSuicidalThoughts = patch.hadSuicidalThoughts === 'yes';
    updateState({ hadSuicidalThoughts });
    survey.navigate(hadSuicidalThoughts ? 1 : 2);
    mixpanel.track('Guided Search Had Suicide Thoughts Step', {
      answer: hadSuicidalThoughts ? 'Yes' : 'No',
    });
  }

  function handleBack() {
    survey.navigate(state.hadVisitedSpecialist ? -1 : -2);
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1>Have you ever had thoughts of taking your own life?</h1>
      <p>
        We want to help you get to the care you are seeking. First, we want to make sure that you
        are safe and connect you to immediate resources, if needed.
      </p>
      <form onSubmit={handleSubmit(submitStep)}>
        <fieldset className="flex space-x-4">
          <ChipRadio
            className="md:min-w-[5rem]"
            {...register('hadSuicidalThoughts')}
            value="yes"
            label="Yes"
          />
          <ChipRadio
            className="md:min-w-[5rem]"
            {...register('hadSuicidalThoughts')}
            value="no"
            label="No"
          />
        </fieldset>
        <Controls handleBack={handleBack} disabled={!formState.isValid} />
      </form>
    </article>
  );
}
