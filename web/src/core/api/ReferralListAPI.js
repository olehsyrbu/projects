import { gql } from 'graphql-request';
import gqlClient from './graphQLClient';
import { ProviderPersonProfileFragment } from '@/core/api/graphql/Provider';

export async function createReferralList(providers) {
  let response = await gqlClient.request(CreateReferralListMutation, {
    referralList: { providers },
  });
  return response.createReferralList;
}

const ReferralList = gql`
  fragment ReferralList on ReferralList {
    code
    providers {
      note
      provider {
        ...Provider
      }
    }
  }
  ${ProviderPersonProfileFragment}
`;

let CreateReferralListMutation = gql`
  mutation createReferralList($referralList: ReferralListInput!) {
    createReferralList(referralList: $referralList) {
      ...ReferralList
    }
  }
  ${ReferralList}
`;

export async function fetchReferralListByCode(code) {
  try {
    let response = await gqlClient.request(ReferralListByCodeQuery, { code });
    return response.referralListByCode;
  } catch (e) {
    return new Error();
  }
}

const ReferralListByCodeQuery = gql`
  query referralListByCode($code: String!) {
    referralListByCode(code: $code) {
      ...ReferralList
    }
  }
  ${ReferralList}
`;
