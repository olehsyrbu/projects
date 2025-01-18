import { Children, cloneElement, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import cn from 'classnames';
import { uniqueId } from 'lodash-es';
import { useEventListener } from '@/core/hooks';

export function Tooltip({ label, children, place, className, arrowPosition, id, ...rest }) {
  const child = Children.only(children);

  const handleHide = () => ReactTooltip.hide();
  useEventListener(window, 'resize', handleHide);
  useEventListener(window, 'scroll', handleHide, true);

  const tooltipId = useMemo(() => id || uniqueId('tooltip'), [id]);

  const tooltipStyles =
    '!text-sm !leading-normal !opacity-100 !font-normal !border-0 !rounded-lg !p-2.5 drop-shadow-[0_4px_10px_rgba(0,0,0,0.18)]';

  const sidePosition = ['right', 'left'].includes(place);
  const arrowStyles = {
    start: sidePosition ? 'after:!top-1/4' : 'after:!left-1/4',
    end: sidePosition ? 'after:!top-3/4' : 'after:!left-3/4',
    center: '',
  };

  const clWrapper = cn(tooltipStyles, arrowStyles[arrowPosition], className);

  return (
    <>
      {cloneElement(child, { 'data-tip': label, 'data-for': tooltipId })}
      <ReactTooltip
        id={tooltipId}
        place={place}
        effect="solid"
        clickable
        textColor="var(--text-regular)"
        backgroundColor="var(--background)"
        data-event="click focus"
        className={clWrapper}
        multiline
        role="tooltip"
        {...rest}
      />
    </>
  );
}

Tooltip.propTypes = {
  ...ReactTooltip.propTypes,
  label: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  place: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  className: PropTypes.string,
  arrowPosition: PropTypes.oneOf(['start', 'end', 'center']),
  id: PropTypes.string,
};

Tooltip.defaultProps = {
  label: '',
  place: 'bottom',
  arrowPosition: 'center',
};
