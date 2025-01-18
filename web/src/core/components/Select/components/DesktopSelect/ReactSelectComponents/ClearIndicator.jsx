import PropTypes from 'prop-types';
import { Dismiss16Filled as Dismiss } from '@fluentui/react-icons';

export function ClearIndicator({ selectProps, clearValue }) {
  return selectProps.isMulti ? (
    <Dismiss
      onClick={clearValue}
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
    />
  ) : null;
}

ClearIndicator.propTypes = {
  selectProps: PropTypes.shape({
    isMulti: PropTypes.bool.isRequired,
  }).isRequired,
  clearValue: PropTypes.func.isRequired,
};
