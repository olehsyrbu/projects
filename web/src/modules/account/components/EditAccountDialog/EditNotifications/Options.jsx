import PropTypes from 'prop-types';
import { components } from 'react-select';

export function Option({ children, data, ...props }) {
  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between">
        {children}
        {data.chip && (
          <span className="mr-1 rounded-2xl bg-[#F1F1F1] px-2 text-sm font-medium text-hint">
            {data.chip}
          </span>
        )}
      </div>
    </components.Option>
  );
}

Option.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
};
