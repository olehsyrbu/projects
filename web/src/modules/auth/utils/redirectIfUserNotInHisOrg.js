import { logger } from '@/core/logger';
import { generateRelevantOrgUrl } from './generateRelevantOrgUrl';

export function redirectIfUserNotInHisOrg({
  nextSubdomain,
  prevSubdomain,
  pathname,
  token,
  isFirstVisit,
} = {}) {
  const url = generateRelevantOrgUrl({
    currentUrl: window.location.href,
    prevSubdomain,
    nextSubdomain,
    pathname,
    token,
    isFirstVisit,
  });

  logger.debug(`Redirecting to '${url}'`);

  window.location.assign(url);
}
