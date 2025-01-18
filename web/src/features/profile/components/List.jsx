/* eslint-disable jsx-a11y/no-redundant-roles */

import { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {
  CheckmarkCircle20Filled as CheckmarkCircle,
  ChevronDown20Filled as ChevronDown,
  ChevronUp20Filled as ChevronUp,
} from '@fluentui/react-icons';

function useListState({ items, threshold = 6, limit = 3, sort }) {
  let shouldCollapse = threshold !== false && items.length > threshold;
  let [expanded, setExpanded] = useState(false);

  items = items.map((item, index) => ({
    ...item,
    hidden: shouldCollapse && !expanded && index + 1 > limit,
  }));

  return {
    items,
    expanded,
    shouldCollapse,
    toggle: () => setExpanded(!expanded),
  };
}

export function List(props) {
  let state = useListState(props);

  return (
    <div>
      <ul role="list">
        {state.items.map((item) => (
          <li key={item.id} className={cn({ 'sr-only': item.hidden })}>
            {item.name}
          </li>
        ))}
      </ul>
      <ToggleButton {...state} />
    </div>
  );
}

export function ChipList(props) {
  let state = useListState(props);

  return (
    <div>
      <ul role="list" className="flex flex-wrap gap-2">
        {state.items.map((item) => (
          <li
            key={item.id}
            className={cn('inline-block rounded-full bg-chip px-4 py-[3px] text-sm', {
              'sr-only': item.hidden,
            })}
          >
            {item.name}
          </li>
        ))}
      </ul>
      <ToggleButton {...state} />
    </div>
  );
}

export function DotList(props) {
  let state = useListState(props);

  return (
    <div>
      <ul role="list" className="flex flex-wrap gap-y-1">
        {state.items.map((item, index) => (
          <li
            key={item.id}
            className={cn('inline-flex h-[22px] items-center whitespace-nowrap', {
              'sr-only': item.hidden,
            })}
          >
            {item.name}
            {state.items[index + 1]?.hidden === false ? <Dot /> : null}
          </li>
        ))}
      </ul>
      <ToggleButton {...state} />
    </div>
  );
}

export function CheckList({ 'aria-label': ariaLabel, ...rest }) {
  let state = useListState(rest);

  return (
    <div>
      <ul aria-label={ariaLabel} role="list" className="space-y-1">
        {state.items.map((item) => (
          <li key={item.id} className={cn('flex items-center', { 'sr-only': item.hidden })}>
            <CheckmarkCircle className="mr-2 flex-none" />
            {item.name}
          </li>
        ))}
      </ul>
      <ToggleButton {...state} />
    </div>
  );
}

function ToggleButton({ shouldCollapse, expanded, toggle }) {
  if (!shouldCollapse) {
    return null;
  }

  return (
    <button className="mt-3 flex items-center text-sm font-medium text-p-100" onClick={toggle}>
      {expanded ? 'Hide all' : 'Show all'}
      {expanded ? <ChevronUp className="ml-1" /> : <ChevronDown className="ml-1" />}
    </button>
  );
}

function Dot() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

CheckList.propTypes = {
  'aria-label': PropTypes.string,
};
ToggleButton.propTypes = {
  expanded: PropTypes.bool.isRequired,
  shouldCollapse: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
