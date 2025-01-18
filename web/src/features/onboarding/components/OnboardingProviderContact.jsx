import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Info24Filled as Info } from '@fluentui/react-icons';
import { logger } from '@/core/logger';
import mixpanel from '@/core/mixpanel';
import { usePersonOnBoarding } from '@/features/onboarding/hooks';
import { getOboadringText } from '@/features/onboarding/utils';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { ContactFieldSet } from '@/modules/program/components';

export function OnboardingProviderContact() {
  let survey = useSurvey();
  const { provider, updateProvider, role } = usePersonOnBoarding();
  const texts = getOboadringText({ role, step: survey.step });

  let {
    handleSubmit,
    formState: { isDirty, isValid, isSubmitted },
    control,
  } = useForm({
    defaultValues: ContactFieldSet.toFormValue(provider),
    resolver: yupResolver(ContactFieldSet.schema),
  });

  async function submit(contacts) {
    try {
      if (isDirty) {
        await updateProvider(ContactFieldSet.toValueApi(contacts));
        mixpanel.track('Step 5 submitted');
      }

      survey.navigateNext();
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1 className="font-sans !text-2xl font-bold">{texts.title}</h1>
      <div className="mb-8 box-border flex max-w-max items-center space-x-4 rounded-lg bg-white p-4 shadow-lg">
        <Info className="text-p-75" />
        <p className="flex-1">{texts.subTitle}</p>
      </div>
      <form className="space-y-10" onSubmit={handleSubmit(submit)}>
        <ContactFieldSet type="PERSON" control={control} />
        <SurveyStepControls disabled={isSubmitted && !isValid} />
      </form>
    </article>
  );
}
