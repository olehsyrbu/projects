import PropTypes from 'prop-types';
import cn from 'classnames';

export function Avatar({ url, className, ...rest }) {
  const classNames = cn('rounded-full object-cover size-12', className);
  return url ? (
    <img src={url} className={classNames} aria-hidden="true" alt="" {...rest} />
  ) : (
    <AvatarSvg aria-hidden="true" className={classNames} {...rest} />
  );
}

function AvatarSvg(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
      <circle cx="24" cy="24" r="24" fill="var(--p-10)" />
      <path
        fill="var(--p-55)"
        d="M31 26a3 3 0 0 1 3 3v.715C34 33.292 29.79 36 24 36s-10-2.567-10-6.285V29a3 3 0 0 1 3-3h14Zm-7-14a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"
      />
    </svg>
  );
}

Avatar.propTypes = {
  url: PropTypes.string,
  className: PropTypes.string,
};
