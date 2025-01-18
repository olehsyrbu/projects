import { MeterCircle } from '@/core/components/Meter';
import PropTypes from 'prop-types';

export function TabLinkItem({ title, icon, percent, color, backgroundColor }) {
  const SvgIcon = icon;
  return (
    <div className="grid w-full grid-cols-[2rem_1fr_2rem] items-center">
      <SvgIcon className="text-graphics-70" />
      <p>{title}</p>
      <span className="mr-6 h-8">
        <MeterCircle id={`${title}ProgressCircle`} value={percent} />
      </span>
    </div>
  );
}

TabLinkItem.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  icon: PropTypes.element,
  percent: PropTypes.number,
};

TabLinkItem.defaultProps = {
  title: '',
  percent: 50,
  color: '#7b97bc',
  backgroundColor: '#f2f5f8',
};
