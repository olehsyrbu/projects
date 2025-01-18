import * as PropTypes from 'prop-types';
import { CheckmarkCircle16Filled as CheckmarkCircle } from '@fluentui/react-icons';

export function SuccessBadge({ label }) {
  return (
    <>
      <CheckmarkCircle className="!text-variant-75" />
      {label}
    </>
  );
}

SuccessBadge.propTypes = {
  label: PropTypes.string.isRequired,
};
