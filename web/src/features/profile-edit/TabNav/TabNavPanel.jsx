import PropTypes from 'prop-types';
import { TabHeader } from './TabHeader';

export function TabNavPanel({ children, heading }) {
  return (
    <div className="flex flex-col md:border-0 md:border-r md:border-solid md:border-graphics-30 md:py-6">
      <TabHeader>{heading}</TabHeader>
      {children}
    </div>
  );
}

TabNavPanel.propTypes = {
  heading: PropTypes.string,
  children: PropTypes.node.isRequired,
};
