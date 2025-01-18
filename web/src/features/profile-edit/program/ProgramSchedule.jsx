import { Controller, useForm } from 'react-hook-form';
import { array, number, object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { logger } from '@/core/logger';
import PropTypes from 'prop-types';
import { isString, isBoolean } from 'lodash-es';

import {
  AdmissionScheduleFieldSet,
  AvailabilityStatusFieldSet,
  ContactFieldSet,
  DurationFieldSet,
  ScheduleFieldSet,
  TimeZoneSelect,
} from '@/modules/program';
import { Checkbox, NumberInput } from '@/modules/form';
import {
  useRemoveProgramSchedulePdf,
  useUpdateProgram,
  useUploadProgramSchedulePdf,
} from '@/core/api/ProgramQueries';
import { useTimezoneCode } from '@/core/api/TimezonesQueries';
import { ScheduleHoursWarning } from '@/modules/provider';
import { PdfPicker } from './PdfPicker';
import { EditorActions } from '../EditorActions';
import { UnsavedDataPrompt } from '../UnsavedDataPrompt';
import { TooltipIcon } from '@/core/components/Tooltip';

const schema = object().shape({
  contacts: ContactFieldSet.schema,
  availability: object({
    status: AvailabilityStatusFieldSet.schema.required('Select at least one option'),
    hours: array().when('is247', { is: false, then: ScheduleFieldSet.schema }),
  }),
  admission: AdmissionScheduleFieldSet.schema,
  duration: DurationFieldSet.schema({
    averageTotalHours: number(),
  }),
});

export function ProgramSchedule({ program }) {
  let update = useUpdateProgram();
  const uploadSchedulePdf = useUploadProgramSchedulePdf();
  const removeSchedulePdf = useRemoveProgramSchedulePdf();
  const timezoneCode = useTimezoneCode();
  const {
    watch,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors, isDirty, isSubmitting, dirtyFields },
    reset,
    resetField,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      timezone: program.timezone || timezoneCode,
      duration: program.duration || {},
      contacts: {
        ...ContactFieldSet.toFormValue(program),
      },
      availability: {
        status: program.availability?.status ?? 'ACCEPTING_NEW_CLIENTS',
        is247: program.availability?.is247 ?? false,
        hours: program.availability?.hours ?? [],
      },
      admission: {
        ...AdmissionScheduleFieldSet.toFormValue(program.admission),
      },
      schedulePdf: isString(program.schedulePdfUrl)
        ? { name: program.schedulePdfUrl.split('/').pop() }
        : null,
    },
    resolver: yupResolver(schema),
  });

  const is247 = watch('availability.is247');
  let hours = watch('availability.hours');
  hours = hours.filter(({ disabled }) => !disabled);

  async function submit({ contacts, schedulePdf, ...data }) {
    let { schedulePdf: isSchedulePdfChanged, ...otherDirtyFields } = dirtyFields;
    let isOtherFieldsChanged = Object.keys(otherDirtyFields).length > 0;

    try {
      if (isBoolean(isSchedulePdfChanged) && isSchedulePdfChanged) {
        if (schedulePdf) {
          await uploadSchedulePdf({ schedulePdf, program });
        } else {
          await removeSchedulePdf({ program });
        }
        resetField('schedulePdf');
      }

      if (isOtherFieldsChanged) {
        let admission = AdmissionScheduleFieldSet.toValueApi(data.admission);
        await update(program.id, {
          ...data,
          duration: {
            ...data.duration,
            timeframe: data.duration.timeframe?.code,
          },
          availability: {
            ...data.availability,
            hours: ScheduleFieldSet.toValueApi(data.availability.hours),
          },
          ...ContactFieldSet.toValueApi(contacts),
          admission,
        });

        reset({
          ...data,
          admission: {
            ...admission,
            dates: admission?.dates.length > 0 ? admission?.dates : [{}],
          },
          contacts,
        });
      }

      clearErrors();
    } catch (error) {
      setError('hours', { message: error.response?.errors });
      logger.error(error);
    }
  }

  return (
    <>
      <UnsavedDataPrompt when={isDirty} />
      <form
        onSubmit={handleSubmit(submit)}
        className="divide-x-0 divide-y divide-solid divide-graphics-30"
      >
        <div className="pb-6">
          <p className="pb-2 text-base font-bold">Contact information</p>
          <p className="mb-4">Only your preferred contact methods will be displayed.</p>
          <ContactFieldSet name="contacts" control={control} />
        </div>
        <div className="space-y-4 py-6">
          <p className="text-base font-bold">Current availability</p>
          <AvailabilityStatusFieldSet name="availability.status" control={control} />
        </div>
        <div className="space-y-4 py-6">
          <p className="text-base font-bold">When does the program admit new patients/clients?</p>
          <AdmissionScheduleFieldSet control={control} name="admission" />
        </div>
        <div className="space-y-4 py-6">
          <p className="!mb-0 text-base font-bold">Program duration</p>
          <p className="mb-4">Average time period clients/patients are involved.</p>
          <DurationFieldSet name="duration" control={control} />
        </div>
        <div className="space-y-4 py-6">
          <p className="flex items-center gap-x-2 font-bold">
            Average total number of hours
            <span className="font-normal">(optional)</span>
            <TooltipIcon label="This is the number of hours that you provide direct programming for clients/patients. This number may be different from the number of hours that clients/patients are actually on your site." />
          </p>
          <NumberInput
            className="w-12 !p-0 text-center"
            min="0"
            name="duration.averageTotalHours"
            control={control}
          />
        </div>
        <div className="space-y-4 py-6">
          <p className="font-bold">
            Upload sample schedule <span className="font-normal">(optional)</span>
          </p>
          <Controller
            control={control}
            name="schedulePdf"
            render={({ field, fieldState }) => (
              <>
                {fieldState.error ? (
                  <p className="text-sm text-error-1">{fieldState.error.message}</p>
                ) : null}
                <PdfPicker
                  file={field.value}
                  onChange={(file) => {
                    field.onChange(file);
                    setError('schedulePdf', null);
                  }}
                  onReject={() => {
                    setError('schedulePdf', {
                      type: 'custom',
                      message:
                        'Something went wrong, please check the file size, file format and try again.',
                    });
                  }}
                />
              </>
            )}
          />
          <p className="text-sm text-hint">
            Uploaded file must be less than 8MB and in PDF format.
          </p>
        </div>
        <div className="space-y-4 py-6">
          <div className="flex items-center space-x-2">
            <p className="flex items-center gap-x-2 font-bold">
              When does the program meet?
              <span className="font-normal">(optional)</span>
            </p>
            <TooltipIcon label="Please select the following days/times that your program meets with clients/patients." />
          </div>
          {errors.hours && <ScheduleHoursWarning errors={errors.hours.message} />}
          <Checkbox name="availability.is247" control={control}>
            24/7
          </Checkbox>
          <ScheduleFieldSet name="availability.hours" disabled={is247} control={control} />

          {hours.length > 0 && (
            <div className="space-y-4">
              <p className="font-bold">Current time zone</p>
              <TimeZoneSelect name="timezone" control={control} />
            </div>
          )}
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

ProgramSchedule.propTypes = {
  program: PropTypes.object.isRequired,
};
