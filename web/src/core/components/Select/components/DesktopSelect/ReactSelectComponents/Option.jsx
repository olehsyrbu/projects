import PropTypes from 'prop-types';
import { components } from 'react-select';
import { Checkmark24Filled as Checkmark } from '@fluentui/react-icons';

export function Option({ children, isSelected, data, ...restProps }) {
  return (
    <components.Option {...restProps} className={`!flex ${isSelected ? '!bg-p-40' : ''}`}>
      <div>
        {children}
        {data?.subLabel && data.subLabel}
      </div>
      {isSelected && (
        <span className="ml-auto flex text-p-100">
          <Checkmark />
        </span>
      )}
    </components.Option>
  );
}

Option.propTypes = {
  children: PropTypes.node.isRequired,
  isSelected: PropTypes.bool.isRequired,
};
