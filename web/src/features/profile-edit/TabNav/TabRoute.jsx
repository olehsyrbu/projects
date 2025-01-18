import PropTypes from 'prop-types';
import { TabHeader } from './TabHeader';

export function TabRoute({ children, heading }) {
  return (
    <>
      <TabHeader>{heading}</TabHeader>
      <div className="flex-1 p-6">{children}</div>
      {/*Provide a placeholder for actions portal*/}
      <div id="edit-actions" className="sticky bottom-0" />
    </>
  );
}

TabRoute.propTypes = {
  heading: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
