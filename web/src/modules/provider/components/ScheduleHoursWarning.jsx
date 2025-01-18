import PropTypes from 'prop-types';
import { Alert } from '@/core/components';
import { Warning16Regular as Warning } from '@fluentui/react-icons';

export function ScheduleHoursWarning({ errors }) {
  const hasError = errors?.find(
    ({ extensions }) => extensions?.fields?.availability?.hours === 'areOverlapping',
  );
  if (!hasError) return null;
  return (
    <div>
      <Alert
        className="mb-4 bg-warning-3 px-4 py-2"
        text="Please recheck your hours of operation. The times entered conflict."
        icon={<Warning />}
      />
    </div>
  );
}

ScheduleHoursWarning.propTypes = {
  errors: PropTypes.array,
};

ScheduleHoursWarning.defaultProps = {
  errors: [],
};
