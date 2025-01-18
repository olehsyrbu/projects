import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import {
  ChevronLeft24Filled as ChevronLeft,
  Dismiss12Filled as Dismiss,
} from '@fluentui/react-icons';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';
import { getPlaceholder } from '../utils';
import { ListGroupOptions, ListOptions } from '../components';
import cx from '../../../Select.module.css';

DialogSelect.propTypes = {
  isMulti: PropTypes.bool,
  isAsync: PropTypes.bool,
  inputText: PropTypes.string,
  label: PropTypes.string, //title in header
  invalid: PropTypes.bool,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
      label: PropTypes.string.isRequired,
      group: PropTypes.string,
    }),
  ),
  value: PropTypes.oneOfType([PropTypes.any, PropTypes.array, PropTypes.object]), //selected options
  onSelect: PropTypes.func,
  onDismiss: PropTypes.func,
  onInputChanged: PropTypes.func,
  MenuList: PropTypes.oneOfType([PropTypes.node, PropTypes.func]), //List of custom options
};

export function DialogSelect({
  label,
  value,
  onSelect,
  onDismiss,
  onInputChanged,
  MenuList,
  inputText = '',
  options: defaultOptions,
  isMulti,
  isAsync,
  ...props
}) {
  const hasGroup = defaultOptions?.some((opt) => opt.options);

  const menuRef = useRef();
  const [query, setQuery] = useState(inputText);
  const [selected, setSelected] = useState(value || []);
  const [options, setOptions] = useState(defaultOptions);
  const [optionsGroup, setOptionsGroup] = useState(hasGroup ? defaultOptions : []);
  const [currItem, setCurrItem] = useState(-1);
  const [currGroupItem, setCurrGroupItem] = useState(-1);
  const [focusedOption, setFocusedOption] = useState(null);

  function handlerToggleItem(item) {
    if (isMulti) {
      const newSelected = selected.find(({ label, value }) => value === item.value)
        ? selected.filter(({ value }) => value !== item.value)
        : selected.concat(item);
      setSelected(newSelected);
    } else {
      onSelect(item);
      onDismiss();
    }
  }

  function handleChangeQueryInput(e) {
    setQuery(e.target.value);
    if (onInputChanged) {
      onInputChanged(e.target.value);
    }
  }

  function handlerConfirm() {
    onSelect(selected);
    onDismiss();
  }

  function handlerRemoveSelected() {
    if (isMulti) {
      setSelected([]);
    } else {
      setSelected();
    }
    setQuery('');

    if (onInputChanged) {
      onInputChanged('');
    }
  }

  function handleInputKeyDown(e) {
    switch (e.keyCode) {
      case 9: // Tab
        onDismiss();
        break;

      case 13: // Enter
        e.preventDefault();
        if (currGroupItem >= 0 && currItem >= 0) {
          handlerToggleItem(optionsGroup[currGroupItem].options[currItem]);
        } else if (currItem >= 0) {
          handlerToggleItem(options[currItem]);
        }
        break;

      case 40: // Arrow Down
        e.preventDefault();
        if (optionsGroup?.length > 0) {
          if (currGroupItem !== -1) {
            const nextCurrItem = currItem + 1;
            const nextCurrGroupItem = currGroupItem + 1;
            const currentGroup = optionsGroup[currGroupItem];

            if (currentGroup?.options[nextCurrItem]) {
              // if has more options increment subItem index
              setCurrItem(nextCurrItem);
            } else if (optionsGroup[nextCurrGroupItem]?.options) {
              // increment group value and set 0 subItem index
              setCurrGroupItem(nextCurrGroupItem);
              setCurrItem(0);
            }
          } else {
            //first element
            setCurrGroupItem(0);
            setCurrItem(0);
          }
        } else {
          setCurrItem(currItem === options?.length - 1 ? 0 : currItem + 1);
        }

        break;

      case 38: // Arrow Up
        e.preventDefault();
        if (optionsGroup?.length > 0) {
          const isFirstOptionGroupItem = currGroupItem === -1;
          if (isFirstOptionGroupItem) {
            setCurrGroupItem(optionsGroup.length - 1);
            setCurrItem(0);
          } else {
            const subOptions = optionsGroup[currGroupItem]?.options;
            const prevCurrItem = currItem - 1;
            const prevGroupItem = currGroupItem - 1;
            const prevGroupOptions = optionsGroup[prevGroupItem]?.options;

            if (subOptions[prevCurrItem]) {
              // if has more options increment subItem index
              setCurrItem(prevCurrItem);
            } else if (prevGroupOptions) {
              // increment group value and set 0 subItem index
              setCurrGroupItem(prevGroupItem);
              setCurrItem(prevGroupOptions?.length - 1); // set last option position in prev optionGroup
            }
          }
        } else {
          setCurrItem(currItem <= 0 ? options?.length - 1 : currItem - 1);
        }
        break;

      default:
        break;
    }
  }

  function scrollIntoView(menuEl, focusedEl) {
    const menuRect = menuEl.getBoundingClientRect();
    const focusedRect = focusedEl.getBoundingClientRect();
    const overScroll = focusedEl.offsetHeight / 3;

    if (focusedRect.bottom + overScroll > menuRect.bottom) {
      menuEl.scrollTop = Math.min(
        focusedEl.offsetTop + focusedEl.clientHeight - menuEl.offsetHeight + overScroll,
        menuEl.scrollHeight,
      );
    } else if (focusedRect.top - overScroll < menuRect.top) {
      menuEl.scrollTop = Math.max(focusedEl.offsetTop - overScroll, 0);
    }
  }

  useEffect(() => {
    setQuery(inputText);
  }, [inputText]);

  function isQueryIncludesInLabel(label) {
    const q = query?.toLowerCase();
    return label.toLowerCase().includes(q);
  }

  function getOptions(option) {
    if (isQueryIncludesInLabel(option.label)) {
      return option;
    }

    if (hasGroup) {
      return {
        ...option,
        options: option?.options.filter(({ label }) => isQueryIncludesInLabel(label)),
      };
    }
  }

  useEffect(() => {
    if (query) {
      if (hasGroup) {
        setOptionsGroup(defaultOptions.map(getOptions).filter(Boolean));
      } else {
        setOptions(defaultOptions?.filter(({ label }) => isQueryIncludesInLabel(label)));
      }
    } else {
      setOptions(defaultOptions);
      if (hasGroup) {
        setOptionsGroup(defaultOptions);
      }
    }
  }, [query]);

  useEffect(() => {
    if (menuRef.current && focusedOption) {
      scrollIntoView(menuRef.current, focusedOption);
    }
  }, [focusedOption]);

  const placeholder = props.placeholder || getPlaceholder(selected?.length, options?.length, label);

  let inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Dialog showButton={false} isOpen width={500}>
      <DialogTitle>
        <div className={cx.dialogTitle}>
          <button aria-label="Close" className={cn(cx.backButton)} onClick={onDismiss}>
            <ChevronLeft />
          </button>
          <h2>{label}</h2>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className={cn(cx.flexColumn)}>
          <div className={cn(cx.fieldInputWrapper, cx.fieldInputSticky)}>
            <input
              ref={inputRef}
              onKeyDown={handleInputKeyDown}
              placeholder={placeholder}
              className={cn(cx.fieldInput, cx.fieldInputWithRemove)}
              value={query}
              onChange={handleChangeQueryInput}
            />
            <button
              type="button"
              className={cx.fieldInputRemoveBtn}
              onClick={handlerRemoveSelected}
            >
              <Dismiss />
            </button>
          </div>
          {MenuList ? (
            <MenuList />
          ) : (
            <ul className={cn(cx.selectList)} ref={menuRef}>
              {hasGroup ? (
                <ListGroupOptions
                  onFocusedOption={(item) => setFocusedOption(item)}
                  onSelectItem={handlerToggleItem}
                  selected={selected}
                  currGroupItem={currGroupItem}
                  currItem={currItem}
                  optionsGroup={optionsGroup} // diff ListOptions
                />
              ) : (
                <ListOptions
                  onFocusedOption={(item) => setFocusedOption(item)}
                  onSelectItem={handlerToggleItem}
                  selected={selected}
                  currGroupItem={currGroupItem}
                  currItem={currItem}
                  options={isAsync ? defaultOptions : options}
                />
              )}
            </ul>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <div className={cn('react-select-actions', cx.dropDownActions)}>
          <button type="button" className={cn(cx.primary)} onClick={handlerConfirm}>
            Confirm Selection
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
