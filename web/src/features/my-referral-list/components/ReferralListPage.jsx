import { useReferralList } from '@/modules/referral-list/hooks';
import { ReferralList } from './ReferralList';
import { EmptyReferralList } from './EmptyReferralList';

export function ReferralListPage() {
  let { providers } = useReferralList();
  return providers.length > 0 ? <ReferralList /> : <EmptyReferralList />;
}
