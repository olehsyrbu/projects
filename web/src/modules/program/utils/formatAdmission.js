import { format } from 'date-fns';

let weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export function formatAdmission(admission, options) {
  if (admission.type === 'ONGOING') return 'Ongoing';

  if (admission.type === 'WEEKDAYS') {
    return weekdays
      .filter((w) => admission.weekdays.includes(w))
      .map((w) => w[0] + w.slice(1, 3).toLowerCase())
      .join(', ');
  }

  if (admission.type === 'DATES') {
    return admission.dates.length > 1 && !options?.verbose
      ? 'On specific dates'
      : admission.dates.map(formatDate).join(', ');
  }
}

function formatDate({ start, end }) {
  let sameDay = start.slice(0, 10) === end.slice(0, 10);
  let sameMonth = start.slice(0, 7) === end.slice(0, 7);
  let pattern = 'd\u00a0MMM';

  if (sameDay) return format(new Date(start), pattern);

  return (
    format(new Date(start), sameMonth ? 'd' : pattern) + '–\u2060' + format(new Date(end), pattern)
  );
}
