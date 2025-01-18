import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import ChipCheckbox from '@/core/components/Chips/ChipCheckbox';
import { useTimezones } from '@/core/api/TimezonesQueries';
import { Select } from '@/core/components/Select';
import { getTimeList } from '@/modules/availability/utils';

function PreferredTimeFilter({
  register,
  control,
  query,
  dataKey,
  onAfterChange,
  daysValues,
  timeList,
}) {
  const { timezones, getTimeZoneNameByCode, getDefaultTimeZone } = useTimezones();

  let providerTimezone = query.timeZone || getDefaultTimeZone();
  const timeZoneData = getTimeZoneNameByCode(providerTimezone);

  const [timeZone, setTimezone] = useState({
    label: timeZoneData?.label,
    value: timeZoneData?.tzCode,
  });

  const timezonesOptions = timezones.map(({ label, tzCode }) => ({
    value: tzCode,
    label: label,
  }));

  const [startTimeOptions, setStartTimeOptions] = useState(timeList);
  const [endTimeOptions, setEndTimeOptions] = useState(timeList);

  const [selectedWeekdays, setSelectedWeekdays] = useState(query.day);

  //from query could be = object or undefined
  const [start, setStart] = useState(
    startTimeOptions.find(({ value }) => value === query.startTime),
  ); //should be {value: '00:15', label: '12:15 am'} || undefined
  const [end, setEnd] = useState(endTimeOptions.find(({ value }) => value === query.endTime)); //should be {value: '00:15', label: '12:15 am'} || undefined

  useEffect(() => {
    const indexStart = timeList.findIndex(({ value }) => value === start?.value);
    const indexEnd = timeList.findIndex(({ value }) => value === end?.value);

    let itemsStart = startTimeOptions;
    let itemsEnd = endTimeOptions;

    if (indexStart !== -1) {
      itemsEnd = timeList.slice(indexStart + 1);
    }

    if (indexEnd !== -1) {
      itemsStart = timeList.slice(0, indexEnd);
    }
    setStartTimeOptions(itemsStart);
    setEndTimeOptions(itemsEnd);
  }, [start, end]);

  const hasDefaultMode =
    Array.isArray(query.modes) && (query.modes.length === 0 || query.modes.length === 2);

  return (
    <div className="preferred-time">
      <p className="!mb-2 font-bold">Preferred time</p>
      {hasDefaultMode && (
        <p className="mb-6 rounded-lg bg-graphics-20 p-4">
          This will not affect your program search, it will only be applied towards providers.
        </p>
      )}
      <p>
        Select your preferred time frame. The greater your flexibility, the more options you'll
        have.
      </p>
      <Controller
        control={control}
        name="day"
        render={({ field: { onChange, name, value } }) => {
          const handlerSelectDay = (day) => {
            const newSelectedWeekdays = selectedWeekdays.includes(day)
              ? selectedWeekdays.filter((d) => d !== day)
              : [...selectedWeekdays, day];

            setSelectedWeekdays(newSelectedWeekdays);
            const newWeekDays = [...newSelectedWeekdays.map((el) => el.toUpperCase())];
            onChange(newWeekDays);
            onAfterChange({
              dataKey,
              name,
              next: newWeekDays,
              prev: value,
            });
          };

          return (
            <div className="checkbox-wrapper" id="dayFilter">
              {daysValues.map((item, index) => {
                const isChecked = selectedWeekdays?.includes(item);
                return (
                  <ChipCheckbox
                    handleClick={() => handlerSelectDay(item)}
                    key={index}
                    value={item}
                    label={item.charAt(0)}
                    defaultChecked={isChecked}
                    {...register(dataKey + '.weekdays')}
                  />
                );
              })}
            </div>
          );
        }}
      />
      <div className="availability-column" id="timeFilter">
        <Controller
          control={control}
          name="startTime"
          render={({ field: { onChange, name, value } }) => {
            return (
              <div className="dropdown-single-select-compact">
                <Select
                  options={startTimeOptions}
                  value={start}
                  onChange={(data) => {
                    onChange(data.value);
                    onAfterChange({
                      dataKey,
                      name,
                      next: data.value,
                      prev: value,
                    });
                    setStart(data);
                  }}
                  label="Start time"
                />
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="endTime"
          render={({ field: { onChange, name, value } }) => {
            return (
              <div className="dropdown-single-select-compact">
                <Select
                  options={endTimeOptions}
                  value={end}
                  onChange={(data) => {
                    onChange(data.value);
                    onAfterChange({
                      dataKey,
                      name,
                      next: data.value,
                      prev: value,
                    });
                    setEnd(data);
                  }}
                  label="End time"
                />
              </div>
            );
          }}
        />
      </div>
      {(selectedWeekdays.length > 0 || start || end) && (
        <div className="time-zones mt-4">
          <Controller
            control={control}
            name="timeZone"
            render={({ field: { onChange, name, value } }) => {
              return (
                <div className="dropdown-single-select-compact">
                  <Select
                    label="Time zone"
                    options={timezonesOptions}
                    value={timeZone}
                    onChange={(data) => {
                      setTimezone(data);
                      onChange(data.value);
                      onAfterChange({
                        dataKey,
                        name,
                        next: data.value,
                        prev: value,
                      });
                    }}
                  />
                </div>
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

PreferredTimeFilter.propTypes = {
  dataKey: PropTypes.string,
  onAfterChange: PropTypes.func,
  register: PropTypes.func,
  control: PropTypes.object.isRequired,
  daysValues: PropTypes.array,
  query: PropTypes.shape({
    day: PropTypes.array,
    startTime: PropTypes.string,
    modes: PropTypes.array,
    endTime: PropTypes.string,
    timeZone: PropTypes.string,
    isAcceptingNewClients: PropTypes.bool,
  }),
  timeList: PropTypes.array,
};

PreferredTimeFilter.defaultProps = {
  daysValues: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
  timeList: getTimeList(),
};

export default PreferredTimeFilter;
