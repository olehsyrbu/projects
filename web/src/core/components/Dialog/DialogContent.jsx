import PropTypes from 'prop-types';
import cx from './Dialog.module.css';
import cn from 'classnames';

export function DialogContent({ children, className }) {
  return (
    <div data-testid="dialog-content" className={cn(cx.content, className)}>
      {children}
    </div>
  );
}

DialogContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
