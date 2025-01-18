import cn from 'classnames';
import PropTypes from 'prop-types';
import { Eraser20Filled as Eraser } from '@fluentui/react-icons';

export function ClearButton({ children, className, ...rest }) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        'flex h-12 w-full cursor-pointer items-center justify-center space-x-2 rounded-lg border  border-solid border-p-100 font-sans text-base font-medium text-p-100 md:w-12',
        className,
      )}
    >
      <Eraser size={24} />
      <span className="sm:hidden">{children}</span>
    </button>
  );
}

ClearButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

ClearButton.defaultProps = {
  children: 'Clear',
};
