import { GraphQLClient, gql } from 'graphql-request';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import config from '@/core/config';

let client = new GraphQLClient(config.api.baseUrl);
let fetcher = ([q, v]) => client.request(q, v);

export function useQuery(query, variables, options) {
  let key = query ? [query, variables] : null;
  return useSWR(key, fetcher, { suspense: true, ...options });
}

export function useImmutableQuery(query, variables, options) {
  let key = query ? [query, variables] : null;
  return useSWRImmutable(key, fetcher, { suspense: true, ...options });
}

export { gql, client };
