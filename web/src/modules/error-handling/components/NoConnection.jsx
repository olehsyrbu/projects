import { useEffect, useState } from 'react';
import { ErrorPage } from './ErrorPage';

export function NoConnection() {
  const [url, setUrl] = useState('/');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return (
    <ErrorPage>
      <h1>No internet connection</h1>
      <p>
        Please check your connection or try to reload page
        <br />
        <a href={url}>Reload Page</a>.
      </p>
    </ErrorPage>
  );
}
