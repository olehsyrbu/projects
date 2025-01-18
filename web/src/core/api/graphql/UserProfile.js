import { gql } from 'graphql-request';
import { ReferenceDataFragment } from '../ReferenceDataAPI';
import { ProgramAddress } from './Location';
import { StateFragment } from '@/core/api/StatesAPI';

export const ProviderLookupFragment = gql`
  fragment ProviderLookup on Provider {
    id
    slug
    programName: program_name
    mode
    photoUrl: photo_url
    providerTypes: provider_types {
      favorite
      providerType: provider_type {
        ...ReferenceData
      }
    }
    mobile
    legalFirstName: legal_first_name
    legalLastName: legal_last_name
    legalName: legal_name
    preferredContacts: preferred_contacts
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
    active
    email
    updatedAt: updated_at
    gpa {
      id
      email
    }
    programType: program_type {
      ...ReferenceData
    }
    status
    locations {
      address: address {
        ...ProgramAddress
      }
    }
    remote {
      available
      video
      voice
      chat
    }
  }
  ${ReferenceDataFragment}
  ${ProgramAddress}
  ${StateFragment}
`;

export let UserProfileFragment = gql`
  fragment UserProfile on User {
    id
    fullName: name
    firstName: first_name
    lastName: last_name
    email
    createdAt: created_at
    onboarding
    organization {
      id
      name
      subdomain
      organizationType: organization_type {
        code
      }
    }
    organizations {
      id
    }
    ownership {
      type: __typename
      ... on Provider {
        sharedWith: shared_with {
          id
          email
          name
          type: __typename
        }
        ...ProviderLookup
      }
    }
    sharedEntities: shared_entities {
      type: __typename
      ...ProviderLookup
    }
    role
    abilities {
      subject
      action
      conditions
    }
    loggedInAt: logged_in_at
    notificationEmail: notification_email
  }
  ${ProviderLookupFragment}
`;

export const UserProfileQuery = gql`
  query selfProfile {
    me {
      ...UserProfile
    }
  }
  ${UserProfileFragment}
`;

export let UserProfileMutation = gql`
  mutation updateUser($id: ID!, $user: UserUpdateInput!) {
    updateUser(userId: $id, user: $user) {
      ...UserProfile
    }
  }
  ${UserProfileFragment}
`;

export const DeleteUser = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(userId: $id) {
      id
    }
  }
`;
