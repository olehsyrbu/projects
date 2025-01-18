import { gql } from 'graphql-request';
import gqlClient from './graphQLClient';

export let TimezonesFragment = gql`
  fragment Timezone on Timezone {
    label
    tzCode
    name
    utc
  }
`;

let TimezonesQuery = gql`
  query timezonesByCountryCode($countryCode: String!) {
    timezonesByCountryCode(countryCode: $countryCode) {
      ...Timezone
    }
  }
  ${TimezonesFragment}
`;

export async function fetchTimezones(countryCode) {
  let response = await gqlClient.request(TimezonesQuery, { countryCode });
  return response.timezonesByCountryCode;
}
