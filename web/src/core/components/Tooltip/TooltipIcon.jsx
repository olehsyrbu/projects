import { Info24Regular as Info } from '@fluentui/react-icons';
import { Tooltip } from '@/core/components/Tooltip';
import PropTypes from 'prop-types';
import { useScreen } from '@/core/hooks';

export function TooltipIcon({ label, size, classNameIcon, place, ...rest }) {
  const isMediumScreen = useScreen('md');

  return (
    <Tooltip
      className={isMediumScreen ? 'max-w-sm' : 'max-w-xs'}
      label={label}
      place={place}
      {...rest}
    >
      <Info
        className={`inline-block text-p-100 ${classNameIcon}`}
        onClick={(e) => e.preventDefault()}
      />
    </Tooltip>
  );
}

TooltipIcon.propTypes = {
  ...Tooltip.propTypes,
  classNameIcon: PropTypes.string,
};

TooltipIcon.defaultProps = {
  label: '',
  size: 24,
  place: 'top',
};
