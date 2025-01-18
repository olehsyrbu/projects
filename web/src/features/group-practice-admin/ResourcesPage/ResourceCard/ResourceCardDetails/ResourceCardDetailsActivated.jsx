import PropTypes from 'prop-types';
import { Checkmark16Filled as Checkmark } from '@fluentui/react-icons';
import { Alert } from '@/core/components';

export function ResourceCardDetailsActivated({ tagLine, deactivated }) {
  return (
    <>
      <div className="md:w-1/2">{tagLine}</div>
      <div className="badge flex items-center text-xs font-light">
        {deactivated ? (
          <span className="rounded-lg bg-graphics-30 px-3 py-2 font-bold">Deactivated</span>
        ) : (
          <Alert text="Activated" iconClassesName="text-graphics-100" icon={<Checkmark />} />
        )}
      </div>
    </>
  );
}

ResourceCardDetailsActivated.defaultProps = {
  tagLine: '',
  deactivated: false,
};
ResourceCardDetailsActivated.propTypes = {
  tagLine: PropTypes.string,
  deactivated: PropTypes.bool,
};
