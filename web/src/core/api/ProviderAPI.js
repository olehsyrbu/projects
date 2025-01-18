import { gql } from 'graphql-request';
import gqlClient from './graphQLClient';
import { PageInfoFragment } from './graphql';
import config from '../config';
import { ProviderPersonProfileFragment } from '@/core/api/graphql/Provider';
import { providerAdapter } from './adapters/providerAdapter';

export async function fetchProvider(id, subdomain) {
  if (id === 'newProvider') {
    return {
      legalFirstName: '',
      legalLastName: '',
      preferredFirstName: '',
    };
  }
  let response = await gqlClient.request(ProviderQuery, { id, subdomain });
  return response.providerById;
}

export async function fetchProviderBySlug(slug, subdomain) {
  let response = await gqlClient.request(ProviderQueryBySlug, { slug, subdomain });
  return response.providerBySlug;
}

export async function fetchOrganizationProviders(options) {
  let response = await gqlClient.request(OrganizationProvidersQuery, {
    ...options,
    filter: {
      ...options.filter,
      status: 'COMPLETED',
    },
  });
  return response.userProviders;
}

export async function createProvider(provider) {
  let response = await gqlClient.request(CreateProviderMutation, { provider });
  return response.createBasicProvider;
}

export async function actualizeProvider(providerId) {
  let response = await gqlClient.request(ActualizeMutation, { providerId });
  return response.actualizeProvider;
}

export async function updateProvider(providerId, provider) {
  let response = await gqlClient.request(ProviderMutation, { providerId, provider });
  return response.updateProvider;
}

export async function updatePersonProviderProfile(providerId, provider) {
  let response = await gqlClient.request(ProviderMutation, {
    providerId,
    provider: providerAdapter.toUpdateInput(provider),
  });
  return response.updateProvider;
}

export async function updateProviderPhoto(id, blob) {
  let response = await gqlClient.request(ProviderPhotoMutation, { id, photo: blob });
  return response.updateProviderPhoto;
}

export async function attachProviderPhotoUrl(id, url) {
  const photo = await fetch(url).then((r) => r.blob());
  const { photoUrl } = await updateProviderPhoto(id, photo);
  return photoUrl;
}

export async function removeProviderFromOrganization(organizationId, providerId) {
  let response = await gqlClient.request(RemoveProviderFromOrganizationMutation, {
    organizationId,
    providerId,
  });
  return response.removeProviderFromOrganization;
}

export async function removePendingProvider(providerId) {
  let response = await gqlClient.request(RemovePendingProvider, {
    providerId,
  });
  return response.removePendingProvide;
}

export async function removeProviderFromGPA(providerId) {
  let response = await gqlClient.request(RemoveProviderFromGPA, {
    providerId,
  });
  return response.removeProviderFromGPA;
}

export async function getListGPAProviders(options) {
  let response = await gqlClient.request(ListOwnGPAProvidersQuery, { ...options });
  return response.listOwnProviders;
}
export async function getProviders(options) {
  let response = await gqlClient.request(ListOwnGPAProvidersQuery, { ...options });
  return response.listOwnProviders;
}

let ProviderQuery = gql`
  query providerById($id: ID!, $subdomain: String) {
    providerById(providerId: $id, subdomain: $subdomain) {
      ...Provider
    }
  }
  ${ProviderPersonProfileFragment}
`;

let ProviderQueryBySlug = gql`
  query providerBySlug($slug: String!, $subdomain: String) {
    providerBySlug(slug: $slug, subdomain: $subdomain) {
      ...Provider
    }
  }
  ${ProviderPersonProfileFragment}
`;

let OrganizationProvidersQuery = gql`
  query organizationProviders(
    $userId: ID!
    $filter: UserProvidersFilterInput
    $sort: ProvidersOrder
    $page: UInt
    $limit: UInt
    $organizationId: ID
  ) {
    userProviders(userId: $userId, filter: $filter, page: $page, limit: $limit, sort: $sort) {
      items {
        ...Provider
        notesCount: notes_count(organizationId: $organizationId)
      }
      pageInfo: page_info {
        page
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
  ${ProviderPersonProfileFragment}
`;

let CreateProviderMutation = gql`
  mutation createBasicProvider($provider: CreateBasicProviderInput!) {
    createBasicProvider(provider: $provider) {
      ...Provider
    }
  }
  ${ProviderPersonProfileFragment}
`;

let ProviderMutation = gql`
  mutation updateProvider($providerId: ID!, $provider: UpdateProviderInput!) {
    updateProvider(providerId: $providerId, provider: $provider) {
      ...Provider
    }
  }
  ${ProviderPersonProfileFragment}
`;

let ProviderPhotoMutation = gql`
  mutation updateProviderPhoto($id: ID!, $photo: Upload!) {
    updateProviderPhoto(providerId: $id, photo: $photo) {
      ...Provider
    }
  }
  ${ProviderPersonProfileFragment}
`;

const RemovePendingProvider = gql`
  mutation removePendingProvider($providerId: ID!) {
    removePendingProvider(providerId: $providerId) {
      id
    }
  }
`;

const RemoveProviderFromGPA = gql`
  mutation removeProviderFromGPA($providerId: ID!) {
    removeProviderFromGPA(providerId: $providerId) {
      id
    }
  }
`;

