import { gql } from 'graphql-request';
import { ReferenceDataFragment } from '@/core/api/ReferenceDataAPI';
import { StateFragment } from '@/core/api/StatesAPI';

import { ProviderCommonProfileFragment } from './Provider';
import { PhotoFragment } from './Photo';
import { ProgramAddress, ProgramLocationFragment } from './Location';
import { ProviderAccreditationFragment } from './Accreditation';

export const ProgramBaseOnlyFragment = gql`
  fragment ProgramBaseOnly on Provider {
    name: program_name
    center: program_org_name
  }
`;

const ProgramOnlyFragment = gql`
  fragment ProviderProgramOnlyProfile on Provider {
    programType: program_type {
      ...ReferenceData
    }

    locations {
      ...ProgramLocation
    }
    accreditations {
      ...ProviderAccreditation
    }

    admission {
      type
      weekdays
      dates {
        start
        end
      }
    }

    duration {
      start
      end
      timeframe {
        ...ReferenceData
      }
      averageTotalHours: average_total_hours
    }

    services {
      ...ReferenceData
    }

    remote {
      available
      voice
      chat
      video
      states {
        ...State
      }
      accommodations {
        ...ReferenceData
      }
    }

    schedulePdfUrl: schedule_pdf_url
  }
`;

export const ProgramFragment = gql`
  fragment Program on Provider {
    ...ProviderCommonProfile
    ...ProviderProgramOnlyProfile
    ...ProgramBaseOnly
  }

  ${ProviderCommonProfileFragment}
  ${ProgramOnlyFragment}
  ${ProgramBaseOnlyFragment}

  ${ProgramLocationFragment}
  ${ProviderAccreditationFragment}
  ${ProgramAddress}
  ${PhotoFragment}
  ${ReferenceDataFragment}
  ${StateFragment}
`;

export const CreateProgram = gql`
  mutation createProgram($program: CreateProgramInput!) {
    createProgram(program: $program) {
      ...Program
    }
  }

  ${ProgramFragment}
`;

export const GetProgram = gql`
  query getProgramById($id: ID!, $subdomain: String) {
    providerById(providerId: $id, subdomain: $subdomain) {
      ...Program
    }
  }

  ${ProgramFragment}
`;

export const UpdateProgram = gql`
  mutation updateProgram($id: ID!, $patch: UpdateProgramInput!) {
    updateProgram(programId: $id, program: $patch) {
      ...Program
    }
  }

  ${ProgramFragment}
`;

export const CloneProgram = gql`
  mutation cloneProvider($providerId: ID!) {
    cloneProvider(providerId: $providerId) {
      ...Program
    }
  }
  ${ProgramFragment}
`;

export const DeleteProgram = gql`
  mutation deleteProgram($id: ID!) {
    deleteProgram(programId: $id) {
      id
    }
  }
`;

export const ProgramQueryBySlug = gql`
  query providerBySlug($slug: String!, $subdomain: String) {
    providerBySlug(slug: $slug, subdomain: $subdomain) {
      ...Program
    }
  }
  ${ProgramFragment}
`;
