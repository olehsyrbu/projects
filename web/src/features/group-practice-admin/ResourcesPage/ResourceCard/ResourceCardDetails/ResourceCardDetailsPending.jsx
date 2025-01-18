import PropTypes from 'prop-types';
import format from 'date-fns/format';
import { PersonClock16Regular as PersonClock, Mail16Regular as Mail } from '@fluentui/react-icons';
import { Alert } from '@/core/components';

export function ResourceCardDetailsPending({ tagLine, onResend, sentAt }) {
  return (
    <>
      <div className="min-w-min opacity-50 md:w-1/2">{tagLine}</div>
      <div className="basis-1/6">
        <div className="badge flex flex-row items-center text-xs font-light">
          <Alert text="Pending" iconClassesName="text-graphics-100" icon={<PersonClock />} />
        </div>
      </div>
      <div className="basis-1/3">
        <div className="flex flex-row flex-wrap items-center text-xs font-light">
          <span className="mr-2 flex text-graphics-100">
            <Mail />
          </span>
          {`Sent ${format(new Date(sentAt), 'MMM d, yyyy')}`}

          <button
            className="mir-button text button-text-xs !ml-4 text-xs !font-bold text-p-100"
            onClick={onResend}
          >
            Resend
          </button>
        </div>
      </div>
    </>
  );
}

ResourceCardDetailsPending.defaultProps = {
  tagLine: '',
  sentAt: '',
};
ResourceCardDetailsPending.propTypes = {
  tagLine: PropTypes.string,
  sentAt: PropTypes.string,
  onResend: PropTypes.func,
};