let RemoveProviderFromOrganizationMutation = gql`
  mutation removeProviderFromOrganization($organizationId: ID!, $providerId: ID!) {
    removeProviderFromOrganization(organizationId: $organizationId, providerId: $providerId) {
      id
    }
  }
`;

const ActualizeMutation = gql`
  mutation actualize($providerId: ID!) {
    actualizeProvider(providerId: $providerId) {
      id
    }
  }
`;

export const ListOwnGPAProvidersFragment = gql`
  fragment GPAPagination on ProviderPagination {
    pageInfo: page_info {
      ...PageInfo
    }
    items {
      ...Provider
    }
  }
  ${PageInfoFragment}
  ${ProviderPersonProfileFragment}
`;

let ListOwnGPAProvidersQuery = gql`
  query listOwnProviders($page: UInt, $limit: UInt) {
    listOwnProviders(page: $page, limit: $limit) {
      ...GPAPagination
    }
  }
  ${ListOwnGPAProvidersFragment}
`;

export function sentProviderEmail(slug, data) {
  let apiUrl = new URL(config.api.baseUrl);
  let url = `${apiUrl.origin}/contact/providers/${slug}/email`;

  const params = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };

  return fetch(url, params);
}

let updateProviderAvailabilityStatus = gql`
  mutation updateProviderAvailabilityStatus(
    $providerId: ID!
    $status: ProviderAvailabilityStatus!
  ) {
    updateProviderAvailabilityStatus(providerId: $providerId, status: $status) {
      status
    }
  }
`;

export async function updateProviderStatus(providerId, status, token) {
  let headers;

  if (token) {
    headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  let response = await gqlClient.request(
    updateProviderAvailabilityStatus,
    { providerId, status },
    headers,
  );
  return response.updateProviderAvailabilityStatus;
}

const SearchUsersQuery = gql`
  query usersShareAccessSuggestions(
    $filter: UsersShareAccessSuggestionsFilterInput
    $sort: UsersShareAccessSuggestionsOrderInput
    $limit: UInt
  ) {
    usersShareAccessSuggestions(limit: $limit, filter: $filter, sort: $sort) {
      id
      firstName: first_name
      lastName: last_name
      email
    }
  }
`;

export async function getUsersEmail({ limit, sort, filter }) {
  return gqlClient.request(SearchUsersQuery, {
    limit,
    sort,
    filter,
  });
}

let ShareAccessMutation = gql`
  mutation shareAccess($email: Email!) {
    shareAccess(email: $email) {
      id
      email
      name
      type: __typename
    }
  }
`;

export async function updateShareAccess(email) {
  let response = await gqlClient.request(ShareAccessMutation, { email });
  return response.shareAccess;
}

let RemoveAccessMutation = gql`
  mutation removeAccess($id: ID!, $type: SharableEntityName!, $resetNotificationEmail: Boolean) {
    removeAccess(
      entityId: $id
      entityName: $type
      resetNotificationEmail: $resetNotificationEmail
    ) {
      id
      email
    }
  }
`;

export async function removeShareAccess(id, type, resetNotificationEmail) {
  let response = await gqlClient.request(RemoveAccessMutation, {
    id,
    type,
    resetNotificationEmail,
  });
  return response.removeAccess;
}

let UploadProviderSchedulePdfMutation = gql`
  mutation uploadProviderSchedulePdf($attachment: Upload!, $providerId: ID!) {
    uploadProviderSchedulePdf(attachment: $attachment, providerId: $providerId) {
      schedulePdfUrl: schedule_pdf_url
    }
  }
`;

export async function uploadProviderSchedulePdf(attachment, providerId) {
  let response = await gqlClient.request(UploadProviderSchedulePdfMutation, {
    attachment,
    providerId,
  });
  return response.uploadProviderSchedulePdf;
}

let RemoveProviderSchedulePdfMutation = gql`
  mutation removeProviderSchedulePdf($providerId: ID!) {
    removeProviderSchedulePdf(providerId: $providerId) {
      schedulePdfUrl: schedule_pdf_url
    }
  }
`;

export async function removeProviderSchedulePdf(providerId) {
  let response = await gqlClient.request(RemoveProviderSchedulePdfMutation, {
    providerId,
  });
  return response.removeProviderSchedulePdf;
}

export async function importProviders({ file, adapter }) {
  const response = await gqlClient.request(ImportProviders, { file, adapter });
  return response.importProvidersFromUpload;
}

export async function exportProvidersFile(data = {}) {
  const response = await gqlClient.request(ExportProvidersFileQuery, { input: data });
  return response.exportProvidersFile;
}

let ExportProvidersFileQuery = gql`
  query exportProvidersFile($input: ProviderExportFileInput!) {
    exportProvidersFile(input: $input) {
      url
    }
  }
`;

const ImportProviders = gql`
  mutation uploadProviders($file: Upload!, $adapter: ImportAdapter) {
    importProvidersFromUpload(input: { file: $file, adapter: $adapter }) {
      failed
      succeeded
      errors {
        code
        line
        extensions
      }
    }
  }
`;

export async function removeProviderAccess(providerId) {
  let response = await gqlClient.request(RemoveProviderAccess, {
    providerId,
  });
  return response.removeProviderAccess;
}

const RemoveProviderAccess = gql`
  mutation removeProviderAccess($providerId: ID!) {
    removeProviderAccess(providerId: $providerId)
  }
`;
