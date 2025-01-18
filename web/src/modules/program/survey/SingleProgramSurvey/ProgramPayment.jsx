import PropTypes from 'prop-types';
import { useUpdateProgram } from '@/core/api/ProgramQueries';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import mixpanel from '@/core/mixpanel';
import { PaymentFieldSet, useDefaultPayments } from '@/modules/payment';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { logger } from '@/core/logger';

const schema = PaymentFieldSet.schema();

export function ProgramPayment({ program }) {
  let survey = useSurvey();
  let update = useUpdateProgram();
  let values = useDefaultPayments(program);

  let {
    handleSubmit,
    formState: { isDirty },
    control,
  } = useForm({
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues: values,
  });

  async function submit(values) {
    try {
      if (isDirty || values.isPreselectedInsurance) {
        const patch = PaymentFieldSet.toValueApi(values);
        await update(program.id, patch);
        mixpanel.track('Single program payment step');
      }

      survey.navigateNext();
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <article className="survey-step md:!max-w-[917px]">
      <SurveyStepInfo />
      <h1 className="font-sans !text-2xl font-bold">Which forms of payment do you support?</h1>
      <p className="font-bold">Select all that apply for your program.</p>
      <form onSubmit={handleSubmit(submit)}>
        <PaymentFieldSet
          control={control}
          titleInsurance="List insurance companies the program is in-network with."
        />
        <SurveyStepControls />
      </form>
    </article>
  );
}

ProgramPayment.propTypes = {
  program: PropTypes.object,
};
