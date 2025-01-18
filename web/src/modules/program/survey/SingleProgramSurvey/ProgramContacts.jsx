import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { ContactFieldSet } from '@/modules/program/components';
import { Info24Filled as Info } from '@fluentui/react-icons';
import PropTypes from 'prop-types';
import { logger } from '@/core/logger';
import { useUpdateProgram } from '@/core/api/ProgramQueries';
import mixpanel from '@/core/mixpanel';

export function ProgramContacts({ program }) {
  let survey = useSurvey();
  let update = useUpdateProgram();

  let {
    handleSubmit,
    formState: { isDirty },
    control,
  } = useForm({
    defaultValues: ContactFieldSet.toFormValue(program),
    resolver: yupResolver(ContactFieldSet.schema),
  });

  async function submit(data) {
    try {
      if (isDirty) {
        await update(program.id, ContactFieldSet.toValueApi(data));

        mixpanel.track('Single program contact step');
      }

      survey.navigateNext();
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1 className="font-sans !text-2xl font-bold">
        How would you like prospective clients/patients to contact you?
      </h1>
      <div className="mb-8 box-border flex max-w-max items-center space-x-4 rounded-lg bg-white p-4 shadow-lg">
        <Info className="text-p-75" />
        <p className="flex-1">Only your preferred contact methods will be displayed.</p>
      </div>
      <form className="space-y-10" onSubmit={handleSubmit(submit)}>
        <ContactFieldSet control={control} />
        <SurveyStepControls />
      </form>
    </article>
  );
}

ProgramContacts.propTypes = {
  program: PropTypes.object,
};
