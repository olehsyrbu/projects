import { useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { ChevronDown24Filled as ChevronDown } from '@fluentui/react-icons';
import { DialogSelect } from './components';
import { getPlaceholder } from './utils';
import { SelectErrorMessage } from '../SelectErrorMessage';
import { noop } from '@/core/utils';
import cx from './../../Select.module.css';

MobileSelect.defaultProps = {
  isMulti: false,
  label: '',
  infoMessage: '',
  errorMessage: '',
  invalid: false,
  isCategoryInChip: false,
  defaultMenuIsOpen: false,
  onChange: noop,
};

MobileSelect.propTypes = {
  disabled: PropTypes.bool,
  isMulti: PropTypes.bool,
  isShowChevron: PropTypes.bool,
  invalid: PropTypes.bool,
  inputNoBorder: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  inputText: PropTypes.string,
  errorMessage: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
      label: PropTypes.string.isRequired,
      category: PropTypes.string,
    }),
  ),
  value: PropTypes.oneOfType([PropTypes.any, PropTypes.array, PropTypes.object]), //selected options
  triggerText: PropTypes.func,
  onChange: PropTypes.func,
  id: PropTypes.string,
};

export function MobileSelect({
  isShowChevron = true,
  invalid,
  errorMessage,
  value,
  onChange,
  inputNoBorder = false,
  className,
  triggerText,
  id,
  ...props
}) {
  const [expanded, setExpanded] = useState(false);
  let placeholder = props.inputText || props.placeholder || value?.label || props.label;
  if (props.isMulti) {
    placeholder = getPlaceholder(value ? value.length : 0, props.options, props.label);
  }

  function handlerChange(selectedOptions) {
    if (onChange) {
      onChange(selectedOptions);
    }
  }

  function handleShowMenu() {
    if (props.disabled) {
      return false;
    }
    setExpanded(true);
  }

  function handleHideMenu() {
    setExpanded(false);
  }

  const fieldInputWrapperClasses = cn(cx.fieldInputWrapper, {
    [cx.borderError]: invalid,
  });
  return (
    <div className={cn(cx.flexColumn, [className])} data-testid={props['data-testid']}>
      <div className={fieldInputWrapperClasses} id={id}>
        <div
          aria-hidden="true"
          className={cn('mobile-select', cx.fieldInput, {
            [cx.noBorder]: inputNoBorder,
            [cx.disabled]: props.disabled,
          })}
          onClick={handleShowMenu}
        >
          <div className={cn(cx.ellipsis)}>
            {triggerText
              ? triggerText({ items: props.options, selectedItems: value })
              : placeholder}
            {value?.subLabel}
          </div>
          {isShowChevron && (
            <div className={cn(cx.fieldInputChevron, cx.dropdownIndicator)}>
              <ChevronDown />
            </div>
          )}
        </div>
        {expanded && (
          <DialogSelect
            value={value}
            onSelect={handlerChange}
            onDismiss={handleHideMenu}
            {...props}
          />
        )}
      </div>
      <SelectErrorMessage errorMessage={errorMessage} invalid={invalid} />
    </div>
  );
}
