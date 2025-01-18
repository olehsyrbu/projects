import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/modules/auth';
import { NotFound } from '@/modules/error-handling/components';
import { PrimarySubdomainRedirect } from './PrimarySubdomainRedirect';

export function PrivateRoute({
  role,
  ownership,
  fallback = '/',
  shouldSkipPrimaryOrgRedirect,
  children,
}) {
  let { user } = useAuthContext();
  let accessGranted = !!user;

  if (role) {
    accessGranted = user?.role === role;
  }

  if (ownership) {
    accessGranted &&= user?.ownership[0]?.type === ownership;
  }

  if (accessGranted) {
    return (
      <>
        {!shouldSkipPrimaryOrgRedirect && <PrimarySubdomainRedirect />}
        {children}
      </>
    );
  }

  return user ? <NotFound /> : <Navigate to={fallback} replace />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node,
  role: PropTypes.string,
  ownership: PropTypes.oneOf(['Provider', 'ProgramRepresentative']),
  fallback: PropTypes.string,
  shouldSkipPrimaryOrgRedirect: PropTypes.bool,
};

PrivateRoute.defaultProps = {
  role: '',
  shouldSkipPrimaryOrgRedirect: false,
};
