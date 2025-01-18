import PropTypes from 'prop-types';
import cn from 'classnames';

export function Alert({ text, icon, className, iconClassesName }) {
  const classes = cn('py-2 px-3 rounded-lg inline-flex', className);

  const iconClasses = cn('items-center inline-flex mr-2', {
    [iconClassesName]: iconClassesName,
  });

  return (
    <div className={classes}>
      <span className={iconClasses}>{icon}</span>
      <div className="flex flex-col text-sm font-normal">{text}</div>
    </div>
  );
}

Alert.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconClassesName: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.node,
};
Alert.defaultProps = {
  text: '',
};
