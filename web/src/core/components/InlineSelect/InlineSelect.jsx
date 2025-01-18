import { useRef } from 'react';
import { HiddenSelect, useButton, useSelect } from 'react-aria';
import { Item, useSelectState } from 'react-stately';
import {
  ChevronDown20Filled as ChevronDown,
  ChevronUp20Filled as ChevronUp,
} from '@fluentui/react-icons';

import { ListBox } from '../ListBox';
import { Popover } from '../Popover';

export { Item };

export function InlineSelect(props) {
  let ref = useRef(null);
  let state = useSelectState(props);
  let { triggerProps, valueProps, menuProps } = useSelect(props, state, ref);
  let { buttonProps } = useButton(triggerProps, ref);

  return (
    <div className="inline-block">
      <HiddenSelect state={state} triggerRef={ref} label={props.label} name={props.name} />

      <button {...buttonProps} data-testid="search-modes" ref={ref} className="font-bold">
        {props.caption ? <span>{props.caption}: </span> : null}

        <span className="inline-flex items-center text-p-100">
          <span {...valueProps} className="mr-1 ">
            {state.selectedItem ? state.selectedItem.rendered : 'Select an option'}
          </span>
          {state.isOpen ? <ChevronUp /> : <ChevronDown />}
        </span>
      </button>

      {state.isOpen && (
        <Popover
          state={state}
          triggerRef={ref}
          placement="bottom start"
          offset={8}
          className="py-2"
        >
          <ListBox {...menuProps} state={state} />
        </Popover>
      )}
    </div>
  );
}
