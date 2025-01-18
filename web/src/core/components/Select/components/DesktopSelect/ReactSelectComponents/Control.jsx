import PropTypes from 'prop-types';
import { components } from 'react-select';
import cx from '../../../Select.module.css';

export function Control(props) {
  return (
    <components.Control {...props}>
      <div className={cx.reactSelectControl}>
        {!props.selectProps.isHideLabel && (
          <label
            className={`${cx.reactSelectLabel} ${
              props.hasValue || props.isFocused ? cx.selectedLabel : ''
            }`}
          >
            {props.selectProps.labelText}
          </label>
        )}
      </div>
      {props.children}
    </components.Control>
  );
}

Control.propTypes = {
  selectProps: PropTypes.shape({
    labelText: PropTypes.string,
    isHideLabel: PropTypes.bool,
  }).isRequired,
  hasValue: PropTypes.bool,
  isFocused: PropTypes.bool,
  label: PropTypes.string,
  children: PropTypes.node,
};
