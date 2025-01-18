import PropTypes from 'prop-types';
import cn from 'classnames';
import './Badge.css';

export function Badge({ icon, label, className, labelClasses, children }) {
  const clWrapper = cn(className, 'mir-badge');
  const clLabelWrapper = cn(labelClasses, 'mir-badge-label');

  return (
    <span className={clWrapper}>
      <span className="mir-badge-icon">{icon}</span>
      <span className={clLabelWrapper}>{label}</span>
      {children && <span>{children}</span>}
    </span>
  );
}

Badge.propTypes = {
  label: PropTypes.any,
  labelClasses: PropTypes.string,
  icon: PropTypes.element,
  className: PropTypes.string,
  children: PropTypes.node,
};
