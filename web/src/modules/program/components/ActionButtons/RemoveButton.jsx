import cn from 'classnames';
import PropTypes from 'prop-types';
import { Delete16Filled as Delete } from '@fluentui/react-icons';

export function RemoveButton({ children, className, showText, ...rest }) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        'flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border  border-solid border-p-100 font-sans text-base font-medium text-p-100 md:w-12',
        className,
      )}
    >
      <Delete className="m-0.5" />
      {showText && (
        <span className="md:hidden">
          <span className="ml-1">{children}</span>
        </span>
      )}
    </button>
  );
}

RemoveButton.propTypes = {
  className: PropTypes.string,
  showText: PropTypes.bool,
  children: PropTypes.node,
};

RemoveButton.defaultProps = {
  children: 'Remove',
  showText: true,
};
