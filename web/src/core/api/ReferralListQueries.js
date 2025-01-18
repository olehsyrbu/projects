import useSWR from 'swr';
import { fetchReferralListByCode } from './ReferralListAPI';

export function useReferralListByCode(code) {
  let { data } = useSWR(['referral-list', code], () => fetchReferralListByCode(code), {
    suspense: true,
  });
  return data;
}
