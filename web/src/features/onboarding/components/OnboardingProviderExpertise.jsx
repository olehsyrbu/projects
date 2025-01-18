import { array, object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import mixpanel from '@/core/mixpanel';
import { useReferenceData } from '@/modules/reference-data';
import { Info24Filled as Info } from '@fluentui/react-icons';

import { usePersonOnBoarding } from '../hooks';
import { getOboadringText } from '../utils';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { ReferenceDataSelect as ReferenceDataSelectController, Switch } from '@/modules/form';
import { TooltipIcon } from '@/core/components/Tooltip/TooltipIcon';

const schema = object({
  providerTypes: array().min(1, 'This field is required').required('This field is required'),
  therapeuticAreas: array().min(1, 'This field is required').required('This field is required'),
  ageGroups: array().min(1, 'This field is required').required('This field is required'),
});

export function OnboardingProviderExpertise() {
  let survey = useSurvey();
  const { provider, updateProvider, role } = usePersonOnBoarding();
  const texts = getOboadringText({ role, step: survey.step });

  let {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitted, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    shouldFocusError: false,
    defaultValues: {
      treatsSuicidalIdeation: provider?.treatsSuicidalIdeation,
      providerTypes: provider?.providerTypes,
      therapeuticAreas: provider?.therapeuticAreas,
      ageGroups: provider?.ageGroups,
      canPrescribeMedication: provider?.canPrescribeMedication,
    },
  });

  async function submit(data) {
    if (isDirty) {
      updateProvider(data);
      mixpanel.track('Step 3 submitted');
    }
    survey.navigateNext();
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1 className="font-sans !text-2xl font-bold">{texts.title}</h1>
      <div className="mb-8 box-border flex items-center space-x-4 rounded-lg bg-white p-4 shadow-lg md:max-w-[800px]">
        <Info className="text-p-75" />
        <p className="flex-1 leading-6">{texts.subTitle}</p>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <div className="space-y-6 divide-x-0 divide-y divide-solid divide-graphics-30">
          <div className="space-y-6">
            <article>
              <h3 className="mb-4 flex items-center gap-x-2 text-base font-bold">
                Types of provider
              </h3>
              <ReferenceDataSelect
                control={control}
                type="ProviderType"
                name="providerTypes"
                label="Select all that apply"
                data-testid="types-of-provider"
                isMulti
              />
            </article>
            <article>
              <h3 className="mb-4 flex items-center gap-x-2 text-base font-bold">
                {texts.textAreas}
                <TooltipIcon label={texts.textAreasHint} />
              </h3>
              <ReferenceDataSelect
                control={control}
                type="TherapeuticArea"
                name="therapeuticAreas"
                label="Select all that apply"
                data-testid="areas-of-expertise"
                isMulti
              />
            </article>
            <article>
              <h3 className="mb-4 flex items-center gap-x-2 text-base font-bold">
                {texts.textAge}
              </h3>
              <ReferenceDataSelect
                control={control}
                type="AgeGroup"
                name="ageGroups"
                label="Select all that apply"
                data-testid="age-groups-you-treat"
                sorted={false}
                sort={{ order: 'ASC' }}
                isMulti
              />
            </article>
          </div>
          <div>
            <Switch className="mt-6 font-bold" name="treatsSuicidalIdeation" control={control}>
              {texts.textSuicidal}
            </Switch>
            <Switch className="mt-6 font-bold" name="canPrescribeMedication" control={control}>
              {texts.textPrescribe}
            </Switch>
          </div>
        </div>
        <SurveyStepControls disabled={isSubmitted && !isValid} />
      </form>
    </article>
  );
}

function ReferenceDataSelect({ type, sort, ...props }) {
  let options = useReferenceData(type, { types: ['PERSON'] }, sort);
  return (
    <ReferenceDataSelectController
      className="max-w-md"
      {...props}
      options={options}
      isSearchable={false}
    />
  );
}

ReferenceDataSelect.propTypes = {
  type: PropTypes.string,
  sort: PropTypes.object,
};
