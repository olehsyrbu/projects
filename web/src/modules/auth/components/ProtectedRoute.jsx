import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuthContext } from '@/modules/auth';
import { Ability } from '@casl/ability';
import { useMemo } from 'react';
import { PrimarySubdomainRedirect } from './PrimarySubdomainRedirect';

export function ProtectedRoute({ check, fallback, children }) {
  const { user } = useAuthContext();
  const ability = useMemo(() => (user ? new Ability(user.abilities) : null), [user]);

  if (check && ability) {
    const shouldPassThrough = ability.can(check.action, check.subject);

    return shouldPassThrough ? (
      <>
        <PrimarySubdomainRedirect />
        {children}
      </>
    ) : (
      fallback
    );
  } else if (user) {
    return (
      <>
        <PrimarySubdomainRedirect />
        {children}
      </>
    );
  }

  return fallback;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node,
  check: PropTypes.shape({
    action: PropTypes.string,
    subject: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  }),
};

ProtectedRoute.defaultProps = {
  fallback: <Navigate to="/not-found" replace />,
};
