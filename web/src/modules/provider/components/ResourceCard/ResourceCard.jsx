import { LinkAvatar } from '@/core/components';
import PropTypes from 'prop-types';
import cn from 'classnames';

export function ResourceCard({
  className,
  photo,
  renderDetails,
  renderActions,
  renderSubDetails,
  renderName,
  providerLink,
}) {
  const classNameWrapper = cn(
    'border border-solid border-l-0 border-r-0 border-b-0 border-graphics-30 hover:border-graphics-100 bg-white p-4 ' +
      'lg:border lg:mb-6 lg:rounded-2xl lg:shadow-[0_12px_20px_rgba(0,_0,_0,_0.05)] lg:overflow-hidden lg:mx-auto',
    {
      [className]: className,
    },
  );

  const classesRenderName =
    'flex items-center col-start-2 col-end-4 pl-3 font-bold text-lg lg:col-end-3';
  const classesRenderDetails =
    'text-heading grid grow gap-y-2 col-start-1 col-end-13 mt-2 items-center w-full' +
    ' lg:col-start-2 lg:col-end-3 lg:pl-3 lg:flex lg:flex-row';
  const classesRenderSubDetails =
    'text-xs mt-4 mb-2 gap-y-2 col-start-1 col-end-13 flex flex-wrap lg:pl-3 lg:col-start-2 lg:col-end-3';
  const classesRenderActions =
    'pt-3 mt-3 lg:mt-0 border-t-1 border border-l-0 border-r-0 border-b-0 border-solid\n ' +
    'lg:border col-start-1 col-end-4 justify-between flex lg:justify-end lg:items-center\n ' +
    'g:col-start-2 lg:border-none lg:col-start-3 lg:row-span-3 lg:pt-0';

  return (
    <article className={classNameWrapper}>
      <div className="grid grid-flow-col grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_8rem]">
        <div className="lg:row-span-3">
          <LinkAvatar url={photo?.src} linkHref={providerLink} />
        </div>
        {renderName && <h2 className={classesRenderName}>{renderName()}</h2>}
        {renderDetails && renderDetails() && (
          <div className={classesRenderDetails}>{renderDetails()}</div>
        )}
        {renderSubDetails && renderSubDetails() && (
          <div className={classesRenderSubDetails}>{renderSubDetails()}</div>
        )}
        {renderActions && renderActions() && (
          <div className={classesRenderActions}>{renderActions()}</div>
        )}
      </div>
    </article>
  );
}

ResourceCard.propTypes = {
  photo: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
  }),
  className: PropTypes.string,
  renderName: PropTypes.func,
  renderDetails: PropTypes.func,
  renderActions: PropTypes.func,
  renderSubDetails: PropTypes.func,
  providerLink: PropTypes.string,
};
