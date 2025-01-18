import { useForm } from 'react-hook-form';
import { array, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useUpdateProgram } from '@/core/api/ProgramQueries';
import { useTimezoneCode } from '@/core/api/TimezonesQueries';
import { Checkbox } from '@/modules/form';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import {
  AdmissionScheduleFieldSet,
  AvailabilityStatusFieldSet,
  ScheduleFieldSet,
  TimeZoneSelect,
} from '@/modules/program';
import mixpanel from '@/core/mixpanel';
import { ScheduleHoursWarning } from '@/modules/provider';
import { TooltipIcon } from '@/core/components/Tooltip';

const schema = object({
  availability: object({
    status: AvailabilityStatusFieldSet.schema.required('Select at least one option'),
    hours: array().when('is247', { is: false, then: ScheduleFieldSet.schema }),
  }),
  admission: AdmissionScheduleFieldSet.schema,
  timezone: string().required(),
});

export function ProgramAvailability({ program }) {
  const survey = useSurvey();
  const updateProgram = useUpdateProgram();
  const timezoneCode = useTimezoneCode();

  const {
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      availability: {
        status: program.availability?.status ?? 'ACCEPTING_NEW_CLIENTS',
        is247: program.availability?.is247 ?? false,
        hours: program.availability?.hours ?? [],
      },
      admission: {
        ...AdmissionScheduleFieldSet.toFormValue(program.admission),
      },
      timezone: program.timezone || timezoneCode,
    },
  });

  const is247 = watch('availability.is247');

  async function submit(data) {
    try {
      await updateProgram(program.id, {
        ...data,
        availability: {
          ...data.availability,
          hours: ScheduleFieldSet.toValueApi(data.availability.hours),
        },
        admission: {
          ...AdmissionScheduleFieldSet.toValueApi(data.admission),
        },
      });
      clearErrors();
      mixpanel.track('Single program availability step');
      survey.navigateNext();
    } catch (error) {
      setError('hours', { message: error.response?.errors });
    }
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />

      <h1 className="font-sans !text-2xl font-bold">What is the program’s current availability?</h1>

      <form className="space-y-6" onSubmit={handleSubmit(submit)}>
        <AvailabilityStatusFieldSet name="availability.status" control={control} />

        <FieldSet label="When does the program admit new patients/clients?">
          <AdmissionScheduleFieldSet name="admission" control={control} />
        </FieldSet>

        <FieldSet
          label="When does the program meet?"
          optional
          tooltipLabel="Please select the following days/times that your program meets with clients/patients."
        >
          <div>
            {errors.hours && <ScheduleHoursWarning errors={errors.hours.message} />}
            <Checkbox name="availability.is247" control={control}>
              24/7
            </Checkbox>
          </div>
          <ScheduleFieldSet
            className="divide-x-0 divide-y divide-solid divide-graphics-30"
            name="availability.hours"
            disabled={is247}
            control={control}
          />
        </FieldSet>

        <FieldSet label="Current time zone">
          <TimeZoneSelect name="timezone" control={control} />
        </FieldSet>

        <SurveyStepControls />
      </form>
    </article>
  );
}

function FieldSet({ label, optional, children, tooltipLabel }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <p className="text-base font-bold">
          {label} {optional && <span className="font-normal">(optional)</span>}
        </p>
        {tooltipLabel && <TooltipIcon label={tooltipLabel} />}
      </div>

      {children}
    </div>
  );
}

FieldSet.propTypes = {
  label: PropTypes.string.isRequired,
  optional: PropTypes.bool,
  children: PropTypes.node.isRequired,
  tooltipLabel: PropTypes.string,
};
ProgramAvailability.propTypes = {
  program: PropTypes.object.isRequired,
};
