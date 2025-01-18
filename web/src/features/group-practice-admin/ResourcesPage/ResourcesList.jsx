import { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkmark20Filled as Checkmark, Warning16Regular as Warning } from '@fluentui/react-icons';

import { Alert } from '@/core/components';
import { removePendingProvider, removeProviderFromGPA } from '@/core/api/ProviderQueries';
import { updateInvitation } from '@/core/api/InvitationAPI';

import { ChangeEditEmailDialog, ChangeResendDialog, DeleteProfileDialog } from './dialogs';
import { ResourceCard } from './ResourceCard';

export function ResourcesList({ providers, onChange }) {
  providers?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const [dialogsState, setDialogsState] = useState({
    email: '',
    id: '',
    providerId: '',
    statusResend: '',
    isOpenResendEmail: false,
    isOpenDeleteProfile: false,
    isOpenEditEmail: false,
    isProviderActivated: false,
  });

  async function handleDeleteProfile() {
    if (dialogsState.isProviderActivated) {
      await removeProviderFromGPA(dialogsState.providerId);
    } else {
      await removePendingProvider(dialogsState.providerId);
    }
    onChange();
    setDialogsState({
      ...dialogsState,
      isOpenDeleteProfile: false,
    });
  }

  function handleShowDeleteProfile(id, isProviderActivated) {
    setDialogsState({
      ...dialogsState,
      providerId: id,
      isOpenDeleteProfile: true,
      isProviderActivated,
    });
  }

  function handleHideDeleteProfile() {
    setDialogsState({
      ...dialogsState,
      isOpenDeleteProfile: false,
      isProviderActivated: false,
    });
  }

  async function handleEditInviteEmail() {
    onChange();
    setDialogsState({
      ...dialogsState,
      isOpenEditEmail: false,
    });
  }

  function handleHideEditInviteDialog() {
    setDialogsState({
      ...dialogsState,
      isOpenEditEmail: false,
    });
  }

  function handleShowEditInviteDialog({ id, email }) {
    setDialogsState({
      ...dialogsState,
      invitationId: id,
      invitationEmail: email,
      isOpenEditEmail: true,
    });
  }

  async function handleResendEmail() {
    try {
      await updateInvitation(
        dialogsState.invitationId,
        { email: dialogsState.invitationEmail },
        true,
      );
      setDialogsState({
        ...dialogsState,
        statusResend: 'success',
      });
    } catch (e) {
      setDialogsState({
        ...dialogsState,
        statusResend: 'failed',
      });
    }
  }

  function handleShowResendEmailDialog({ id, email }) {
    setDialogsState({
      ...dialogsState,
      invitationId: id,
      invitationEmail: email,
      isOpenResendEmail: true,
    });
  }

  function handleHideResendEmailDialog() {
    setDialogsState({
      ...dialogsState,
      isOpenResendEmail: false,
      statusResend: '',
    });
  }

  return (
    <>
      {dialogsState.isOpenEditEmail && (
        <ChangeEditEmailDialog
          isOpen={dialogsState.isOpenEditEmail}
          invitationEmail={dialogsState.invitationEmail}
          id={dialogsState.invitationId}
          onSubmit={handleEditInviteEmail}
          onDismiss={handleHideEditInviteDialog}
        />
      )}
      {dialogsState.isOpenResendEmail && (
        <ChangeResendDialog
          isOpen={dialogsState.isOpenResendEmail}
          onSubmit={handleResendEmail}
          onDismiss={handleHideResendEmailDialog}
          email={dialogsState.invitation?.email}
          disabledConfirm={!!dialogsState.statusResend}
        >
          {dialogsState.statusResend && (
            <>
              {dialogsState.statusResend === 'success' ? (
                <Alert
                  className="bg-green-100"
                  text="Invitation is sent"
                  iconClassesName="text-emerald-400"
                  icon={<Checkmark />}
                />
              ) : (
                <Alert
                  className="bg-warning-3"
                  text="Something went wrong. Please try again."
                  icon={<Warning />}
                />
              )}
            </>
          )}
        </ChangeResendDialog>
      )}
      <DeleteProfileDialog
        isOpen={dialogsState.isOpenDeleteProfile}
        onSubmit={handleDeleteProfile}
        onDismiss={handleHideDeleteProfile}
        isProviderActivated={dialogsState.isProviderActivated}
      />
      {providers.map((item) => (
        <ResourceCard
          profile={item}
          onChangeEmail={handleShowEditInviteDialog}
          onResendEmail={handleShowResendEmailDialog}
          onDeleteProfile={handleShowDeleteProfile}
        />
      ))}
    </>
  );
}

ResourcesList.propTypes = {
  providers: PropTypes.array,
  onChange: PropTypes.func,
};
