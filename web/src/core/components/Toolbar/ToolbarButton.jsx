import PropTypes from 'prop-types';
import { useFocusManager } from 'react-aria';
import cn from 'classnames';

export function ToolbarButton({ selected, ...rest }) {
  let focusManager = useFocusManager();

  const btnClassName =
    'flex-1 items-center justify-center  font-sans text-sm px-6 h-12 md:h-8 cursor-pointer bg-white text-p-100 !m-0 ' +
    'border-solid border-0 border-p-100 border-l border-1 ' +
    'first:border-l-0 first:rounded-l-[1.5rem] last:rounded-r-[1.5rem] ' +
    'focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-p-100 ' +
    'hover:outline-none hover:ring-inset hover:ring-offset-0 hover:ring-1 hover:ring-p-100  ';

  let className = cn(btnClassName, {
    '!bg-p-100 text-white focus-visible:bg-p-75 hover:!bg-p-75 border-white ': selected,
  });

  let onKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowRight':
        focusManager.focusNext({ wrap: true });
        break;
      case 'ArrowLeft':
        focusManager.focusPrevious({ wrap: true });
        break;
    }
  };

  return (
    <button
      {...rest}
      className={className}
      aria-pressed={selected}
      type="button"
      onKeyDown={onKeyDown}
    />
  );
}

ToolbarButton.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
  className: PropTypes.string,
  selected: PropTypes.bool,
};
