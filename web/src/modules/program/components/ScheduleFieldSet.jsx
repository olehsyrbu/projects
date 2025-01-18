import { useController, useFieldArray } from 'react-hook-form';
import { array, object, string } from 'yup';
import PropTypes from 'prop-types';
import { Select } from '@/core/components/Select';
import { Checkbox } from '@/core/components/Checkbox';
import { getTimeList } from '@/modules/availability/utils';
import { AddButton, RemoveButton } from './ActionButtons';

let weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export function ScheduleFieldSet({ name, disabled, control, className }) {
  let { fields, append, update, remove } = useFieldArray({ name, control });
  const {
    fieldState: { error },
    field,
  } = useController({ name, control });

  fields = fields.map((day, originalIndex) => ({
    ...day,
    originalIndex,
    disabled: day?.disabled !== undefined ? day?.disabled : !(day?.start || day?.end),
  }));

  function updateSchedule(index, newValue) {
    update(index, newValue);
    let fieldValue = field.value;
    if (fieldValue.length === 0) {
      fieldValue.push(newValue);
    } else {
      fieldValue = field.value.map((value, i) => (i === index ? newValue : value));
    }
    field.onChange(fieldValue);
  }

  function changeDisableForDays(days, disabled) {
    days.forEach((day) => update(day.originalIndex, { ...day, disabled }));
  }

  function removeDay(days, day) {
    //if left only one day, need to reset start and end time
    days.length === 1
      ? updateSchedule(day.originalIndex, { ...day, start: '', end: '' })
      : remove(day.originalIndex);
  }

  return (
    <div className={className}>
      {weekdays.map((weekday) => {
        const newDefaultDay = {
          day: weekday,
          start: '',
          end: '',
          disabled: false,
          originalIndex: fields.length,
        };

        let days = fields.filter((d) => d.day === weekday);
        days = days.length > 0 ? days : [{ ...newDefaultDay, disabled: true }];
        const hasChecked = days.some((day) => day.disabled === false);

        return (
          <div key={weekday} className="flex flex-1 flex-wrap gap-4 py-3 first:pt-0 last:pb-0">
            <Checkbox
              className="w-full sm:w-[124px] md:mt-2"
              isSelected={Boolean(hasChecked)}
              onChange={(isSelected) => changeDisableForDays(days, !isSelected)}
              isDisabled={disabled}
            >
              <span className="capitalize">{weekday.toLowerCase()}</span>
            </Checkbox>

            <div className="w-full space-y-4 sm:w-[360px]">
              {days.map((day) => (
                <div
                  key={day.id ?? day.day}
                  className="flex flex-wrap space-y-4 sm:flex-nowrap md:space-y-0"
                >
                  <div className="flex w-full space-x-4">
                    <SelectDayRange
                      day={day}
                      error={error?.[day.originalIndex]}
                      disabled={disabled || !hasChecked}
                      onChange={(payload) => updateSchedule(day.originalIndex, payload)}
                    />
                    {hasChecked && (
                      <RemoveButton
                        className="ml-auto !w-12"
                        showText={false}
                        onClick={() => removeDay(days, day)}
                      />
                    )}
                  </div>
                </div>
              ))}
              {hasChecked && (
                <AddButton className="sm:-mt-4 md:mt-0" onClick={() => append(newDefaultDay)}>
                  Add time
                </AddButton>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SelectDayRange({ error, day, onChange, disabled }) {
  const timelist = getTimeList();
  const getTimeListIndexByValue = (value) => timelist.findIndex((t) => t.value === value);
  const getEndOptions = (value) => timelist.slice(getTimeListIndexByValue(value) + 1);
  const getStartOptions = (value) =>
    timelist.slice(0, -1 * (timelist.length - getTimeListIndexByValue(value)));

  const defaultDay = { day: day.day, originalIndex: day.originalIndex, disabled: false };

  return (
    <>
      <Select
        invalid={Boolean(error?.start)}
        errorMessage={error?.start?.message}
        className="flex-1 sm:flex-[0_0_122px]"
        label="Start time"
        options={day?.end ? getStartOptions(day?.end) : timelist}
        value={timelist.find((t) => t.value === day?.start)}
        disabled={disabled}
        onChange={({ value }) => {
          onChange({
            start: value,
            end: day.end,
            ...defaultDay,
          });
        }}
      />
      <Select
        invalid={Boolean(error?.end)}
        errorMessage={error?.end?.message}
        className="flex-1 sm:flex-[0_0_122px]"
        label="End time"
        options={day?.start ? getEndOptions(day?.start) : timelist}
        value={timelist.find((t) => t.value === day?.end)}
        disabled={disabled}
        onChange={({ value }) =>
          onChange({
            start: day.start,
            end: value,
            ...defaultDay,
          })
        }
      />
    </>
  );
}

SelectDayRange.propTypes = {
  error: PropTypes.object,
  day: PropTypes.object,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

ScheduleFieldSet.schema = array().of(
  object({
    start: string().test('start', 'This field is required!', (_, { parent }) => {
      if (parent.disabled) return true;
      return parent.start !== '' && !parent.disabled;
    }),
    end: string().test('end', 'This field is required!', (_, { parent }) => {
      if (parent.disabled) return true;
      return parent.end !== '' && !parent.disabled;
    }),
  }),
);

ScheduleFieldSet.toValueApi = (hours = []) =>
  hours
    .filter((h) => !h.disabled && h.start && h.end)
    .map(({ day, end, start }) => ({
      day,
      end,
      start,
    }));

ScheduleFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  control: PropTypes.object,
};
