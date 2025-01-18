import { useForm } from 'react-hook-form';
import mixpanel from '@/core/mixpanel';
import { array, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepInfo } from '@/modules/survey/components';
import ChipCheckbox from '@/core/components/Chips/ChipCheckbox';
import { useGuidedSearchState } from '../../hooks';
import { Controls } from '../Controls';

let scheme = object({
  problem: array().of(string()).min(1),
});

export function ProblemStep() {
  let survey = useSurvey();
  let [state, updateState] = useGuidedSearchState();

  let { register, handleSubmit, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(scheme),
    defaultValues: { problem: state.problem },
  });

  function submitStep(patch) {
    updateState(patch);
    survey.navigateNext();
    mixpanel.track('Guided Search Problem Step');
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1>What would you like help with today?</h1>
      <p>
        Reaching out for help is the first step in achieving your goals. Congratulations on starting
        your journey. Please let us know what we can help with today, so we can show you care that
        best matches your needs.
      </p>
      <form onSubmit={handleSubmit(submitStep)}>
        <fieldset>
          <legend>Select all that apply</legend>

          <div className="flex flex-wrap gap-4">
            <ChipCheckbox {...register('problem')} value="relationships" label="Relationships" />
            <ChipCheckbox {...register('problem')} value="griefOrLoss" label="Grief or Loss" />
            <ChipCheckbox {...register('problem')} value="stress" label="Stress" />
            <ChipCheckbox {...register('problem')} value="trauma" label="Trauma" />
            <ChipCheckbox
              {...register('problem')}
              value="sexualOrGenderIdentity"
              label="Sexual or Gender Identity"
            />
            <ChipCheckbox {...register('problem')} value="sleepConcerns" label="Sleep concerns" />
            <ChipCheckbox
              {...register('problem')}
              value="lovingAndAcceptingMyself"
              label="Loving and accepting myself"
            />
            <ChipCheckbox
              {...register('problem')}
              value="dontFeelLikeMyself"
              label="I just don't feel like myself"
            />
            <ChipCheckbox {...register('problem')} value="substanceUse" label="Substance Use" />
            <ChipCheckbox {...register('problem')} value="other" label="Something else" />
          </div>
        </fieldset>
        <Controls hasBackControl={false} disabled={!formState.isValid} />
      </form>
    </article>
  );
}
