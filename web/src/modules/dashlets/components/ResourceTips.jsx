import { useEffect, useState } from 'react';
import { useReferenceData } from '@/modules/reference-data';
import PropTypes from 'prop-types';

export function ResourceTips({ gpaResourceType = null }) {
  const tipsRC = useReferenceData('ResourceTip');
  const tips = tipsRC.filter(({ category }) => category === gpaResourceType);

  function getTip() {
    return tips
      ? tips.find(({ name }) => name.replace(/\s+/g, '').toLowerCase() === `tip${resourceTipIndex}`)
          ?.description
      : defaultTip;
  }

  const tipsLength = tips ? tips.length : 0;

  let lastLoginDate = localStorage.getItem('mir_last_login_date');
  let resourceTipIndex = localStorage.getItem('mir_resource_tip_index');

  if (resourceTipIndex === null) {
    resourceTipIndex = 1;
  } else {
    resourceTipIndex = parseInt(resourceTipIndex);
  }

  const defaultTip =
    'Today is a great day to update your profile! Those who provide information about their identities are more likely to match with clients/patients. Take 3 minutes to check a few boxes.';

  const [currentTip, setCurrentTip] = useState(getTip());

  useEffect(() => {
    const today = new Date().toDateString();

    if (lastLoginDate !== today) {
      resourceTipIndex = lastLoginDate ? resourceTipIndex + 1 : resourceTipIndex;

      if (resourceTipIndex === tipsLength) {
        resourceTipIndex = 1;
      }

      localStorage.setItem('mir_last_login_date', today);
      localStorage.setItem('mir_resource_tip_index', resourceTipIndex);

      setCurrentTip(getTip());
    }
  }, [resourceTipIndex, lastLoginDate]);

  return <p>{currentTip}</p>;
}

ResourceTips.defaultProps = {
  gpaResourceType: null,
};

ResourceTips.propTypes = {
  gpaResourceType: PropTypes.string,
};
