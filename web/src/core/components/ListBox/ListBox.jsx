import { useRef } from 'react';
import { useListBox, useOption } from 'react-aria';
import { Item } from 'react-stately';
import cn from 'classnames';
import { Checkmark24Filled as Checkmark } from '@fluentui/react-icons';

export { Item };

export function ListBox(props) {
  let ref = useRef(null);
  let { listBoxRef = ref, state } = props;
  let { listBoxProps } = useListBox(props, state, listBoxRef);

  return (
    <ul {...listBoxProps} ref={listBoxRef}>
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
}

function Option({ item, state }) {
  let ref = useRef(null);
  let { optionProps, isSelected, isFocused } = useOption({ key: item.key }, state, ref);

  return (
    <li
      {...optionProps}
      ref={ref}
      className={cn('relative flex cursor-pointer justify-between py-1 pl-4 pr-10', {
        'bg-p-10 outline-none': isFocused,
        'bg-p-20 pr-3': isSelected,
      })}
    >
      {item.rendered}
      {isSelected ? <Checkmark className="ml-3 text-p-100" /> : null}
    </li>
  );
}
