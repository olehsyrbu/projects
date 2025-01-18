import PropTypes from 'prop-types';
import { ProviderDashlet } from '@/modules/dashlets/components';
import './MyResources.css';

export function MyResources({
  gpaResourceType,
  title,
  provider,
  onUserProvider,
  renderHeader,
  onEditProfile,
}) {
  return (
    <div id="myProfiles" className="column dashboard-module min-h-[39.5rem] w-[30rem] !rounded-xl">
      {renderHeader ? (
        renderHeader()
      ) : (
        <div className="header px-6">
          <h2 className="font-bold">{title}</h2>
        </div>
      )}
      <ProviderDashlet
        gpaResourceType={gpaResourceType}
        onSave={onUserProvider}
        provider={provider}
        onEditProvider={onEditProfile}
      />
    </div>
  );
}

MyResources.propTypes = {
  gpaResourceType: PropTypes.string,
  title: PropTypes.string,
  provider: PropTypes.shape({
    availability: PropTypes.shape({
      status: PropTypes.string,
    }),
  }),
  renderHeader: PropTypes.func,
  onUserProvider: PropTypes.func,
  onEditProfile: PropTypes.func,
};
