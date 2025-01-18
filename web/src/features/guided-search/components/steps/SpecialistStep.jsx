import { useForm } from 'react-hook-form';
import mixpanel from '@/core/mixpanel';
import { object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSurvey } from '@/modules/survey/hooks';
import { useProgramSearchFlag } from '@/modules/search/hooks';
import { SurveyStepInfo } from '@/modules/survey/components';
import ChipCheckbox from '@/core/components/Chips/ChipCheckbox';
import { useGuidedSearchState } from '../../hooks';
import { Controls } from '../Controls';

let scheme = object().test('specialist', 'need to select at least one option', (_, context) => {
  const { programTypes, lookingFor } = context.options.originalValue;
  return lookingFor.length > 0 || programTypes.length > 0;
});

export function SpecialistStep() {
  let survey = useSurvey();
  let [state, updateState] = useGuidedSearchState();
  let hasProgramsEnabled = useProgramSearchFlag();

  let { register, handleSubmit, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(scheme),
    defaultValues: { lookingFor: state.lookingFor, programTypes: state.programTypes },
  });

  function submitStep(patch) {
    updateState(patch);
    survey.navigateNext();
    mixpanel.track('Guided Search Specialist Step');
  }

  function handleBack() {
    survey.navigate(state.hadSuicidalThoughts ? -1 : -2);
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1>What are you looking for?</h1>
      <p>
        This will help us understand if you are looking for a specific mental healthcare resource or
        if you want to see different options.
      </p>
      <form onSubmit={handleSubmit(submitStep)}>
        <fieldset>
          <legend className="!mb-6">Select all that apply</legend>

          <div className="flex flex-wrap gap-4">
            <ChipCheckbox
              {...register('lookingFor')}
              value="someoneToTalk"
              label="Someone I can talk to"
            />
            <ChipCheckbox {...register('lookingFor')} value="diagnosis" label="A diagnosis" />
            <ChipCheckbox
              {...register('lookingFor')}
              value="medicationPrescription"
              label="Someone who can prescribe me medication"
            />

            {hasProgramsEnabled && (
              <>
                <ChipCheckbox
                  {...register('programTypes')}
                  value="inpatientTreatment"
                  label="Inpatient treatment"
                />
                <ChipCheckbox
                  {...register('programTypes')}
                  value="crisisServices"
                  label="Crisis services"
                />
                <ChipCheckbox
                  {...register('programTypes')}
                  value="residentialProgram"
                  label="A residential program"
                />
                <ChipCheckbox
                  {...register('programTypes')}
                  value="outpatientProgram"
                  label="An outpatient program (where I live at home)"
                />
              </>
            )}

            <ChipCheckbox {...register('lookingFor')} value="notSure" label="I am not sure" />
          </div>
        </fieldset>
        <Controls handleBack={handleBack} disabled={!formState.isValid} />
      </form>
    </article>
  );
}
