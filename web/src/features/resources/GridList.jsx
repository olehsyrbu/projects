import cn from 'classnames';
import PropTypes from 'prop-types';
import {
  Checkbox as AriaCheckbox,
  GridList as AriaGridList,
  Item as AriaItem,
} from 'react-aria-components';
import { Checkbox } from '@/core/components/Checkbox';

export function GridList({ children, ...props }) {
  return <AriaGridList {...props}>{children}</AriaGridList>;
}
GridList.propTypes = {
  children: PropTypes.node,
};

export function Item({ children, ...props }) {
  return (
    <AriaItem {...props} className="outline-none">
      {({ selectionMode, isFocusVisible, ...props }) => (
        <div
          className={cn('flex items-center space-x-4', {
            'ring-2 ring-p-100': isFocusVisible,
          })}
        >
          {selectionMode === 'multiple' && <Checkbox slot="selection" />}
          <div className="flex-1">{children(props)}</div>
        </div>
      )}
    </AriaItem>
  );
}

Item.propTypes = {
  children: PropTypes.node,
};

export function GridListControls({ selectedItems, totalItems, onSelectAll, onClear }) {
  const selectedItemsCount = selectedItems === 'all' ? totalItems : selectedItems.length;
  const isSelectedAll = selectedItemsCount === totalItems;
  const isIndeterminate = selectedItemsCount > 0 && !isSelectedAll;
  const handleSelect = isSelectedAll ? onClear : onSelectAll;

  return (
    <div className="flex items-center md:space-x-4">
      <AriaCheckbox className="flex cursor-pointer items-center font-bold" onChange={handleSelect}>
        {() => (
          <>
            <Checkbox
              onChange={handleSelect}
              className="mr-4"
              isIndeterminate={isIndeterminate}
              isSelected={isSelectedAll}
            />
            {selectedItemsCount === 0 ? (
              <div className="!pl-0  text-p-100">Select</div>
            ) : (
              `${selectedItemsCount} selected`
            )}
          </>
        )}
      </AriaCheckbox>
    </div>
  );
}

GridListControls.propTypes = {
  selectedItems: PropTypes.oneOf(PropTypes.string, PropTypes.number),
  totalItems: PropTypes.number,
  onSelectAll: PropTypes.func,
  onClear: PropTypes.func,
};
