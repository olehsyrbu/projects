import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useGPAProviders, useUserProvider } from '@/core/api/ProviderQueries';
import { AnalyticsPlaceholder } from '@/modules/dashlets/components';
import { MyResources } from '@/features/provider-dashboard/components/MyDashboard/MyProfiles/MyResources';
import { GroupPracticeAdminDashboardHeader } from '@/features/dashboard/components';

export function GroupPracticeAdminDashboard({ path }) {
  const navigate = useNavigate();
  const { data } = useGPAProviders();
  const [providerId, setProviderId] = useState(data?.items[0].id);
  const [provider, updateUserProvider] = useUserProvider(providerId);

  function handleEditProfile() {
    navigate(`${path}/edit/${providerId}`);
  }

  return (
    <div className="fade-in page-container flex  flex-col flex-wrap">
      <h1 className="!mt-3 mb-5">My dashboard</h1>
      <div className="flex flex-row">
        <div className="sm:mr-6">
          <MyResources
            gpaResourceType="gpa"
            provider={provider}
            onUserProvider={updateUserProvider}
            onEditProfile={handleEditProfile}
            renderHeader={() => (
              <GroupPracticeAdminDashboardHeader
                title="My resource:"
                provider={provider}
                providers={data.items}
                onChangeProvider={setProviderId}
              />
            )}
          />
        </div>
        <div className="right-column hidden flex-col justify-between sm:block">
          <AnalyticsPlaceholder />
        </div>
      </div>
    </div>
  );
}

GroupPracticeAdminDashboard.propTypes = {
  path: PropTypes.string,
};
GroupPracticeAdminDashboard.defaultProps = {
  path: '/group-practice/resources',
};
