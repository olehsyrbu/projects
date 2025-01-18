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
  hadVisitedSpecialist: mixed().oneOf(['yes', 'no']),
});

export function PreviousVisitStep() {
  let survey = useSurvey();
  let [state, updateState] = useGuidedSearchState();

  let { register, handleSubmit, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(scheme),
    defaultValues: {
      hadVisitedSpecialist:
        state.hadVisitedSpecialist === true
          ? 'yes'
          : state.hadVisitedSpecialist === false
          ? 'no'
          : null,
    },
  });

  function submitStep(patch) {
    let hadVisitedSpecialist = patch.hadVisitedSpecialist === 'yes';
    updateState({ hadVisitedSpecialist });
    survey.navigate(hadVisitedSpecialist ? 1 : 2);
    mixpanel.track('Guided Search Previous Visit Step', {
      answer: hadVisitedSpecialist ? 'Yes' : 'No',
    });
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1>Have you seen a mental health professional for this before?</h1>
      <p>
        If you have received a diagnosis from a mental health professional, please let us know so we
        can match you accordingly.
      </p>
      <form onSubmit={handleSubmit(submitStep)}>
        <fieldset className="flex space-x-4">
          <ChipRadio
            className="md:min-w-[5rem]"
            {...register('hadVisitedSpecialist')}
            value="yes"
            label="Yes"
          />
          <ChipRadio
            className="md:min-w-[5rem]"
            {...register('hadVisitedSpecialist')}
            value="no"
            label="No"
          />
        </fieldset>
        <Controls disabled={!formState.isValid} />
      </form>
    </article>
  );
}
