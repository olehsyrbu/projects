import { gql } from 'graphql-request';
import { PageInfoFragment } from './PageInfo';

export const TeamNoteFragment = gql`
  fragment TeamNote on TeamNote {
    id: id
    text: text
    createdAt: created_at
    fullName: author_name
    provider: provider {
      id
    }
    author: author {
      id
    }
    organization: organization {
      id
    }
  }
`;

export const TeamNotesPaginationFragment = gql`
  fragment TeamNotesPagination on TeamNotesPagination {
    items {
      ...TeamNote
    }
    page_info: page_info {
      ...PageInfo
    }
  }
  ${PageInfoFragment}
  ${TeamNoteFragment}
`;

export const ListTeamNotesByProvider = gql`
  query listTeamNotesByProvider($page: UInt, $limit: UInt, $id: ID!, $organizationId: ID!) {
    listTeamNotes(page: $page, limit: $limit, providerId: $id, organizationId: $organizationId) {
      ...TeamNotesPagination
    }
  }
  ${TeamNotesPaginationFragment}
`;

export const CreateTeamNote = gql`
  mutation createTeamNote($note: TeamNoteCreateInput!, $providerId: ID!, $organizationId: ID!) {
    createTeamNote(teamNote: $note, providerId: $providerId, organizationId: $organizationId) {
      ...TeamNote
    }
  }
  ${TeamNoteFragment}
`;

export const BatchDeleteTeamNotes = gql`
  mutation deleteTeamNoteByIds($ids: [ID!]!) {
    deleteTeamNotes(noteIds: $ids) {
      id
    }
  }
`;

export const DeleteAllTeamNotesByProviderId = gql`
  mutation deleteAllNotesByProviderId($id: ID!, $organizationId: ID!) {
    deleteAllProviderTeamNotes(providerId: $id, organizationId: $organizationId) {
      providerId: provider_id
      organizationId: organization_id
    }
  }
`;
