import { gql } from 'graphql-request';
import gqlClient from './graphQLClient';

/**
 *
 * @param {Object} query
 * @param {Integer} query.page
 * @param {Integer} query.limit
 *
 * @return {Promise<void>}
 */
import { ReferenceDataFragment } from './ReferenceDataAPI';

export async function advancedSearchApi(query = {}) {
  let response = await gqlClient.request(ProviderSearchQuery, query);

  return response.providersSearch;
}

const ReferenceDataLookupFragment = gql`
  fragment ReferenceDataLookup on ReferenceData {
    id
    name
    code
  }
`;

const ProviderLookupFragment = gql`
  fragment ProviderLookup on Provider {
    id
    status
    mode
    email
    mobile
    slug
    tagLine: tag_line
    legalFirstName: legal_first_name
    legalLastName: legal_last_name
    legalName: legal_name
    preferredContacts: preferred_contacts
    preferredFirstName: preferred_first_name
    name: program_name
    center: program_org_name
    description
    remote {
      available
      voice
      chat
      video
    }
    admission {
      type
      weekdays
      dates {
        start
        end
      }
    }
    distance(targetUnit: MI)
    providerTypes: provider_types {
      favorite
      providerType: provider_type {
        ...ReferenceData
      }
    }
    inPerson: in_person {
      available
    }
    availability {
      updated_at
      status
      afterHoursCrisisServices: after_hours_crisis_services
      intakeWaitDays: intake_wait_days
      hours {
        day
        start
        end
      }
    }
    photoUrl: photo_url
    paymentMethods: payment_methods {
      ...ReferenceDataLookup
    }
    paymentOptions: payment_options {
      ...ReferenceDataLookup
    }
    languageServices: language_services {
      ...ReferenceData
    }
    locations: locations {
      address {
        coordinates {
          coordinates: coordinates
        }
      }
      amenities {
        code
        category
      }
    }
    ageGroups: age_groups {
      ...ReferenceData
      ageStart: age_start
      ageEnd: age_end
    }
    treatsMedicallyUnstable: treats_medically_unstable
    canAssistWithDailyLiving: can_assist_with_daily_living
    treatsSuicidalIdeation: treats_suicidal_ideation
    notesCount: notes_count(organizationId: $organizationId)
    updatedAt: updated_at
    organizations {
      id
      subdomain
    }
  }
`;

const ProviderPaginationFragment = gql`
  fragment ProvidersPagination on ProviderPagination {
    items {
      ...ProviderLookup
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
`;

const ProviderSearchQuery = gql`
  query advancedSearch(
    $filter: ProvidersSearchInput
    $sort: ProvidersSearchOrder
    $page: UInt
    $limit: UInt
    $organizationId: ID
  ) {
    providersSearch(filter: $filter, sort: $sort, page: $page, limit: $limit) {
      ...ProvidersPagination
    }
  }
  ${ReferenceDataFragment}
  ${ReferenceDataLookupFragment}
  ${ProviderLookupFragment}
  ${ProviderPaginationFragment}
`;
