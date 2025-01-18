import cn from 'classnames';
import PropTypes from 'prop-types';
import { Handshake16Filled as Handshake } from '@fluentui/react-icons';
import { Tooltip } from '@/core/components/Tooltip';

export function PromotionBadge({ organization, className }) {
  const classWrapper = cn(
    `w-fit text-p-100 text-xs font-bold flex items-center bg-highlight rounded px-2 py-1 tool-tip-icon`,
    className,
  );

  const tooltipLabel =
    'MiResource partners with evidence-based organizations to bring you more care options.';

  return organization ? (
    <Tooltip
      label={tooltipLabel}
      offset={{ right: 90 }}
      className="!w-72 whitespace-pre-wrap"
      arrowPosition="start"
    >
      <div className={classWrapper} onClick={(e) => e.stopPropagation()}>
        <Handshake />
        <span className="ml-1">with {organization}</span>
      </div>
    </Tooltip>
  ) : null;
}

PromotionBadge.propTypes = {
  organization: PropTypes.string,
  className: PropTypes.string,
};

PromotionBadge.defaultProps = {
  organization: '',
};
