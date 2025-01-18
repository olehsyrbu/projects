import { Suspense } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { logger } from '@/core/logger';
import mixpanel from '@/core/mixpanel';
import { usePersonOnBoarding } from '@/features/onboarding/hooks';
import { getOboadringText } from '@/features/onboarding/utils';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import {
  LicenseFieldSet,
  OtherLicenseReasons,
  PersonalCredentialFieldSet,
  PsyPactFieldSet,
} from '@/modules/program';
import { first } from 'lodash-es';
import { Info24Filled as Info } from '@fluentui/react-icons';
import { Checkbox, Switch, Warning } from '@/modules/form';
import { TooltipPsypact } from '@/modules/provider';
import { object } from 'yup';

const schema = object({
  credential: PersonalCredentialFieldSet.schema(),
});

export function OnboardingProviderLicense() {
  let survey = useSurvey();
  const { provider, updateProvider, role } = usePersonOnBoarding();
  const texts = getOboadringText({ role, step: survey.step });
  const isRemote = provider.remote?.available && !provider.inPerson?.available;
  const defaultState =
    !isRemote && !provider.licenses?.length && first(provider.locations)?.address?.state;

  let {
    handleSubmit,
    formState: { isDirty, isSubmitting, isSubmitted, isValid },
    control,
  } = useForm({
    defaultValues: {
      credential: PersonalCredentialFieldSet.toFormValue({ provider, state: defaultState }),
    },
    resolver: yupResolver(schema),
  });

  async function submit({ credential }) {
    try {
      if (isDirty) {
        await updateProvider(PersonalCredentialFieldSet.toValueApi(credential));
        mixpanel.track('Step 6 submitted');
      }

      survey.navigateNext();
    } catch (error) {
      logger.error(error);
    }
  }

  let isLicenseChecked = useWatch({
    name: `credential.isLicenseChecked`,
    control,
  });
  let isUnderSupervision = useWatch({
    name: `credential.isUnderSupervision`,
    control,
  });

  let isPsyPact = useWatch({
    name: `credential.isPsyPact`,
    control,
  });

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1>{texts.title}</h1>
      <div className="mb-8 box-border flex max-w-max items-center space-x-4 rounded-lg bg-white p-4 shadow-lg">
        <Info className="text-p-75" />
        <p className="flex-1">{texts.subTitle}</p>
      </div>
      <form className="space-y-10" onSubmit={handleSubmit(submit)}>
        <Warning
          message={`credential.status.message`}
          className="mt-4 px-4 py-2"
          control={control}
        />
        <div className="divide-x-0 divide-y divide-solid divide-graphics-30">
          <div className="space-y-6 py-4">
            <Checkbox
              className="items-center [&>svg]:mt-0"
              name={`credential.isLicenseChecked`}
              control={control}
            >
              <span className="font-bold">License</span>
            </Checkbox>
            {isLicenseChecked && (
              <Suspense fallback="Loading license...">
                <LicenseFieldSet
                  name={`credential.licenses`}
                  control={control}
                  isStateDisabled={defaultState}
                />
              </Suspense>
            )}
          </div>
          {isLicenseChecked && (
            <div className="space-y-6 py-6">
              <div className="flex items-center space-x-2">
                <Switch
                  name="credential.isPsyPact"
                  className="!inline-flex font-bold"
                  control={control}
                >
                  PsyPact License
                </Switch>
                <TooltipPsypact />
              </div>
              {isPsyPact && <PsyPactFieldSet name="credential.PsyPact" control={control} />}
            </div>
          )}

          <div>
            <Checkbox
              className="items-center py-4 [&>svg]:mt-0"
              name={`credential.isUnderSupervision`}
              control={control}
            >
              <span className="font-bold">{texts.textSuperLicense}</span>
            </Checkbox>
            {isUnderSupervision && (
              <Suspense fallback="Loading license...">
                <LicenseFieldSet
                  hideAddMoreLicense
                  name={`credential.supervisorLicense`}
                  control={control}
                />
              </Suspense>
            )}
          </div>
          {!isLicenseChecked && !isUnderSupervision && (
            <div className="pt-6">
              <legend className="!mb-6 font-bold">{texts.textNoLicense}</legend>
              <OtherLicenseReasons mode="PERSON" name={`credential.noLicense`} control={control} />
            </div>
          )}
        </div>
        <SurveyStepControls
          disabled={isSubmitted && !isValid}
          onNext={handleSubmit(submit)}
          loading={isSubmitting}
        />
      </form>
    </article>
  );
}
