import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';
import { NotFound, NoConnection } from '@/modules/error-handling/components';

export function AppCrashFallback({ error }) {
  let message = error.errorMessage || error.message;
  const stack = error.componentStack || error.stack;
  const isNotFound =
    error.response?.errors?.find((item) => item.extensions?.code === 'NOT_FOUND') ||
    error.response?.status === 404;

  if (message === 'Network request failed') {
    return <NoConnection />;
  }

  if (isNotFound) {
    return <NotFound />;
  }

  return (
    <ErrorBoundary FallbackComponent={NotFound}>
      <h1 className="font-bold">App Crashes. Something went wrong.</h1>
      <br />
      <ul>
        <li>Message: {message}</li>
        <li>Stacktrace: {stack}</li>
      </ul>
    </ErrorBoundary>
  );
}

AppCrashFallback.propTypes = {
  error: PropTypes.object,
};
