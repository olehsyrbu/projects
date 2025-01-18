import { useState, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  ChevronDown20Filled as ChevronDown,
  ChevronUp20Filled as ChevronUp,
} from '@fluentui/react-icons';
import cn from 'classnames';

export function Description({ children }) {
  let ref = useRef();
  let [shouldCollapse, setShouldCollapse] = useState(false);
  let [collapsed, setCollapsed] = useState(true);

  let toggle = () => setCollapsed(!collapsed);

  useLayoutEffect(() => {
    let style = window.getComputedStyle(ref.current);
    let height = parseInt(style.height);
    let lineHeight = parseInt(style.lineHeight);

    setShouldCollapse(height / lineHeight > 8);
  }, []);

  return (
    <div className="mb-4 min-w-0 border-t border-graphics-30 pt-4 max-md:px-4">
      <p
        ref={ref}
        className={cn('whitespace-pre-line break-words text-sm', {
          'line-clamp-4': shouldCollapse && collapsed,
        })}
      >
        {children}
      </p>
      {shouldCollapse ? (
        <button className="mt-3 text-sm font-medium text-p-100" onClick={toggle}>
          {collapsed ? 'Show all' : 'Hide all'}
          {collapsed ? <ChevronDown className="ml-1" /> : <ChevronUp className="ml-1" />}
        </button>
      ) : null}
    </div>
  );
}

Description.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
