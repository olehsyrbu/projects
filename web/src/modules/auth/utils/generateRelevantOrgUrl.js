import { isEmpty } from 'lodash-es';

export function generateRelevantOrgUrl({
  currentUrl,
  prevSubdomain,
  nextSubdomain,
  pathname,
  token,
  shouldSkipRedirect = false,
  isFirstVisit = false,
}) {
  const url = new URL(currentUrl);
  let host = url.host.toLowerCase();

  if (prevSubdomain) {
    host = host.replace(prevSubdomain.toLowerCase() + '.', '');
  }

  url.host = !isEmpty(nextSubdomain) ? `${nextSubdomain}.${host}` : host;

  if (pathname) {
    url.pathname = pathname;
  }

  if (token) {
    url.search = `auth_token=${token}`;
  }

  if (shouldSkipRedirect) {
    url.search = url.search + '&skip_redirect=true';
  }

  if (isFirstVisit) {
    url.search = url.search + '&firstVisit=true';
  }

  return url.toString();
}
