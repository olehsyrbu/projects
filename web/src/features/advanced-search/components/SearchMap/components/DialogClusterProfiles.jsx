import PropTypes from 'prop-types';
import { Suspense } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import { Dismiss24Filled as Dismiss } from '@fluentui/react-icons';
import { ProviderCard } from '@/features/advanced-search/components/SearchResults/ProviderCard';
import './DialogClusterProfiles.css';

export function DialogClusterProfiles({ handleClose, handleOpenProfile, clusterProfiles }) {
  return (
    <DialogOverlay className="clusterProfile" isOpen onDismiss={handleClose} cl>
      <DialogContent className="clusterProfileContent">
        <h2 className="header">
          {clusterProfiles.length} providers in this location
          <button aria-label="Close" className="close-button" onClick={handleClose}>
            <Dismiss />
          </button>
        </h2>
        <div className="clusterProfileWrapper AdvancedSearch">
          <div className="listProfiles mt-4 space-y-4">
            <Suspense fallback={null}>
              {clusterProfiles.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onClick={() => {
                    const { slug, mode, distance, partner, status } = provider;
                    handleOpenProfile(slug, distance, mode, partner, status);
                  }}
                />
              ))}
            </Suspense>
          </div>
        </div>
      </DialogContent>
    </DialogOverlay>
  );
}

DialogClusterProfiles.propTypes = {
  handleClose: PropTypes.func,
  handleOpenProfile: PropTypes.func,
  clusterProfiles: PropTypes.array,
};
