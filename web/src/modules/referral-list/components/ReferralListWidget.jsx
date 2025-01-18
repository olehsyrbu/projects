import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Heart24Regular as Heart } from '@fluentui/react-icons';
import { useScreen } from '@/core/hooks';
import { useReferralList } from '@/modules/referral-list/hooks';
import './ReferralListWidget.css';

export function ReferralListWidget({ children, shouldShowHint }) {
  const isMediumScreen = useScreen('md');
  const referralList = useReferralList();
  let navigate = useNavigate();

  const referralListWidgetCN = cn('referral-list-widget', {
    'flex-column': children,
  });

  const handleRedirectToReferralList = () => {
    navigate('/referral-coordinator/referral-list', { replace: true });
  };

  if (referralList.providers.length === 0) {
    return (
      <div className={referralListWidgetCN}>
        {children}
        {shouldShowHint && (
          <p className="content">
            Click <Heart className="mx-1" /> icon to add providers to the referral list
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={referralListWidgetCN}>
      {children}
      <div className="row-align-center flex">
        {referralList.providers.length > 0 && (
          <span className="content">
            {referralList.providers.length} added {isMediumScreen && 'to referral list'}
          </span>
        )}
        <button className="mir-button light" onClick={() => referralList.clear()}>
          Clear list
        </button>
        <button className="mir-button primary" onClick={handleRedirectToReferralList}>
          View list
        </button>
      </div>
    </div>
  );
}

ReferralListWidget.propTypes = {
  shouldShowHint: PropTypes.bool,
  children: PropTypes.node,
};

ReferralListWidget.defaultProps = {
  shouldShowHint: true,
};
