import { useEffect } from 'react';
import mixpanel from '@/core/mixpanel';
import { useOrganization } from '@/modules/organization';
import { useSearchUrlParams } from '@/modules/search/hooks';

export function useTrackPageVisit(profile) {
  let organization = useOrganization();

  // TODO: update this after MIR-4459 is implemented
  let searchParams = useSearchUrlParams();

  useEffect(() => {
    if (profile.mode === 'PERSON') {
      mixpanel.track('Provider Page Visit', {
        status: profile.status,
        providerSlug: profile.slug,
        searchQuery: searchParams.query,
        partner: profile.partner && !organization?.subdomain ? profile.partner : '',
      });
    }

    if (profile.mode === 'PROGRAM') {
      mixpanel.track('Program Page Visit', {
        status: profile.status,
        slug: profile.slug,
        searchQuery: searchParams.query,
      });
    }
  }, []);
}
