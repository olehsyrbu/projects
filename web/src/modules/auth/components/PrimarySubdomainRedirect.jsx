import { useLocation } from 'react-router-dom';
import { useOrganization } from '@/modules/organization';
import { useFlag } from '@/core/feature-split';
import { useEffect } from 'react';
import { redirectIfUserNotInHisOrg } from '@/modules/auth/utils';
import { useAuthContext } from '@/modules/auth';
import PropTypes from 'prop-types';

export function PrimarySubdomainRedirect({ isFirstVisit }) {
  const { user } = useAuthContext();
  const location = useLocation();
  const organization = useOrganization();
  const shouldEnableUserPrimaryOrgRedirect = useFlag('user-primary-organisation-redirect');

  useEffect(() => {
    if (shouldEnableUserPrimaryOrgRedirect !== true) {
      return;
    }

    if (!user) {
      return;
    }

    if (organization?.subdomain && !user.organization) {
      redirectIfUserNotInHisOrg({
        nextSubdomain: '',
        prevSubdomain: organization.subdomain,
        pathname: location.pathname,
        token: localStorage.getItem('authToken'),
        isFirstVisit,
      });
      return;
    }

    if (user.organization && user.organization.id !== organization?.id) {
      redirectIfUserNotInHisOrg({
        nextSubdomain: user.organization.subdomain,
        prevSubdomain: organization?.subdomain,
        pathname: location.pathname,
        token: localStorage.getItem('authToken'),
        isFirstVisit,
      });
    }
  }, [user, organization, location, shouldEnableUserPrimaryOrgRedirect, isFirstVisit]);

  return null;
}

PrimarySubdomainRedirect.propTypes = {
  isFirstVisit: PropTypes.bool,
};

PrimarySubdomainRedirect.defaultProps = {
  isFirstVisit: false,
};
