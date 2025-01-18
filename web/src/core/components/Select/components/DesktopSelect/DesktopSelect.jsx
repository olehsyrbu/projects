import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';
import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { logger } from '@/core/logger';

import { useEventListener } from '@/core/hooks';
import { noop } from '@/core/utils';

import { SelectErrorMessage } from '../SelectErrorMessage';
import {
  ClearIndicator,
  Control,
  DropdownIndicator,
  IndicatorSeparator,
  MultiValue,
  Option,
} from './ReactSelectComponents';
import cx from '../../Select.module.css';

DesktopSelect.defaultProps = {
  options: [],
  isMulti: false,
  label: '',
  infoMessage: '',
  errorMessage: '',
  invalid: false,
  isCategoryInChip: false,
  defaultMenuIsOpen: false,
  onChange: noop,
};

export function DesktopSelect({
  value,
  isMulti,
  onChange,
  invalid,
  errorMessage,
  options,
  infoMessage,
  isCategoryInChip,
  label,
  defaultMenuIsOpen,
  noMargin,
  isSearchable,
  isAsync,
  loadOptions,
  className,
  ...props
}) {
  let modalRef = useRef();

  const [selectedOptions, setSelectedOptions] = useState(value);
  useEffect(() => {
    if (selectedOptions !== value) {
      setSelectedOptions(value);
    }
  }, [value, selectedOptions]);

  const [menuPlacement, setMenuPlacement] = useState('bottom');
  const [isInvalid, setInvalid] = useState(invalid);

  function getMenuPosition() {
    const MAX_MENU_HEIGHT = 300;
    const AVG_OPTION_HEIGHT = 36;
    const node = reactSelectRef.current;
    if (!node) return;

    const windowHeight = window.innerHeight;
    const menuHeight = Math.min(MAX_MENU_HEIGHT, options?.length * AVG_OPTION_HEIGHT);

    const instOffsetWithMenu = node.getBoundingClientRect().bottom + menuHeight;
    return instOffsetWithMenu >= windowHeight ? 'top' : 'bottom';
  }

  const handleChangeMenuPlacement = () => setMenuPlacement(getMenuPosition());

  useEventListener(window, 'resize', handleChangeMenuPlacement);
  useEventListener(window, 'scroll', handleChangeMenuPlacement, true);

  useEffect(() => {
    setInvalid(invalid);
  }, [invalid]);

  function filterOption({ label, value }, string) {
    try {
      value = value.toLowerCase();
      label = label.toLowerCase();
      string = string.toLowerCase();
      if (label.includes(string) || value.includes(string)) return true;
      const groupOptions = options.filter((option) =>
        option?.label?.toLowerCase().includes(string),
      );

      if (groupOptions) {
        for (const groupOption of groupOptions) {
          const option = groupOption.options?.find((opt) => opt.value === value);
          if (option) {
            return true;
          }
        }
      }
      return false;
    } catch (e) {
      logger.error(
        'ERROR: maybe you use Select with reference data, you need to use ReferenceDataSelectController',
        e,
      );
    }
  }

  function handlerChange(selectedOptions) {
    if (isInvalid) {
      setInvalid(false);
    }

    if (selectedOptions) {
      onChange(selectedOptions);
      setSelectedOptions(selectedOptions);
    }
  }

  const classNameSelect = cn(cx.dropDownDesktopWrapper, className, {
    reactSelectError: isInvalid,
    'react-select-wrapper': true,
  });

  let reactSelectRef = useRef();

  const selectProps = {
    onChange: handlerChange,
    value: selectedOptions || '',
    isSearchable: isMulti || isSearchable,
    placeholder: '',
    className: cn({ noMargin }),
    classNamePrefix: 'react-select react-select__common',
    closeMenuOnSelect: !isMulti,
    labelText: label,
    ref: (ref) => (modalRef.current = ref),
    isMulti,
    menuPlacement,
    defaultMenuIsOpen,
    components: {
      Option,
      Control,
      ClearIndicator,
      IndicatorSeparator,
      DropdownIndicator,
      MultiValue,
      ...props.components,
    },
  };

  return (
    <div
      className={classNameSelect}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      ref={reactSelectRef}
      data-testid={props['data-testid']}
    >
      {isAsync ? (
        <AsyncSelect {...props} {...selectProps} cacheOptions loadOptions={loadOptions} />
      ) : (
        <ReactSelect
          {...props}
          {...selectProps}
          isDisabled={props.disabled}
          filterOption={filterOption}
          options={options}
          isCategoryInChip={isCategoryInChip}
        />
      )}
      <SelectErrorMessage errorMessage={errorMessage} invalid={isInvalid} />
      {infoMessage !== undefined && infoMessage !== '' && invalid !== true && (
        <span className={cn(cx.infoMessage)}>{infoMessage}</span>
      )}
    </div>
  );
}

DesktopSelect.propTypes = {
  components: PropTypes.shape(),
  disabled: PropTypes.bool,
  defaultMenuIsOpen: PropTypes.bool,
  isMulti: PropTypes.bool,
  invalid: PropTypes.bool,
  isCategoryInChip: PropTypes.bool, // render label text with category
  infoMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  classNamePrefix: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
      ),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string.isRequired,
      group: PropTypes.string,
    }),
  ).isRequired,
  onChange: PropTypes.func,
  noMargin: PropTypes.bool,
  isSearchable: PropTypes.bool,
  isAsync: PropTypes.bool,
  loadOptions: PropTypes.func,
  className: PropTypes.string,
};
