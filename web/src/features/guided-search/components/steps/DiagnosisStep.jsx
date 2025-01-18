import { useForm } from 'react-hook-form';
import mixpanel from '@/core/mixpanel';
import { array, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepInfo } from '@/modules/survey/components';
import ChipCheckbox from '@/core/components/Chips/ChipCheckbox';
import { TherapeuticAreasSelect } from '../TherapeuticAreasSelect';
import { Controls } from '../Controls';
import { useGuidedSearchState } from '../../hooks';

let scheme = object({
  previousDiagnosis: array().of(string()).min(1),
  otherDiagnoses: array().of(string()),
});

export function DiagnosisStep() {
  let survey = useSurvey();
  let [state, updateState] = useGuidedSearchState();

  let { register, handleSubmit, formState, watch, setValue } = useForm({
    mode: 'onChange',
    resolver: yupResolver(scheme),
    defaultValues: {
      previousDiagnosis: state.previousDiagnosis,
      otherDiagnoses: state.otherDiagnoses,
    },
  });

  let isOtherSelected = watch('previousDiagnosis').includes('other');
  let otherDiagnoses = watch('otherDiagnoses');

  function submitStep(patch) {
    updateState(patch);
    survey.navigateNext();
    mixpanel.track('Guided Search Previous Diagnosis Step');
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1>Did they have a name for it?</h1>
      <p>
        A diagnosis can help us narrow down the best treatment options. However, not everyone who
        seeks therapy needs or has a diagnosis.
      </p>
      <form onSubmit={handleSubmit(submitStep)}>
        <fieldset>
          <legend className="!mb-6">Select all that apply</legend>

          <div className="flex flex-wrap gap-4">
            <ChipCheckbox {...register('previousDiagnosis')} value="anxiety" label="Anxiety" />
            <ChipCheckbox
              {...register('previousDiagnosis')}
              value="depression"
              label="Depression"
            />
            <ChipCheckbox {...register('previousDiagnosis')} value="ptsd" label="PTSD" />
            <ChipCheckbox
              {...register('previousDiagnosis')}
              value="eatingDisorder"
              label="Eating Disorder"
            />
            <ChipCheckbox {...register('previousDiagnosis')} value="adhd" label="ADHD" />
            <ChipCheckbox
              {...register('previousDiagnosis')}
              value="substanceUse"
              label="Substance Use"
            />
            <ChipCheckbox {...register('previousDiagnosis')} value="selfHarm" label="Self-harm" />
            <ChipCheckbox {...register('previousDiagnosis')} value="bipolar" label="Bipolar" />
            <ChipCheckbox {...register('previousDiagnosis')} value="ocd" label="OCD" />
            <ChipCheckbox {...register('previousDiagnosis')} value="autism" label="Autism" />
            <ChipCheckbox {...register('previousDiagnosis')} value="insomnia" label="Insomnia" />
            <ChipCheckbox
              {...register('previousDiagnosis')}
              value="dontKnow"
              label="I don’t know"
            />
            <ChipCheckbox {...register('previousDiagnosis')} value="other" label="Other" />
          </div>
        </fieldset>
        {isOtherSelected && (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <fieldset
            className="mt-6"
            onKeyDown={(event) => {
              if (event.code === 'Enter') {
                // `react-select` doesn't prevent form submission in some cases
                event.preventDefault();
                // Prevent enter key event bubbling up to SurveyStepControls
                event.stopPropagation();
              }
            }}
          >
            <TherapeuticAreasSelect
              value={otherDiagnoses}
              onChange={(values) => setValue('otherDiagnoses', values)}
            />
          </fieldset>
        )}
        <Controls disabled={!formState.isValid} />
      </form>
    </article>
  );
}
