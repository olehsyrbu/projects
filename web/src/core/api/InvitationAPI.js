import { gql } from 'graphql-request';
import mixpanel from '@/core/mixpanel';
import graphQLClient from './graphQLClient';
import { ProviderPersonProfileFragment } from './graphql/Provider';
import config from '@/core/config';

export async function checkInvitationValidity({ code, type }) {
  if (!code) {
    return false;
  }

  const response = await graphQLClient.request(InvitationCodeQuery, { code, type });
  const invitationValid = response.invitationValid;

  if (invitationValid) {
    mixpanel.identify(code);
    mixpanel.track('Invitation Activated', { code });
  }

  return invitationValid;
}

export async function createInvitation(invitation) {
  const response = await graphQLClient.request(CreateInvitation, { invitation });
  return response.createInvitation;
}

export async function linkInvitationToProvider(invitationId, providerId) {
  const response = await graphQLClient.request(
    gql`
      mutation linkInvitationToProvider($invitationId: String!, $providerId: String!) {
        linkInvitationToProvider(invitationId: $invitationId, providerId: $providerId) {
          id
        }
      }
    `,
    { invitationId, providerId },
  );
  return response.createInvitations;
}

export async function batchInvites() {
  const response = await graphQLClient.request(BatchInvites);
  return response.inviteProviders;
}

export async function generateExportInvitationURL(filter) {
  const response = await graphQLClient.request(GenerateExportInvitationURL, {
    filter,
  });
  return response.generateInvitationExportURL;
}

export async function createInvitations(invitations) {
  const response = await graphQLClient.request(CreateInvitations, { invitations });
  return response.createInvitations;
}

export async function importRcInvitations(file) {
  const response = await graphQLClient.request(ImportRcInvitationsMutation, { file });
  return response.importReferralCoordinatorInvitation;
}

export async function fetchUserInvitations(options) {
  const response = await graphQLClient.request(UserInvitationsQuery, options);
  return response.userInvitations;
}

export async function updateInvitation(invitationId, invitation, doSendInvitation) {
  const response = await graphQLClient.request(UpdateInvitation, {
    invitationId,
    invitation,
    doSendInvitation,
  });
  return response.updateInvitation;
}

export async function deleteInvitations(ids, userId) {
  const response = await graphQLClient.request(DeleteInvitationsMutation, { ids, userId });
  return response.deleteUserOpenInvitations;
}

export async function deleteInvitation({ ids, cascadeUsers }) {
  const response = await graphQLClient.request(BatchDeleteInvitationsMutation, {
    ids,
    cascadeUsers,
  });

  return response.deleteInvitations;
}

export async function sendInvitationMessages(invitationIds, userId) {
  const response = await graphQLClient.request(SendInvitationMutation, { invitationIds, userId });
  return response.sendOpenUserInvitations;
}

export async function renderInvitationEmail() {
  const response = await graphQLClient.request(RenderInvitationEmailMutation);
  return response.renderReferralCoordinatorInvitationEmail;
}

export async function fetchInactiveInvitations(options) {
  const response = await graphQLClient.request(InactiveInvitationsQuery, {
    ...options,
    filter: {
      ...options.filter,
      type: 'PROVIDER',
    },
  });
  return response.userInvitations;
}

export async function fetchOrgTeamInvitations({ organizationId }) {
  const response = await graphQLClient.request(ListTeamInvitationsQuery, {
    organizationId,
    limit: 1000,
  });
  return response.invitationsPagination;
}

export const InvitationCodeQuery = gql`
  query invitationValid($code: String!, $type: InvitationType) {
    invitationValid(type: $type, invitationCode: $code) {
      valid
      params {
        email
        type
      }
    }
  }
`;

const ImportRcInvitationsMutation = gql`
  mutation importRcInvitations($file: Upload!) {
    importReferralCoordinatorInvitation(file: $file) {
      created
      updated
      errored
      skipped
    }
  }
`;

const InvitationFragment = gql`
  fragment Invitation on Invitation {
    id
    email
    recipient_name
    invitation_code
    type
    status
    message_type
    sent_at
    entity {
      ...Provider
    }
  }
  ${ProviderPersonProfileFragment}
`;

const UserInvitationsQuery = gql`
  query userInvitations(
    $id: ID!
    $filter: UserInvitationsFilterInput
    $sort: InvitationsOrder
    $page: UInt
    $limit: UInt
  ) {
    userInvitations(userId: $id, page: $page, limit: $limit, filter: $filter, sort: $sort) {
      items {
        ...Invitation
      }
      pageInfo: page_info {
        page
        totalPages: total_pages
        perPage: per_page
        totalItems: total_items
        hasPrevPage: has_prev_page
        hasNextPage: has_next_page
      }
    }
  }
  ${InvitationFragment}
`;

