import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { object } from 'yup';
import PropTypes from 'prop-types';

import { useAuthContext } from '@/modules/auth';
import {
  AvailabilityStatusFieldSet,
  ContactFieldSet,
  ScheduleFieldSet,
  TimeZoneSelect,
} from '@/modules/program';
import { ScheduleHoursWarning } from '@/modules/provider';
import { Switch } from '@/modules/form';
import { logger } from '@/core/logger';
import { TooltipIcon } from '@/core/components/Tooltip';
import { useUpdatePersonProviderProfile } from '@/core/api/ProviderQueries';
import { useTimezoneCode } from '@/core/api/TimezonesQueries';
import { UnsavedDataPrompt } from '../UnsavedDataPrompt';
import { EditorActions } from '../EditorActions';

const schema = object().shape({
  contacts: ContactFieldSet.schema,
  availability: object({
    status: AvailabilityStatusFieldSet.schema.required('Select at least one option'),
    hours: ScheduleFieldSet.schema,
  }),
});

export function ProviderSchedule({ provider }) {
  const update = useUpdatePersonProviderProfile();
  let { user } = useAuthContext();
  const timezoneCode = useTimezoneCode();

  const {
    watch,
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting, errors },
    reset,
    setError,
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      afterHoursCrisisServices: provider.availability?.afterHoursCrisisServices || false,
      timezone: provider.timezone || timezoneCode,
      contacts: { ...ContactFieldSet.toFormValue(provider) },
      availability: {
        status: provider.availability?.status ?? 'ACCEPTING_NEW_CLIENTS',
        hours: provider.availability?.hours ?? [],
      },
    },
    resolver: yupResolver(schema),
  });

  async function submit(values) {
    if (isDirty) {
      const { contacts, availability, timezone, afterHoursCrisisServices } = values;

      try {
        await update(
          provider.id,
          {
            timezone,
            availability: {
              ...availability,
              afterHoursCrisisServices,
              hours: ScheduleFieldSet.toValueApi(availability.hours),
            },
            ...ContactFieldSet.toValueApi(contacts),
          },
          user,
        );

        reset(values);
      } catch (error) {
        setError('hours', { message: error.response?.errors });
        logger.error(error);
      }
    }
  }

  let hours = watch('availability.hours');
  hours = hours.filter(({ disabled }) => !disabled);

  return (
    <>
      <UnsavedDataPrompt when={isDirty} />
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-y-4 divide-x-0 divide-y-[1px] divide-solid divide-graphics-30"
      >
        <div>
          <p className="pb-2 text-base font-bold">Contact information</p>
          <p className="mb-4">
            This information will be displayed publicly on your profile and will be indicated to
            clients/patients as the best way to contact you.
          </p>
          <ContactFieldSet type={provider.mode} name="contacts" control={control} />
        </div>
        <div className="space-y-4 py-6">
          <p className="text-base font-bold">Current availability</p>
          <AvailabilityStatusFieldSet name="availability.status" control={control} />
        </div>
        <div className="space-y-4 py-6">
          <h3 className="font-bold">
            Hours of operation
            <span className="font-normal"> (optional)</span>
          </h3>
          {errors.hours && <ScheduleHoursWarning errors={errors.hours.message} />}
          <ScheduleFieldSet name="availability.hours" control={control} />
        </div>
        {hours.length > 0 && (
          <div className="space-y-4 py-6">
            <p className="font-bold">Current time zone</p>
            <TimeZoneSelect name="timezone" control={control} />
          </div>
        )}

        <div className="inline-flex space-x-4 pt-4">
          <Switch className="font-bold" name="afterHoursCrisisServices" control={control}>
            I provide after-hours crisis services
          </Switch>
          <TooltipIcon label="Clients/Patients can contact you or someone you have appointed to act on your behalf to address their crisis needs at night, on weekends, and over the holidays." />
        </div>
      </form>
      <EditorActions
        isDisabled={!isDirty}
        isLoading={isSubmitting}
        onSave={handleSubmit(submit)}
        onCancel={() => reset()}
      />
    </>
  );
}

ProviderSchedule.propTypes = {
  provider: PropTypes.object,
};
