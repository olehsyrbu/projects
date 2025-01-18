import { groupBy } from 'lodash-es';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import PropTypes from 'prop-types';
import { ArrowDownload24Filled as ArrowDownload } from '@fluentui/react-icons';
import { formatAdmission } from '@/modules/program/utils';

export function Schedule({ profile, anchorId }) {
  let { timezone, admission, duration, availability, schedulePdfUrl } = profile;

  if (!admission && !duration && !availability?.is247 && !(availability?.hours.length > 0)) {
    return null;
  }

  return (
    <section className="pb-6 max-md:px-4">
      <h2 className="-mt-6 mb-4 pt-12 text-2xl font-bold" id={anchorId}>
        {profile.mode === 'PROGRAM' ? 'Program schedule' : 'Practice hours'}
        {timezone ? ` (${formatInTimeZone(new Date(), timezone, 'z')})` : null}
      </h2>

      {admission ? (
        <p className="mb-2">
          <strong>Admission:</strong> {formatAdmission(admission, { verbose: true })}
        </p>
      ) : null}

      {duration ? (
        <div className="flex flex-wrap gap-x-4">
          <p className="mb-2">
            <strong>Duration:</strong> {formatDuration(duration)}
          </p>
          {duration.averageTotalHours > 0 ? (
            <p className="mb-2">
              <strong>Average total number of hours:</strong> {duration.averageTotalHours}
            </p>
          ) : null}
        </div>
      ) : null}

      {availability?.is247 ? (
        <p>
          <strong>Hours of operation:</strong> 24/7
        </p>
      ) : (
        <WeekSchedule hours={availability?.hours} />
      )}

      {schedulePdfUrl ? (
        <a
          href={schedulePdfUrl}
          target="_blank"
          rel="noreferrer"
          download
          className="mt-3 inline-block text-sm font-medium text-p-100"
        >
          <ArrowDownload className="mr-1" />
          Download schedule
        </a>
      ) : null}
    </section>
  );
}

function formatDuration(duration) {
  let { start, end, timeframe } = duration;
  let range = start === end ? start : `${start}–${end}`;
  return range + ' ' + timeframe.name.toLowerCase();
}

function WeekSchedule({ hours }) {
  let hoursMap = hours?.length > 0 ? groupBy(hours, 'day') : null;

  return hoursMap ? (
    <div
      aria-label="When does the program meet?"
      className="mt-3 justify-between border-light bg-n-10 p-6 max-md:-mx-4 max-md:space-y-3 max-md:p-4 md:flex md:rounded-2xl md:border"
    >
      <Day day="Sun" hours={hoursMap['SUNDAY']} />
      <Day day="Mon" hours={hoursMap['MONDAY']} />
      <Day day="Tue" hours={hoursMap['TUESDAY']} />
      <Day day="Wed" hours={hoursMap['WEDNESDAY']} />
      <Day day="Thu" hours={hoursMap['THURSDAY']} />
      <Day day="Fri" hours={hoursMap['FRIDAY']} />
      <Day day="Sat" hours={hoursMap['SATURDAY']} />
    </div>
  ) : null;
}

function Day({ day, hours }) {
  return (
    <div className="max-md:flex">
      <strong className="inline-block flex-none max-md:mr-3 max-md:w-9 md:mb-2">{day}</strong>
      <div className="flex-1 flex-wrap gap-x-6 text-sm max-md:mt-0.5 max-md:flex md:space-y-4">
        {hours?.length > 0
          ? hours.map((hours, index, list) => (
              <div key={index} className="md:max-w-[77px]">
                {format(new Date(`2000-01-01T${hours.start}`), 'h:mm aaa')} –{' '}
                {format(new Date(`2000-01-01T${hours.end}`), 'h:mm aaa')}
                {index !== list.length - 1 ? ',' : ''}
              </div>
            ))
          : 'closed'}
      </div>
    </div>
  );
}

Schedule.propTypes = {
  profile: PropTypes.object.isRequired,
  anchorId: PropTypes.string.isRequired,
};
WeekSchedule.propTypes = {
  hours: PropTypes.array.isRequired,
};
Day.propTypes = {
  day: PropTypes.string.isRequired,
  hours: PropTypes.array,
};
