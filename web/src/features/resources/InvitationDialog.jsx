import { useState, useEffect } from 'react';
import { createInvitations, batchInvites } from '@/core/api/InvitationQueries';
import { InvitationTypes } from '@/core/definitions';
import { useOrganization } from '@/modules/organization';
import { toast } from '@/core/components/Toast';
import { generateExportInvitationURL } from '@/core/api/InvitationQueries';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LoadingDialog } from './LoadingDialog';

export function InvitationDialog({ profile, selectedProfiles, allProfiles, onCloseDialog }) {
  const [invitationsReport, setInvitationsReport] = useState(null);
  const organization = useOrganization();
  const isSelectedAll = selectedProfiles.length === 0 || selectedProfiles === 'all';

  useEffect(() => {
    generateInvitation();
  }, []);

  function prepareProfileInvitation(profile) {
    const { email, legalName, id } = profile || {};
    return {
      recipient_name: legalName || '',
      email,
      type: InvitationTypes.Provider,
      message_type: email ? 'EMAIL' : 'SMS',
      organization_id: organization?.id,
      do_send_invitation: false,
      provider_id: id,
    };
  }

  function mapSelectedProfilesToInvitations() {
    const providerMap = new Map(allProfiles.map((item) => [item.id, item]));
    return selectedProfiles.reduce((acc, id) => {
      const provider = providerMap.get(id);
      if (provider && provider.id) {
        acc.push(prepareProfileInvitation(provider));
      }
      return acc;
    }, []);
  }

  async function handleGenerateInvitesForSingle(profile) {
    return await createInvitations([prepareProfileInvitation(profile)]);
  }

  async function handleGenerateInvitesForMany() {
    const invitations = mapSelectedProfilesToInvitations();
    return await createInvitations(invitations);
  }

  function decideInviteGenerationMethod() {
    if (profile) return handleGenerateInvitesForSingle;
    if (isSelectedAll) return batchInvites;
    return handleGenerateInvitesForMany;
  }

  async function generateInvitation() {
    try {
      const generateMethod = decideInviteGenerationMethod();
      const result = await generateMethod(profile);

      const { success, failed } = result;
      setInvitationsReport({
        success,
        failed,
        selected: !isSelectedAll ? failed.length + success.length : selectedProfiles.length,
      });
    } catch (error) {
      toast.warning(`Error for generate invites ${error}`);
    }
  }

  async function handleDownload() {
    const filter = {
      id: {
        in: invitationsReport.success.map(({ id }) => id),
      },
    };
    const url = await generateExportInvitationURL(filter);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'Invitations.xlsx';
    document.body.appendChild(a);
    a.click();
    if (a) {
      document.body.removeChild(a);
    }
  }

  if (!invitationsReport) {
    return <LoadingDialog text="We are generating invitations" />;
  }

  return (
    <Dialog isOpen onDismiss={onCloseDialog} width={550}>
      <DialogTitle>
        {selectedProfiles.length > 0 ? 'Generated invitations' : 'Generated invitation'}
      </DialogTitle>
      <DialogContent>
        <div className="mb-3 space-y-3">
          <p>
            Providers selected: <span className="font-bold">{invitationsReport?.selected}</span>
          </p>
          <p>
            Providers invited:{' '}
            <span className="font-bold">{invitationsReport?.success?.length}</span>
          </p>
          <p>
            Failed invitations:{' '}
            <span className="font-bold">{invitationsReport.failed?.length}</span>
          </p>
        </div>
        <Link
          className="font-bold"
          state={{
            success: invitationsReport?.success,
            failed: invitationsReport?.failed,
            selected: invitationsReport?.selected,
          }}
          to={`/resources/report`}
        >
          See detailed report page
        </Link>
      </DialogContent>
      <DialogActions>
        <button
          type="submit"
          className="mir-button primary"
          disabled={invitationsReport?.success?.length === 0}
          onClick={handleDownload}
        >
          {selectedProfiles.length > 0 ? 'Download invites' : 'Download invite'}
        </button>
      </DialogActions>
    </Dialog>
  );
}

InvitationDialog.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    legalName: PropTypes.string,
    id: PropTypes.string,
  }),
  selectedProfiles: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  allProfiles: PropTypes.array,
  onCloseDialog: PropTypes.array,
};
