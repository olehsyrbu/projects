import useSWR, { mutate } from 'swr';
import {
  checkInvitationValidity,
  createInvitation,
  createInvitations as createInvitationsAPI,
  deleteInvitations as deleteInvitationsAPI,
  fetchInactiveInvitations,
  fetchOrgTeamInvitations,
  importRcInvitations as importRcInvitationsAPI,
  linkInvitationToProvider,
  renderInvitationEmail,
  sendInvitationMessages as sendInvitationMessagesAPI,
  batchInvites as batchInvitesAPI,
  generateExportInvitationURL as generateExportInvitationURLAPI,
} from '@/core/api/InvitationAPI';
import { useAuthContext } from '@/modules/auth';

export function useInvitationValidity({ code, type }) {
  let { data } = useSWR(['invitation', code, type], () => checkInvitationValidity({ code, type }), {
    suspense: true,
  });
  return data;
}

export function useCreateInvite() {
  return async (params) => {
    let invite = await createInvitation(params);
    return mutate(['invite', params.id], invite, false);
  };
}

export function useLinkInviteToProvider() {
  return async (invitationId, providerId) => {
    return await linkInvitationToProvider(invitationId, providerId);
  };
}

export async function batchInvites() {
  let results = await batchInvitesAPI();
  return results;
}

export async function createInvitations(invitations) {
  let results = await createInvitationsAPI(invitations);
  cleanInactiveInvitationsCache();
  return results;
}

export async function generateExportInvitationURL(invitations) {
  let results = await generateExportInvitationURLAPI(invitations);
  cleanInactiveInvitationsCache();
  return results;
}

export async function importRcInvitations(file) {
  let results = await importRcInvitationsAPI(file);
  cleanInactiveInvitationsCache();
  return results;
}

export async function sendInvitationMessages(ids, userId) {
  let results = await sendInvitationMessagesAPI(ids, userId);
  cleanInactiveInvitationsCache();
  return results;
}

export function useInvitationEmail() {
  let response = useSWR('invitation-email', renderInvitationEmail, { suspense: true });
  return response.data;
}

export function useInactiveInvitations(query) {
  let { user } = useAuthContext();
  let response = useSWR(
    ['inactive-invitations', query],
    () => fetchInactiveInvitations({ userId: user.id, ...query }),
    { suspense: true },
  );
  return [response.data, response.mutate];
}

export function deleteInactiveInvitation(id, userId) {
  return deleteInvitationsAPI([id], userId);
}

function cleanInactiveInvitationsCache() {
  mutate((key) => key?.[0] === 'inactive-invitations', undefined, false);
}

export function useTeamInvitations({ organizationId } = {}) {
  const context = useSWR(organizationId ? ['team-invites', organizationId] : null, () =>
    fetchOrgTeamInvitations({ organizationId }),
  );

  return context.data;
}
