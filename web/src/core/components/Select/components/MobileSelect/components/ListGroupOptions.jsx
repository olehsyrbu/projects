import PropTypes from 'prop-types';
import cn from 'classnames';
import { ListOptions } from './ListOptions';
import cx from '../../../Select.module.css';

ListGroupOptions.propTypes = {
  selected: PropTypes.array,
  options: PropTypes.array,
  indexGroup: PropTypes.number,
  currGroupItem: PropTypes.number,
  currItem: PropTypes.number,
  onSelectItem: PropTypes.func,
  onFocusedOption: PropTypes.func,
};

export function ListGroupOptions({ optionsGroup, ...props }) {
  return (
    <li>
      {optionsGroup?.map(({ label, value, options }, indexGroup) => {
        return (
          <ul key={label} className={cn(cx.listOptionGroup)}>
            {options?.length > 0 ? (
              <li>
                <span className={cn(cx.optionItemGroup)}>{label}</span>
                <ListOptions options={options} indexGroup={indexGroup} {...props} />
              </li>
            ) : (
              <ListOptions
                onSelectItem={props.onSelectItem}
                options={[
                  {
                    label,
                    value,
                    ...props,
                  },
                ]}
              />
            )}
          </ul>
        );
      })}
    </li>
  );
}

ListGroupOptions.propTypes = {
  selected: PropTypes.array,
  optionsGroup: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string,
          label: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
};
