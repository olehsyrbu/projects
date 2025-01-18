import PropTypes from 'prop-types';
import { useScreen } from '@/core/hooks';
import { DesktopSelect } from './components/DesktopSelect';
import { MobileSelect } from './components/MobileSelect';
import { groupBy } from 'lodash-es';
import './react-select.css';

export function Select(props) {
  const isMediumScreen = useScreen('md');
  let options = props.options;

  if (props.options?.some((opt) => opt.group)) {
    options = groupOptions(props.options);
  }

  const Component = isMediumScreen ? DesktopSelect : MobileSelect;
  return <Component {...props} options={options} />;
}

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape()),
};

function groupOptions(options) {
  const groups = groupBy(
    options.filter((opt) => opt.group),
    'group',
  );
  const groupedOptions = Object.entries(groups).map(([label, options]) => ({ label, options }));

  return [...options.filter((opt) => !opt?.group), ...groupedOptions];
}
