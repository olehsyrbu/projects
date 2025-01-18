import { ErrorPage } from './ErrorPage';

export function NotFound() {
  return (
    <ErrorPage>
      <h1>
        <span className="status-code">404</span>
        <br />
        Page not found
      </h1>
      <p>
        We can’t find what are you looking for.
        <br />
        You can go back or go straight to our <a href="/">main page</a>.
      </p>
    </ErrorPage>
  );
}
