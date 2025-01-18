import { gql } from 'graphql-request';
import { ProgramFragment } from './Programs';

export const ProgramDraftFragment = gql`
  fragment ProgramDraft on ProgramDraft {
    id
    center: center_name
    tagLine: tag_line
    createdAt: created_at
    program: draft_provider {
      ...Program
    }
    updatedAt: updated_at
    types {
      amount
      type {
        id
        code
      }
    }
  }

  ${ProgramFragment}
`;

export const StartProgramsOnboarding = gql`
  mutation startProgramOnboarding($draft: StartProgramOnboardingInput!) {
    startProgramOnboarding(draft: $draft) {
      ...ProgramDraft
    }
  }

  ${ProgramDraftFragment}
`;

export const GetMyProgramDraft = gql`
  query getMyProgramDraft {
    getMyProgramDraft {
      ...ProgramDraft
    }
  }

  ${ProgramDraftFragment}
`;

export const FinishProgramDraft = gql`
  mutation finishProgramOnboarding {
    finishProgramOnboarding {
      id
    }
  }
`;

export const DiscardProgramDraft = gql`
  mutation discardProgramOnboarding {
    discardProgramOnboarding {
      id
    }
  }
`;

export const SaveProgramDraftTypes = gql`
  mutation updateProgramDraftTypes($typesByLocation: [ProgramDraftLocationsLocationInput!]!) {
    saveProgramLocationTypes(locations: $typesByLocation) {
      ...ProgramDraft
    }
  }

  ${ProgramDraftFragment}
`;

export const AddRemoteProgramTypes = gql`
  mutation addRemoteProgramTypes($programDraft: UpdateProgramDraftInput!) {
    updateProgramDraft(programDraft: $programDraft) {
      ...ProgramDraft
    }
  }

  ${ProgramDraftFragment}
`;
