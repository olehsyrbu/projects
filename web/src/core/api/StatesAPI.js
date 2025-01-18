import { gql } from 'graphql-request';
import gqlClient from './graphQLClient';

export let StateFragment = gql`
  fragment State on State {
    code
    name
    id
    psypact {
      enacted_at
    }
  }
`;

let StatesQuery = gql`
  {
    states {
      ...State
    }
  }
  ${StateFragment}
`;

export async function fetchStates() {
  let response = await gqlClient.request(StatesQuery);
  return response.states;
}
