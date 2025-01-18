import { useFlag } from '@/core/feature-split';
import { useOrganization } from '@/modules/organization';

export function useProgramSearchFlag() {
  let variation = useFlag('program-search');
  let organization = useOrganization();
  let subdomain = organization?.subdomain ?? '';

  if (!variation) {
    return false;
  }

  let { enabled, organizations } = variation;

  if (enabled && organizations) {
    return organizations.includes(subdomain);
  }

  return variation.enabled;
}
