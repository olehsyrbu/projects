import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthContext } from '@/modules/auth';
import {
  removeProviderFromOrganization,
  removePendingProvider,
  removeProviderFromGPA,
} from '@/core/api/ProviderQueries';
import { first } from 'lodash-es';
import { useScreen } from '@/core/hooks';
import { toast } from '@/core/components/Toast';
import { exportProvidersFile } from '@/core/api/ProviderAPI';
import { logger } from '@/core/logger';

import { GridList, Item, GridListControls } from './GridList';
import { Card } from './Card';
import { Toolbar } from './Toolbar';
import { DeleteDialog } from './DeleteDialog';
import { AddResourcesMenu } from './AddResourcesMenu';
import { InvitationDialog } from './InvitationDialog';
import { LoadingDialog } from '@/features/resources/LoadingDialog';

export function ResourcesList({ providers, totalItems, onChange }) {
  const isMediumScreen = useScreen('md');
  const navigate = useNavigate();
  let { user } = useAuthContext();

  const [selectedItems, setSelectedItems] = useState([]);

  providers.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const [dialogsState, setDialogsState] = useState({
    invitationProfile: null,
    name: '',
    count: 0,
    isOpenDelete: false,
    isOpenRemove: false,
    isOpenGenerateInvites: false,
    isExporting: false,
  });

  function handleGenerateInvites(invitationProfile) {
    setDialogsState({ ...dialogsState, isOpenGenerateInvites: true, invitationProfile });
  }

  async function handleExport(ids) {
    function download(url) {
      return fetch(url).then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw Error('Failed download');
        }
      });
    }

    try {
      const { url } = await exportProvidersFile(ids);

      setDialogsState({
        ...dialogsState,
        isExporting: true,
      });

      const blob = await download(url);

      let a = document.createElement('a');
      document.body.appendChild(a);

      let href = URL.createObjectURL(blob);
      a.href = href;
      a.download = 'providers.json';

      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(href);
    } catch (e) {
      toast.warning('Failed to export');
    }

    setDialogsState({
      ...dialogsState,
      isExporting: false,
    });
  }

  function updateSelectionAndMutateState(profiles) {
    const profileIdsToRemove = new Set(profiles.map((p) => p.id));
    onChange();

    if (selectedItems.length > 0 && selectedItems !== 'all') {
      const newSelectedItems = selectedItems.filter(
        (selectedId) => !profileIdsToRemove.has(selectedId),
      );
      setSelectedItems(newSelectedItems);
    }
  }

  async function handleDeleteSelectedProfiles() {
    let profilesToRemove;

    if (dialogsState?.count > 1) {
      profilesToRemove = selectedProviders;
    } else if (dialogsState?.isOpenDelete && dialogsState.profileId) {
      profilesToRemove = [{ id: dialogsState.profileId }];
    }

    await Promise.all(
      profilesToRemove.map((profile) =>
        removeProviderBasedOnStatus(profile, user?.organization?.id),
      ),
    );

    updateSelectionAndMutateState(profilesToRemove);
    handleCloseDialog();
  }

  async function removeProviderBasedOnStatus({ id, status }, orgId) {
    try {
      if (status === 'COMPLETED') {
        await removeCompletedProfile(id, orgId);
      } else {
        await removePendingProvider(id);
      }
    } catch (error) {
      logger.error(`Error removing provider with ID ${id}:`, error);
    }
  }

  async function removeCompletedProfile(id, orgId) {
    await removeProviderFromGPA(id);
    if (orgId) {
      await removeProviderFromOrganization(orgId, id);
    }
  }

  function handleCloseDialog() {
    setDialogsState({
      ...dialogsState,
      invitationProfile: null,
      name: '',
      count: 0,
      isOpenDelete: false,
      isOpenRemove: false,
      isOpenGenerateInvites: false,
    });
  }

  async function handleCopyInvite(invitationCode) {
    await navigator.clipboard
      .writeText(`${window.location.origin}/invite/${invitationCode}`)
      .then(() => {
        toast.success(`Copied to clipboard`);
      });
  }

  function handleMenuAction(actionType) {
    switch (actionType) {
      case 'generateInvites':
        return handleGenerateInvites();
      case 'exportAll':
        return handleExport();
      default:
        return null;
    }
  }

  function handleProfileAction(actionType, profile) {
    switch (actionType) {
      case 'edit':
        return navigate(`/resources/edit/${profile.id}`);
      case 'generateInvite':
        return handleGenerateInvites(profile);
      case 'copyInvitation':
        return handleCopyInvite(profile?.invitation?.invitationCode);
      case 'exportProvider':
        return handleExport({ ids: [profile.id] });
      case 'delete':
        return setDialogsState({
          ...dialogsState,
          profileId: profile?.id,
          name: profile?.legalName,
          isOpenDelete: true,
        });
      case 'remove':
        return setDialogsState({
          ...dialogsState,
          profileId: profile?.id,
          name: profile?.legalName,
          isOpenRemove: true,
        });
      default:
        return null;
    }
  }

  function handleSelectedAction(actionType) {
    switch (actionType) {
      case 'export':
        return handleExport({
          ids: selectedItems === 'all' ? providers.map(({ id }) => id) : selectedItems,
        });
      case 'generateInvites':
        return handleGenerateInvites();
      case 'copyInvitation':
        return handleCopyInvite(first(selectedProviders).invitation?.invitationCode);
      case 'remove':
        return setDialogsState({
          ...dialogsState,
          count: selectedItems.length,
          name: first(selectedProviders)?.legalName,
          isOpenRemove: true,
        });
      case 'delete':
        return setDialogsState({
          ...dialogsState,
          count: selectedItems.length,
          name: first(selectedProviders)?.legalName,
          isOpenDelete: true,
        });
      default:
        return null;
    }
  }

  const selectedProviders =
    selectedItems === 'all' ? providers : providers.filter(({ id }) => selectedItems.includes(id));

  return (
    <>
      {dialogsState?.isExporting && <LoadingDialog text="We are exporting providers" />}
      {dialogsState?.isOpenGenerateInvites && (
        <InvitationDialog
          profile={dialogsState.invitationProfile}
          selectedProfiles={selectedItems}
          allProfiles={providers}
          onCloseDialog={() => {
            handleCloseDialog();
            onChange();
          }}
        />
      )}
      <DeleteDialog
        state={dialogsState}
        onSubmit={handleDeleteSelectedProfiles}
        onDismiss={handleCloseDialog}
      />
      <div className="mb-6">
        <div className="hidden flex-col items-center justify-between px-12 pb-6 pt-6 md:flex md:flex-row">
          <GridListControls
            onSelectAll={() => setSelectedItems('all')}
            onClear={() => setSelectedItems([])}
            selectedItems={selectedItems}
            totalItems={totalItems}
          />
          <Toolbar onClick={handleSelectedAction} providers={selectedProviders} />
          <AddResourcesMenu onMenuAction={handleMenuAction} />
        </div>
      </div>
      <GridList
        className="md:space-y-6 md:!px-12"
        aria-label="List with selection"
        selectedKeys={selectedItems}
        onSelectionChange={(ids) => setSelectedItems([...ids])}
        selectionMode={isMediumScreen ? 'multiple' : 'none'}
        items={providers}
      >
        {(item) => (
          <Item key={item.id} id={item.id}>
            {({ isSelected }) => (
              <Card
                isSelected={isSelected}
                onProfileAction={(actionType) => handleProfileAction(actionType, item)}
                profile={item}
              />
            )}
          </Item>
        )}
      </GridList>
    </>
  );
}
