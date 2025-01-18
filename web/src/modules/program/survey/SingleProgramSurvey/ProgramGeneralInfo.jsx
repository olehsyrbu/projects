import { logger } from '@/core/logger';
import mixpanel from '@/core/mixpanel';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateProgram, useUpdateProgram } from '@/core/api/ProgramQueries';
import { useProgramTypes } from '@/core/api/ReferenceDataQueries';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { PhotoPicker, ReferenceDataSelect, TextArea, TextField } from '@/modules/form';
import { DurationFieldSet } from '@/modules/program';
import { object, string } from 'yup';

const message = 'This field is required';
const schema = object().shape({
  photoUrl: string().typeError(message).required(message),
  programType: object().required(message),
  name: string().required(message),
  center: string().required(message),
  tagLine: string().required(message),
  duration: DurationFieldSet.schema().required(message),
});

export function ProgramGeneralInfo({ program, onCreate, onBack }) {
  let create = useCreateProgram();
  let update = useUpdateProgram();
  let survey = useSurvey();
  let {
    handleSubmit,
    control,
    formState: { isDirty, dirtyFields },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      photoUrl: program?.photoUrl,
      programType: program?.programType,
      name: program?.name,
      center: program?.center,
      tagLine: program?.tagLine,
      duration: program?.duration ? program?.duration : undefined,
    },
  });

  async function submit(values) {
    try {
      let duration = values.duration;
      let payload = {
        name: values.name,
        center: values.center,
        tagLine: values.tagLine,
        programType: values.programType?.code,
        duration: {
          start: duration.start,
          end: duration.start > duration.end ? duration.start : duration.end,
          timeframe: duration.timeframe?.code,
        },
      };

      if (dirtyFields.photoUrl) {
        payload.photoUrl = values.photoUrl;
      }

      if (program && isDirty) {
        await update(program.id, payload);
      } else if (!program) {
        let program = await create(payload);
        onCreate(program);
      }

      mixpanel.track('Single program overview step');

      survey.navigateNext();
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1 className="font-sans !text-2xl font-bold">Getting to know your program</h1>
      <form className="space-y-6" onSubmit={handleSubmit(submit)}>
        <fieldset className="md:w-[435px]">
          <PhotoPicker control={control} name="photoUrl" />
        </fieldset>
        <fieldset className="md:w-[435px]">
          <legend>Program type</legend>
          <TypeSelect label="Select program type" name="programType" control={control} />
        </fieldset>
        <fieldset className="md:w-[435px]">
          <legend className="!mb-0">Program duration</legend>
          <p className="mb-4">Average time period clients/patients are involved.</p>
          <DurationFieldSet name="duration" control={control} />
        </fieldset>
        <fieldset className="md:w-[435px]">
          <legend>Program name</legend>
          <TextField label="Program name" name="name" control={control} />
        </fieldset>
        <fieldset className="md:w-[435px]">
          <legend>Organization name</legend>
          <TextField label="Organization name" name="center" control={control} />
        </fieldset>
        <fieldset className="md:w-[587px]">
          <legend>Program Tagline</legend>
          <TextArea
            placeholder="Example: We provide personalized alcohol and drug treatment to meet your unique needs."
            name="tagLine"
            control={control}
            maxLength={154}
          />
        </fieldset>
        <SurveyStepControls handleBack={onBack} />
      </form>
    </article>
  );
}

ProgramGeneralInfo.propTypes = {
  program: PropTypes.object,
  onCreate: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

ProgramGeneralInfo.defaultProps = {
  onCreate: () => {},
  onBack: () => {},
};

function TypeSelect(props) {
  let types = useProgramTypes();
  return <ReferenceDataSelect {...props} options={types} isSearchable={false} />;
}
