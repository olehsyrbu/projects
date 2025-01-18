import { gql } from 'graphql-request';

export const ProviderAccreditationFragment = gql`
  fragment ProviderAccreditation on ProviderAccreditation {
    id
    body
    accreditedAt: accredited_at
    expiredAt: expired_at
    state {
      ...State
    }
  }
`;
