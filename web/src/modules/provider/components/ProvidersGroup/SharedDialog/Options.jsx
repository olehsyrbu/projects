import PropTypes from 'prop-types';
import { components } from 'react-select';

export function Option({ children, data, ...props }) {
  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between">
        {children}
        {data.name && <span className="px-2 text-base text-hint ">{data.name}</span>}
      </div>
    </components.Option>
  );
}

Option.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
};
