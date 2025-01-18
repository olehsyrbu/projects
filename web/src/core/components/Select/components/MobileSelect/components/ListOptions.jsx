import PropTypes from 'prop-types';
import { Checkmark24Filled as Checkmark } from '@fluentui/react-icons';

import { getIsFocusedOption, getIsSelectedOption } from '../utils';
import cx from '../../../Select.module.css';

export function ListOptions({
  selected,
  options,
  indexGroup = -1,
  currGroupItem,
  currItem,
  onSelectItem,
  onFocusedOption,
}) {
  return (
    <ul>
      {options?.map(({ label, value, ...option }, index) => {
        const isSelected = value && getIsSelectedOption(selected, value);
        const isFocused = getIsFocusedOption({ index, indexGroup, currGroupItem, currItem });

        function handleSelect() {
          onSelectItem({ label, value, ...option });
        }

        return (
          <li
            aria-hidden="true"
            key={value}
            ref={(ref) => {
              if (isFocused && onFocusedOption) {
                onFocusedOption(ref);
              }
            }}
            className={cx.optionItem}
            data-selected={!!isSelected}
            onClick={handleSelect}
          >
            {label}
            {option.chip && (
              <span className="mr-1 rounded-2xl bg-[#F1F1F1] px-2 text-sm font-medium text-hint">
                {option.chip}
              </span>
            )}
            {!!isSelected ? <Checkmark /> : <span />}
            {option?.subLabel}
          </li>
        );
      })}
    </ul>
  );
}

ListOptions.propTypes = {
  selected: PropTypes.array,
  options: PropTypes.array.isRequired,
  indexGroup: PropTypes.number,
  currGroupItem: PropTypes.number,
  currItem: PropTypes.number,
  onSelectItem: PropTypes.func.isRequired,
  onFocusedOption: PropTypes.func,
};
