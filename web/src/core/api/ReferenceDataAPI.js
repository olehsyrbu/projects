import { gql } from '@/core/graphql';

export let ReferenceDataFragment = gql`
  fragment ReferenceData on ReferenceData {
    id
    code
    name
    category
    description
    order
    active
  }
`;
