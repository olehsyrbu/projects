import './ProviderDashboardWrapper.css';
import PropTypes from 'prop-types';

export function ProviderDashboardWrapper({ children }) {
  return (
    <div id="providerWrapper">
      <div id="providerDashboard" className="row">
        {children}
      </div>
    </div>
  );
}

ProviderDashboardWrapper.propTypes = {
  children: PropTypes.node,
};
