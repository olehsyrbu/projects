import { useFlag } from '@/core/feature-split';
import { useOrganization } from '@/modules/organization';

export function useLandingPageFlag() {
  let variation = useFlag('provider-landing-page');
  let organization = useOrganization();

  if (!variation) {
    return null;
  }

  let { enabled, organizations } = variation;

  if (enabled && organizations) {
    return !organizations.includes(organization?.subdomain);
  }

  return variation.enabled;
}
