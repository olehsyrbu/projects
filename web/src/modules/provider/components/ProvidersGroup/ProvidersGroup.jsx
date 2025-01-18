import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from '@/core/utils';

import mixpanel from '@/core/mixpanel';
import { removeProviderAccess, updateProvider } from '@/core/api/ProviderQueries';
import { ProviderCard } from './ProviderCard';
import { DeactivateDialog } from './DeactivateDialog';
import { SharedDialog } from './SharedDialog';
import './ProvidersGroup.css';
import { DeleteProfileDialog } from '@/features/group-practice-admin/ResourcesPage/dialogs';
import { logger } from '@/core/logger';
import { toast } from '@/core/components/Toast';

export function ProvidersGroup({ providers, onEdit, refetchUser }) {
  const [stateProvider, setStateProvider] = useState({
    showSharedDialog: false,
    showDeactivate: false,
    showDeleteProfile: false,
    providerId: null,
  });
  const [providersList, setProvidersList] = useState(providers);

  useEffect(() => {
    setProvidersList(providers);
  }, [providers]);

  function handlerEdit(slug) {
    onEdit(slug);
  }

  function handleCardDeactivate(provider) {
    setStateProvider({
      ...stateProvider,
      ...provider,
      showDeactivate: true,
    });
  }

  function handleCloseDeactivate() {
    setStateProvider({
      ...stateProvider,
      showDeactivate: false,
    });
  }

  async function handleDeactivate() {
    const provider = await updateProvider(stateProvider.id, { active: false });
    setStateProvider({
      ...stateProvider,
      showDeactivate: false,
    });
    const updatedProviders = providersList.map((item) =>
      item.id === stateProvider.id ? provider : item,
    );
    setProvidersList(updatedProviders);
    mixpanel.track('Deactivate provider', { id: stateProvider.id });
  }

  async function handleActivate(id) {
    const provider = await updateProvider(id, { active: true });
    const updatedProviders = providersList.map((item) => (item.id === id ? provider : item));
    setProvidersList(updatedProviders);
    mixpanel.track('Activate provider', { id: stateProvider.id });
  }

  function handleShowSharedAccess(provider) {
    setStateProvider({
      ...stateProvider,
      ...provider,
      showSharedDialog: true,
    });
  }

  function handleCloseSharedAccess() {
    setStateProvider({
      ...stateProvider,
      showSharedDialog: false,
    });
  }

  function handleCloseDeleteProfile() {
    setStateProvider({
      ...stateProvider,
      showDeleteProfile: false,
    });
  }

  async function handleDeleteAccess(id) {
    setStateProvider({
      ...stateProvider,
      providerId: id,
      showDeleteProfile: true,
    });
  }

  async function submitDeleteAccess() {
    try {
      await removeProviderAccess(stateProvider.providerId);
      await refetchUser();

      setStateProvider({
        ...stateProvider,
        showDeleteProfile: false,
        providerId: null,
      });
    } catch (error) {
      toast.warning(`Failed to delete provider access`);
      logger.error(error);
    }
  }

  return (
    <div className="myResources max-w-5xl">
      {providersList.length ? (
        <h3 className="mb-3 ml-4 text-2xl font-bold md:ml-0">Providers</h3>
      ) : null}
      <ul>
        {providersList.map((card) =>
          card ? (
            <ProviderCard
              key={card.id}
              card={card}
              onEdit={handlerEdit}
              onDeactivate={handleCardDeactivate}
              onActivate={handleActivate}
              onSharedAccess={handleShowSharedAccess}
              onDeleteAccess={handleDeleteAccess}
            />
          ) : null,
        )}
      </ul>
      <SharedDialog
        sharedWith={stateProvider.sharedWith}
        open={stateProvider.showSharedDialog}
        onSubmit={handleCloseSharedAccess}
        onClose={handleCloseSharedAccess}
      />
      <DeactivateDialog
        onDeactivate={handleDeactivate}
        onClose={handleCloseDeactivate}
        open={stateProvider.showDeactivate}
      />

      <DeleteProfileDialog
        isOpen={stateProvider.showDeleteProfile}
        onSubmit={submitDeleteAccess}
        onDismiss={handleCloseDeleteProfile}
        isProviderActivated
      />
    </div>
  );
}

ProvidersGroup.propTypes = {
  providers: PropTypes.array,
  onEdit: PropTypes.func,
  refetchUser: PropTypes.func,
};

ProvidersGroup.defaultProps = {
  providers: [],
  onEdit: noop,
};
