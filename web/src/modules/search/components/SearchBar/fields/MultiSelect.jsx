import { useMemo, useState } from 'react';
import { useCombobox, useMultipleSelection } from 'downshift';
import { Dismiss12Filled as Dismiss } from '@fluentui/react-icons';
import cx from 'classnames';

export function MultiSelect({
  label,
  valueText,
  items: itemsProp,
  selectedItems,
  onChange,
  filterBy,
  flexBasis,
}) {
  function getFilteredItems(selectedItems, inputValue) {
    inputValue = inputValue.toLowerCase();

    return itemsProp.filter((item) => {
      return !selectedItems.includes(item) && filterBy(item).toLowerCase().includes(inputValue);
    });
  }

  const [inputValue, setInputValue] = useState('');

  const items = useMemo(
    () => getFilteredItems(selectedItems, inputValue),
    [selectedItems, inputValue],
  );
  const { getSelectedItemProps, getDropdownProps, removeSelectedItem, reset } =
    useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            onChange(newSelectedItems);
            break;
          default:
            break;
        }
      },
    });
  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items,
    itemToString(item) {
      return item ? item.name : '';
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(_, actionAndChanges) {
      const { changes, props, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true,
            inputValue: '',
            highlightedIndex: Math.min(
              props.items.indexOf(changes.selectedItem),
              props.items.length - 2,
            ),
          };

        case useCombobox.stateChangeTypes.InputBlur:
          return { ...changes, inputValue: '' };

        default:
          return changes;
      }
    },
    onStateChange({ inputValue: newInputValue, type, selectedItem: newSelectedItem }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (newSelectedItem) {
            onChange([...selectedItems, newSelectedItem]);
            setInputValue('');
          }
          break;

        case useCombobox.stateChangeTypes.InputBlur:
          setInputValue('');
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue);

          break;
        default:
          break;
      }
    },
  });

  return (
    <div className="field" style={{ flexBasis }}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label {...getLabelProps()} className="field-label block">
        {label}
      </label>
      <div className="relative">
        <input
          {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
          className="field-input"
        />
        <p className="pointer-events-none absolute top-0" hidden={isOpen}>
          {valueText(selectedItems)}
        </p>
      </div>
      <div
        className={`absolute left-0 right-0 top-full mt-2 flex transform-gpu flex-col rounded-lg border bg-white shadow-md ${
          !(isOpen && items.length) && 'hidden'
        }`}
      >
        {selectedItems.length > 0 ? (
          <div className="flex border-b p-3">
            <div className="flex min-w-0 flex-1 flex-wrap gap-2">
              {selectedItems.map((item, index) => (
                <div
                  className="flex h-6 min-w-0 items-center rounded-full border bg-white pl-4 pr-3 text-sm"
                  key={item.code}
                  {...getSelectedItemProps({ selectedItem: item, index })}
                >
                  <p className="truncate">{item.name}</p>
                  <button
                    tabIndex={-1}
                    type="button"
                    className="ml-2 cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedItem(item);
                    }}
                  >
                    <Dismiss className="text-p-100" />
                  </button>
                </div>
              ))}
            </div>
            <button
              tabIndex={-1}
              type="button"
              className="ml-2 flex-none cursor-pointer"
              onClickCapture={() => onChange([])}
            >
              <Dismiss />
            </button>
          </div>
        ) : null}
        <ul {...getMenuProps()} className="max-h-80 overflow-scroll py-2">
          {isOpen &&
            items.map((item, index) => (
              <li
                className={cx(
                  'cursor-pointer px-4 py-1',
                  highlightedIndex === index && 'bg-p-10',
                  selectedItem === item && 'bg-p-20',
                )}
                key={item.code}
                {...getItemProps({ item, index })}
              >
                {item.name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
