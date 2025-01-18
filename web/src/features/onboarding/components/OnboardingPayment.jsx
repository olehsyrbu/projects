import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

import mixpanel from '@/core/mixpanel';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { useSurvey } from '@/modules/survey/hooks';
import { PaymentFieldSet, useDefaultPayments } from '@/modules/payment';
import { usePersonOnBoarding } from '../hooks';
import { getOboadringText } from '../utils';
import { logger } from '@/core/logger';

const schema = PaymentFieldSet.schema();

export function OnboardingPayment() {
  let survey = useSurvey();
  let { provider, updateProvider, role } = usePersonOnBoarding();

  const texts = getOboadringText({ role, step: survey.step });

  let values = useDefaultPayments(provider);

  let {
    handleSubmit,
    formState: { isDirty, isValid, isSubmitted },
    control,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: values,
  });

  async function submit(values) {
    try {
      if (isDirty || values.isPreselectedInsurance) {
        let patch = PaymentFieldSet.toValueApi(values);

        await updateProvider(patch);
        mixpanel.track('Step 7 submitted');
      }

      survey.navigateNext();
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <div className="survey-step">
      <SurveyStepInfo />
      <h1>{texts.title}</h1>
      <form onSubmit={handleSubmit(submit)}>
        <h2 className="font-bold">{texts.subTitle}</h2>
        <PaymentFieldSet control={control} titleInsurance={texts.titleInsurance} />
        <SurveyStepControls disabled={isSubmitted && !isValid} />
      </form>
    </div>
  );
}
