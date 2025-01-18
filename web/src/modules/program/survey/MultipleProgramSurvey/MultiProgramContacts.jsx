import PropTypes from 'prop-types';
import mixpanel from '@/core/mixpanel';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { ContactFieldSet } from '@/modules/program/components';
import { Info24Filled as Info } from '@fluentui/react-icons';
import { useUpdateProgramDraft } from '@/core/api/ProgramDraftQueries';
import { logger } from '@/core/logger';

export function MultiProgramContacts({ draft }) {
  let update = useUpdateProgramDraft();
  let survey = useSurvey();
  let {
    handleSubmit,
    formState: { isDirty },
    control,
  } = useForm({
    resolver: yupResolver(ContactFieldSet.schema),
    defaultValues: {
      ...ContactFieldSet.toFormValue(draft.program),
    },
  });

  async function submit(data) {
    try {
      if (isDirty) {
        await update({
          program: ContactFieldSet.toValueApi(data),
        });

        mixpanel.track('Multiple program contact step');
      }

      survey.navigateNext();
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1 className="font-sans !text-2xl">
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

MultiProgramContacts.propTypes = {
  draft: PropTypes.object,
};
