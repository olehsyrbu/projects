/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions */
import PropTypes from 'prop-types';
import cn from 'classnames';
import { LinkAvatar } from '@/core/components';
import { noop } from '@/core/utils';
import './ResultCard.css';

export function ResultCard({
  id,
  photo,
  renderDetails,
  description,
  name,
  renderHeader,
  renderActions,
  renderQuickActions,
  onOpenProvider,
  distance,
  className,
  deactivated,
  hoveredProviderId,
  onHoverProvider,
  partner,
  mode,
  providerLink,
  onAvatarClick,
}) {
  const ProfileCardClasses = cn(
    'md:flex md:border p-4 bg-white md:rounded-2xl md:items-center',
    { deactivated },
    className,
    {
      '!border-p-120': hoveredProviderId === id,
    },
  );
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <article
      className={ProfileCardClasses}
      onClick={() => onOpenProvider(id, distance, mode, partner)}
      onKeyDown={() => onOpenProvider(id, distance, mode)}
      onMouseEnter={() => onHoverProvider(id)}
      onMouseLeave={() => onHoverProvider(null)}
    >
      <div className="relative md:flex-1 md:pl-[60px]">
        {renderHeader && <div className="info">{renderHeader()}</div>}

        <div className="flex max-md:items-center">
          <LinkAvatar
            className="max-md:mr-3 md:absolute md:left-0"
            url={photo.src}
            linkHref={providerLink}
            onClick={onAvatarClick}
          />
          {name && <h3 className="text-xl font-bold">{name}</h3>}
        </div>

        {description && <p className="mt-2">{description}</p>}

        {renderDetails && <div className="mt-2 flex flex-wrap">{renderDetails()}</div>}
      </div>

      <div>
        {renderActions && (
          <div
            className="border-light max-md:-mx-4 max-md:mt-4 max-md:border-t"
            onClick={stopPropagation}
            onKeyDown={stopPropagation}
          >
            {renderActions()}
          </div>
        )}
        {renderQuickActions && (
          <div className="quick-actions" onClick={stopPropagation} onKeyDown={stopPropagation}>
            {renderQuickActions()}
          </div>
        )}
      </div>
    </article>
  );
}

ResultCard.propTypes = {
  renderHeader: PropTypes.func,
  photo: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
  }),
  name: PropTypes.string,
  mode: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
  renderDetails: PropTypes.func,
  renderActions: PropTypes.func,
  onOpenProvider: PropTypes.func,
  distance: PropTypes.string,
  deactivated: PropTypes.bool,
  id: PropTypes.string,
  renderQuickActions: PropTypes.func,
  onHoverProvider: PropTypes.func,
  hoveredProviderId: PropTypes.string,
  partner: PropTypes.object,
  providerLink: PropTypes.string,
  onAvatarClick: PropTypes.func,
};

ResultCard.defaultProps = {
  photo: {
    src: '',
    alt: '',
  },
  name: '',
  description: '',
  renderDetails: noop,
  onOpenProvider: noop,
  onHoverProvider: noop,
  mode: '',
  deactivated: false,
};
