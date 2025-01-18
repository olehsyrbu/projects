import { useEffect, useState } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';
import { AppCrashFallback } from './AppCrashFallback';
import graphQLClient from '@/core/api/graphQLClient';

export function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    let handleError = (error) => {
      const isOffline = error?.message === 'Network request failed';
      if (isOffline) {
        setError(error);
      }
    };

    graphQLClient.addErrorInterceptor(handleError);
    return () => {
      graphQLClient.removeErrorInterceptor(handleError);
    };
  }, []);

  return (
    <ReactErrorBoundary FallbackComponent={AppCrashFallback}>
      {!error ? children : <AppCrashFallback error={error} />}
    </ReactErrorBoundary>
  );
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};
