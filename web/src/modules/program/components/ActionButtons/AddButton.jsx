import cn from 'classnames';
import PropTypes from 'prop-types';
import { AddCircle24Filled as AddCircle } from '@fluentui/react-icons';

export function AddButton({ children, className, ...rest }) {
  const classNames = cn(
    'm-0 h-12 md:h-6 w-full md:w-fit flex space-x-2 items-center justify-center md:bg-transparent rounded-lg md:rounded-none border-0 text-white md:text-p-100 bg-p-100 p-0 py-px font-sans text-p-100 ',
    className,
  );
  return (
    <button type="button" className={classNames} {...rest}>
      <AddCircle />
      <span className="align-middle text-base font-medium">{children}</span>
    </button>
  );
}

AddButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
