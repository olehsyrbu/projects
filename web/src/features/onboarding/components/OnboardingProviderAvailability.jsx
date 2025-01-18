import { useForm } from 'react-hook-form';
import { object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Info24Filled as Info } from '@fluentui/react-icons';
import { TooltipIcon } from '@/core/components/Tooltip';
import mixpanel from '@/core/mixpanel';
import { useTimezoneCode } from '@/core/api/TimezonesQueries';
import { AvailabilityStatusFieldSet, ScheduleFieldSet, TimeZoneSelect } from '@/modules/program';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { ScheduleHoursWarning } from '@/modules/provider';
import { Switch } from '@/modules/form';

import { usePersonOnBoarding } from '../hooks';
import { getOboadringText } from '../utils';

const schema = object({
  availability: object({
    status: AvailabilityStatusFieldSet.schema.required('Select at least one option'),
    hours: ScheduleFieldSet.schema,
  }),
});

export function OnboardingProviderAvailability() {
  let survey = useSurvey();
  const { provider, updateProvider, role } = usePersonOnBoarding();
  const texts = getOboadringText({ role, step: survey.step });
  const timezoneCode = useTimezoneCode();
  const {
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitted, isValid, isDirty },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      timezone: provider.timezone || timezoneCode,
      availability: {
        status: provider.availability?.status || 'ACCEPTING_NEW_CLIENTS',
        hours: provider.availability?.hours ?? [],
        afterHoursCrisisServices: provider.availability?.afterHoursCrisisServices || false,
      },
    },
  });

  async function submit({ timezone, availability }) {
    try {
      if (!provider.availability || isDirty) {
        await updateProvider({
          timezone,
          availability: {
            ...availability,
            hours: ScheduleFieldSet.toValueApi(availability.hours),
          },
        });
        mixpanel.track('Step 4 submitted');
        reset({ timezone, availability });
      }
      clearErrors();
      survey.navigateNext();
    } catch (error) {
      setError('hours', { message: error.response?.errors });
    }
  }

  let hours = watch('availability.hours');
  hours = hours.filter(({ disabled }) => !disabled);

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1 className="font-sans !text-2xl font-bold">{texts.title}</h1>
      <div className="mb-8 box-border flex items-center space-x-4 rounded-lg bg-white p-4 shadow-lg md:max-w-[800px]">
        <Info className="text-p-75" />
        <p className="flex-1 leading-6">{texts.subTitle}</p>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <p className="mb-4 text-base font-bold">Current availability</p>
        <AvailabilityStatusFieldSet name="availability.status" control={control} />
        <div className="space-y-4 py-6">
          <div className="flex items-center space-x-2">
            <p className="flex items-center gap-x-2 font-bold">
              Hours of operation
              <span className="font-normal">(optional)</span>
            </p>
            <TooltipIcon label="Please select the following days/times that your program meets with clients/patients." />
          </div>
          {errors.hours && <ScheduleHoursWarning errors={errors.hours.message} />}
          <ScheduleFieldSet name="availability.hours" control={control} />

          {hours.length > 0 && (
            <div className="space-y-4">
              <p className="font-bold">Current time zone</p>
              <TimeZoneSelect name="timezone" control={control} />
            </div>
          )}
        </div>
        <div className="mt-6 flex border-y border-graphics-30 py-6">
          <Switch
            className="font-bold max-md:flex-1"
            name="availability.afterHoursCrisisServices"
            control={control}
          >
            {texts.textAfterHoursCrisisServices}
          </Switch>
          <TooltipIcon
            label="Clients/Patients can contact you or someone you have appointed to act on your behalf to address their crisis needs at night, on weekends, and over the holidays."
            classNameIcon="flex-none ml-4 md:ml-2"
          />
        </div>
        <SurveyStepControls disabled={isSubmitted && !isValid} />
      </form>
    </article>
  );
}
