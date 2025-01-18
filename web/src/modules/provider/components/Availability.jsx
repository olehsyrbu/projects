import PropTypes from 'prop-types';
import cn from 'classnames';
import {
  CheckmarkCircle16Filled as CheckmarkCircle,
  QuestionCircle16Filled as QuestionCircle,
  DismissCircle16Filled as DismissCircle,
} from '@fluentui/react-icons';

export function Availability({ status, className }) {
  let Icon = QuestionCircle;
  let text = 'Please inquire';
  let style = 'bg-[#fff8e4] text-[#6b3a00]';

  if (status === 'ACCEPTING_NEW_CLIENTS') {
    Icon = CheckmarkCircle;
    text = 'Accepting clients';
    style = 'bg-[#e6f6f7] text-[#007089]';
  }

  if (status === 'NOT_ACCEPTING_NEW_CLIENTS') {
    Icon = DismissCircle;
    text = 'Not accepting clients';
    style = 'bg-n-20 text-regular';
  }

  return (
    <div
      className={cn(
        'inline-flex h-[22px] items-center whitespace-nowrap rounded-full pl-2 pr-3 text-sm font-medium',
        style,
        className,
      )}
    >
      <Icon className="mr-1" />
      <span className="sr-only">Availability:</span>
      {text}
    </div>
  );
}

Availability.propTypes = {
  className: PropTypes.string,
  status: PropTypes.oneOf(['ACCEPTING_NEW_CLIENTS', 'NOT_ACCEPTING_NEW_CLIENTS', 'PLEASE_INQUIRE']),
};

Availability.defaultProps = {
  status: 'PLEASE_INQUIRE',
};
