import { useNavigate } from 'react-router-dom';
import mixpanel from '@/core/mixpanel';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SurveyStepInfo } from '@/modules/survey/components';
import { toAdvancedSearchParams } from '@/modules/search/utils';
import { useGuidedSearchState } from '../../hooks';
import { getSearchRecord } from '../../utils';
import { Controls } from '../Controls';
import { LocationField } from '@/modules/geocoding/components';

let scheme = object({
  location: string().required(),
});

export function LocationStep() {
  let navigate = useNavigate();
  let [state, updateState] = useGuidedSearchState();

  let form = useForm({
    mode: 'onChange',
    resolver: yupResolver(scheme),
    defaultValues: { location: state.location },
  });

  let { handleSubmit, formState } = form;

  function submitStep(patch) {
    updateState(patch);

    let record = getSearchRecord({ ...state, location: patch.location });
    let query = toAdvancedSearchParams({
      ...record,
      category: 'all',
      modes: ['PERSON', 'PROGRAM'],
    });

    navigate(`/search?${query}`);
    mixpanel.track('Guided Search Submit', { query: record });
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1>Where are you looking for care?</h1>
      <p className="!mb-3">
        Mental health care should be accessible. Knowing details about your location helps us show
        how close you are to each resource. Keep in mind, you can see anyone licensed in your state.
      </p>
      <p>It could take a few days before your first appointment.</p>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitStep)}>
          <div className="md:w-[25rem]">
            <LocationField
              defaultValue={state.location}
              errorMessage="This field is required"
              required
              label="Add your city, zip, or address"
              placeholder="Add your city, zip, or address"
            />
          </div>
          <Controls nextButtonLabel="See results" disabled={!formState.isValid} />
        </form>
      </FormProvider>
    </article>
  );
}
