import { Link } from 'react-router-dom';
import { Heart24Regular as Heart } from '@fluentui/react-icons';
import { useScreen } from '@/core/hooks';
import { useReferralList, useShowReferralListView } from '@/modules/referral-list/hooks';

export function ReferralListPanel() {
  let show = useShowReferralListView();
  let referralList = useReferralList();
  let lg = useScreen('lg');

  if (!show) {
    return null;
  }

  return (
    <div className="sticky bottom-0 z-30 border-t border-graphics-30 bg-white px-4 py-2.5 max-lg:order-2 md:max-lg:px-0 lg:col-[1/3] lg:mx-auto lg:rounded-t-2xl lg:border lg:border-b-0 lg:p-6 lg:shadow-[16px_0_25px_3px_rgba(0,0,0,0.05)]">
      {lg && referralList.providers.length === 0 ? (
        <p className="font-bold">
          Click <Heart className="text-[#c12300]" /> icon to add providers to the referral list
        </p>
      ) : (
        <div className="flex items-center gap-x-6">
          <p className="flex-1 font-bold max-md:order-2 max-md:text-right">
            {referralList.providers.length} added
            <span className="max-md:hidden"> to referral list</span>
          </p>
          <button className="font-bold text-p-100" onClick={() => referralList.clear()}>
            Clear list
          </button>
          <Link
            to="/referral-coordinator/referral-list"
            className="mir-button primary compact order-3"
          >
            View list
          </Link>
        </div>
      )}
    </div>
  );
}
