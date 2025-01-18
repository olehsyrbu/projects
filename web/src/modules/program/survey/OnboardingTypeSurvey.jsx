import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import ChipRadio from '@/core/components/Chips/ChipRadio';
import { TooltipIcon } from '@/core/components/Tooltip';
import { SurveyStepControls } from '@/modules/survey/components';

export function OnboardingTypeSurvey({ onSubmit }) {
  let { register, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: { value: null },
  });

  return (
    <article className="survey-step space-y-4">
      <p className="text-2xl font-bold">It’s nice to meet you!</p>
      <p>
        Before we get started, <strong>does your organization offer more than one program?</strong>
        <TooltipIcon
          label="At MiResource, we focus on identifying the appropriate level of care for each person and referring them according to their needs. If your organization offers multiple programs with different levels of care (e.g., inpatient, outpatient), we’ll help you list them separately."
          place="bottom"
          classNameIcon="ml-2 align-middle"
        />
      </p>
      <form className="space-y-10" onSubmit={handleSubmit((data) => onSubmit(data.value))}>
        <div className="flex space-x-4">
          <ChipRadio
            label="Yes"
            {...register('value', { required: true })}
            value="multiple"
            className="min-w-[70px]"
          />
          <ChipRadio
            label="No"
            {...register('value', { required: true })}
            value="single"
            className="min-w-[70px]"
          />
        </div>
        <SurveyStepControls
          nextButtonLabel="Start now"
          disabled={!formState.isValid}
          hasBackControl={false}
          hasChevrons={false}
        />
      </form>
    </article>
  );
}

OnboardingTypeSurvey.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
