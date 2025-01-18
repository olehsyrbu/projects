import PropTypes from 'prop-types';
import cn from 'classnames';
import { Open24Regular as Open } from '@fluentui/react-icons';
import { Avatar } from './Avatar';

export function LinkAvatar({ url, className, linkHref, onClick, ...rest }) {
  const avatarClassNames = cn('rounded-full size-full', {
    'relative transition-all duration-200 group-hover:opacity-20': linkHref,
  });

  return (
    <a
      href={linkHref}
      className={cn('group relative block rounded-full object-cover size-12', className, {
        'hover:bg-p-120': linkHref,
      })}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
    >
      <Avatar url={url} className={avatarClassNames} aria-hidden="true" alt="" {...rest} />

      {linkHref && (
        <div className="absolute inset-0 flex items-center justify-center text-p-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Open />
        </div>
      )}
    </a>
  );
}

LinkAvatar.propTypes = {
  url: PropTypes.string,
  className: PropTypes.string,
  linkHref: PropTypes.string,
  onClick: PropTypes.func,
};
