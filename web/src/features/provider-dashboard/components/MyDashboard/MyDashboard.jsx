import { useNavigate, useParams } from 'react-router-dom';
import { useUserProvider } from '@/core/api/ProviderQueries';
import { SearchBar } from '@/modules/search/components';
import { toAdvancedSearchParams } from '@/modules/search/utils';
import { AnalyticsPlaceholder } from '@/modules/dashlets/components';
import { MyResources } from './MyProfiles/MyResources';
import { DeactivateNotice } from './DeactivateNotice';
import './MyDashboard.css';
import { useState } from 'react';
import mixpanel from '@/core/mixpanel';

export function MyDashboard() {
  const navigate = useNavigate();
  const { providerId } = useParams();
  const [provider, updateUserProvider] = useUserProvider(providerId);
  const id = providerId || provider.id;
  const [showDeactivate, setShowDeactivate] = useState(provider.deactivation.length > 0);

  function handleSearchRedirect(form) {
    const query = toAdvancedSearchParams(form);
    navigate(`/search?${query}`);
  }

  function handleEditProfile() {
    navigate(`/provider/resources/edit/${id}`);
  }

  function handleActivate() {
    setShowDeactivate(false);
    mixpanel.track('Update Provider', {
      availability: provider.availability,
      slug: provider.slug,
      status: provider.status,
      mode: provider.mode,
    });
  }

  return (
    <div id="myDashboard" className="fade-in">
      {showDeactivate &&
        provider.deactivation.map((item) => (
          <DeactivateNotice
            key={item.organization?.id}
            id={id}
            organization={item.organization?.name}
            onActivate={handleActivate}
          />
        ))}
      <h1 className="header-desktop mb-6 px-4 !text-2xl md:mt-8 md:px-0 md:!text-[2.5rem]">
        My dashboard
      </h1>
      <SearchBar onSubmit={handleSearchRedirect} />
      <div className="z-0 md:flex">
        <div className="md:mr-6">
          <MyResources
            title="My profile"
            provider={provider}
            onUserProvider={updateUserProvider}
            onEditProfile={handleEditProfile}
          />
        </div>
        <div className="right-column flex-col justify-between">
          <AnalyticsPlaceholder />
        </div>
      </div>
    </div>
  );
}
