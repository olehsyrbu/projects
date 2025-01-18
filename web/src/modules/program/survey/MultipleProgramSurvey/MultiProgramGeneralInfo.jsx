import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import mixpanel from '@/core/mixpanel';
import { noop } from '@/core/utils';
import { logger } from '@/core/logger';
import { Info24Filled as Info } from '@fluentui/react-icons';
import { useCreateOrUpdateProgramDraft } from '@/core/api/ProgramDraftQueries';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { TextArea, TextField } from '@/modules/form';

import { string, object } from 'yup';

const schema = object().shape({
  center: string().required('This field is required'),
  tagLine: string().required('This field is required'),
});

export function MultiProgramGeneralInfo({ draft, onPrevious }) {
  let createOrUpdate = useCreateOrUpdateProgramDraft();
  let survey = useSurvey();
  let { handleSubmit, control } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      center: draft?.center,
      tagLine: draft?.tagLine,
    },
  });

  async function submit(data) {
    try {
      await createOrUpdate(data);

      mixpanel.track('Multiple program get started step');
      survey.navigateNext();
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1 className="font-sans !text-2xl">Let’s get started</h1>
      <form onSubmit={handleSubmit(submit)}>
        <div className="mb-8 box-border flex items-center space-x-4 rounded-lg bg-white p-4 shadow-lg md:max-w-[800px]">
          <Info className="text-p-75" />
          <p className="flex-1 leading-6">
            Please enter information about your organization. We will use it to pre-fill each
            program, so you can edit or confirm prior to publishing on our search. If you need help,
            please reach out to
            <a className="block text-p-75" href="mailto:support@miresource.com" type="email">
              support@miresource.com.
            </a>
          </p>
        </div>
        <div className="space-y-6 md:space-y-8">
          <fieldset className="space-y-2 md:w-[435px]">
            <legend>What is the name of your organization?</legend>
            <TextField label="Organization name" name="center" control={control} />
          </fieldset>
          <fieldset className="space-y-2 md:w-[587px]">
            <legend>Organization Tagline</legend>
            <TextArea
              placeholder="Example: We provide personalized alcohol and drug treatment to meet your unique needs."
              name="tagLine"
              control={control}
              maxLength={154}
            />
          </fieldset>
        </div>
        <SurveyStepControls handleBack={onPrevious} />
      </form>
    </article>
  );
}

MultiProgramGeneralInfo.propTypes = {
  draft: PropTypes.object,
  onPrevious: PropTypes.func,
};

MultiProgramGeneralInfo.defaultProps = {
  draft: null,
  onPrevious: noop,
};
