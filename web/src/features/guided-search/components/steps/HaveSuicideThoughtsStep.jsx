import { useState } from 'react';
import { useForm } from 'react-hook-form';
import mixpanel from '@/core/mixpanel';
import { mixed, object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepInfo } from '@/modules/survey/components';
import ChipRadio from '@/core/components/Chips/ChipRadio';
import { useGuidedSearchState } from '../../hooks';
import { Controls } from '../Controls';
import { EmergencyStep } from './EmergencyStep';

let scheme = object({
  haveSuicidalThoughts: mixed().oneOf(['yes', 'no']),
});

export function HaveSuicideThoughtsStep() {
  let survey = useSurvey();
  let [state, updateState] = useGuidedSearchState();
  let [showEmergency, setShowEmergency] = useState(false);

  let { register, handleSubmit, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(scheme),
    defaultValues: {
      haveSuicidalThoughts:
        state.haveSuicidalThoughts === true
          ? 'yes'
          : state.haveSuicidalThoughts === false
          ? 'no'
          : null,
    },
  });

  function submitStep(patch) {
    let value = patch.haveSuicidalThoughts === 'yes';

    updateState({ haveSuicidalThoughts: value });

    if (state.hadSuicidalThoughts && value) {
      setShowEmergency(true);
    } else {
      survey.navigateNext();
    }

    mixpanel.track('Guided Search Have Suicide Thoughts Step');
  }

  if (showEmergency) {
    return <EmergencyStep />;
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1>Are you currently experiencing suicidal thoughts?</h1>
      <p>
        If you are currently experiencing suicidal thoughts, we can help connect you to immediate
        care.
      </p>
      <form onSubmit={handleSubmit(submitStep)}>
        <fieldset className="flex space-x-4">
          <ChipRadio
            className="md:min-w-[5rem]"
            {...register('haveSuicidalThoughts')}
            value="yes"
            label="Yes"
          />
          <ChipRadio
            className="md:min-w-[5rem]"
            {...register('haveSuicidalThoughts')}
            value="no"
            label="No"
          />
        </fieldset>
        <Controls disabled={!formState.isValid} />
      </form>
    </article>
  );
}
