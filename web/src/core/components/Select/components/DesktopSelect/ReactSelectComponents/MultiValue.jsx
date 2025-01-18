import ChipBasic from '@/core/components/Chips/ChipBasic';
import PropTypes from 'prop-types';
import { components } from 'react-select';

export function MultiValue(props) {
  const { label, value, group } = props.data;
  const labelText = props.selectProps.isCategoryInChip && group ? `${label} - ${group}` : label;
  return (
    <components.MultiValue {...props}>
      <ChipBasic className="react-select-chip" compact label={labelText} code={value} />
    </components.MultiValue>
  );
}

MultiValue.propTypes = {
  selectProps: PropTypes.shape({
    isCategoryInChip: PropTypes.bool,
  }).isRequired,
  onRemoveChip: PropTypes.func,
  isMulti: PropTypes.bool,
  isCategoryInChip: PropTypes.bool,
  data: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
    group: PropTypes.string,
  }),
};
