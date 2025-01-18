import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { format, formatDistance } from 'date-fns';

export function TeamNoteDatetimeFormat({ date }) {
  const time = useMemo(() => format(new Date(date), 'h:mm a'), [date]);
  const distance = useMemo(
    () =>
      formatDistance(new Date(date), new Date(), {
        addSuffix: true,
      }),
    [date],
  );

  return (
    <>
      <span data-testid="team-note-time">{time}</span>
      <span>, </span>
      <span data-testid="team-note-date-distance">{distance}</span>
    </>
  );
}

TeamNoteDatetimeFormat.propTypes = {
  date: PropTypes.string,
};