const DeleteInvitationsMutation = gql`
  mutation deleteRcOpenInvitations($ids: [ID!], $userId: ID!) {
    deleteUserOpenInvitations(invitationIds: $ids, userId: $userId) {
      count
    }
  }
`;

export const BatchDeleteInvitationsMutation = gql`
  mutation deleteInvitations($ids: [ID!]!, $cascadeUsers: Boolean!) {
    deleteInvitations(cascadeUsers: $cascadeUsers, invitationIds: $ids) {
      count
    }
  }
`;

const SendInvitationMutation = gql`
  mutation sendInvitationMessages($invitationIds: [ID!], $userId: ID!) {
    sendOpenUserInvitations(invitationIds: $invitationIds, userId: $userId) {
      sent
      errored
    }
  }
`;

const RenderInvitationEmailMutation = gql`
  mutation RenderReferralCoordinatorInvitationEmail($invitationId: ID) {
    renderReferralCoordinatorInvitationEmail(invitationId: $invitationId) {
      subject
      html
      text
    }
  }
`;

const InactiveInvitationsQuery = gql`
  query userInvitations(
    $userId: ID!
    $page: UInt
    $limit: UInt
    $filter: UserInvitationsFilterInput
    $sort: InvitationsOrder
  ) {
    userInvitations(userId: $userId, filter: $filter, page: $page, limit: $limit, sort: $sort) {
      items {
        ...Invitation
      }
      pageInfo: page_info {
        page: page
        totalPages: total_pages
        perPage: per_page
        totalItems: total_items
        hasPrevPage: has_prev_page
        hasNextPage: has_next_page
        nextPage: next_page
        prevPage: prev_page
      }
    }
  }
  ${InvitationFragment}
`;

export const ListTeamInvitationsQuery = gql`
  query listTeamMemberInvitations(
    $organizationId: ID!
    $page: UInt
    $limit: UInt
    $sort: InvitationsOrder
  ) {
    invitationsPagination(
      filter: {
        organization_id: { eq: $organizationId }
        OR: [{ type: ORGANIZATION_MEMBER }, { type: REFERRAL_COORDINATOR }]
      }
      page: $page
      limit: $limit
      sort: $sort
    ) {
      items {
        id
        email
        recipientName: recipient_name
        invitationCode: invitation_code
        type
        status
        messageType: message_type
        sentAt: sent_at
        user: user {
          id
          firstName: first_name
          lastName: last_name
          email
          role
          loggedInAt: logged_in_at
        }
      }
      pageInfo: page_info {
        perPage: per_page
        totalPages: total_pages
        totalPages: total_pages
        hasPrevPage: has_prev_page
        hasNextPage: has_next_page
        totalItems: total_items
      }
    }
  }
`;

export const CreateInvitation = gql`
  mutation createInvitation($invitation: InvitationCreateInput!) {
    createInvitation(invitation: $invitation) {
      id
      invitation_code
      recipient_name
      note
      type
    }
  }
`;

export const BatchInvites = gql`
  mutation batchInvites {
    inviteProviders {
      failed {
        email
        reason
        recipient_name
      }
      success {
        id
        invitation_code
        type
        message_type
        recipient_name
        email
        entity {
          ... on Provider {
            slug
          }
        }
      }
    }
  }
`;

export const GenerateExportInvitationURL = gql`
  mutation GenerateExportInvitationURL($filter: InvitationsFilterInput) {
    generateInvitationExportURL(filter: $filter)
  }
`;

export const CreateInvitations = gql`
  mutation CreateInvitations($invitations: [InvitationCreateInput!]!) {
    createInvitations(invitations: $invitations) {
      success {
        ...Invitation
      }
      failed {
        email
        reason
        recipient_name
      }
    }
  }
  ${InvitationFragment}
`;

export const UpdateInvitation = gql`
  mutation UpdateInvitation(
    $invitationId: ID!
    $invitation: InvitationUpdateInput!
    $doSendInvitation: Boolean!
  ) {
    updateInvitation(
      invitationId: $invitationId
      invitation: $invitation
      doSendInvitation: $doSendInvitation
    ) {
      ...Invitation
    }
  }
  ${InvitationFragment}
`;

export function sentSupportEmail(organization, data) {
  let apiUrl = new URL(config.api.baseUrl);
  let url = `${apiUrl.origin}/contact/support/email?organization=${organization}`;

  const params = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };

  return fetch(url, params);
}
