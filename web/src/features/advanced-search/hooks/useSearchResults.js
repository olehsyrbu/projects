import useSWR from 'swr';
import { debounce, isEmpty } from 'lodash-es';
import mixpanel from '@/core/mixpanel';
import { advancedSearchApi } from '@/core/api/AdvancedSearchApi';
import { useFlag } from '@/core/feature-split';
import { useScreen } from '@/core/hooks';
import { cleanUpQuery, prepForAnalytic } from '../utils';
import { toAdvancedSearchQuery } from './toAdvancedSearchQuery';
import { useAuthContext } from '@/modules/auth';
import { ROLE_NAMES } from '@/core/definitions';
import { filterInactiveEntities } from '@/core/api/utils';

export function useSearchResults(query, suspense = true) {
  let providerPromotion = useFlag('provider-promotion-v2');
  let search = cleanUpQuery(query);

  let isMediumScreen = useScreen('md');
  let shouldHaveBounds = isMediumScreen || query.category !== 'by-name';
  let skip = shouldHaveBounds && isEmpty(search.bounds);
  const { user } = useAuthContext();
  let organizationId;

  if (query.organizationId) {
    organizationId = query.organizationId;
  } else if (user?.role === ROLE_NAMES.REFERRAL_COORDINATOR) {
    organizationId = user.organization?.id;
  }

  let { data } = useSWR(
    !skip ? ['search-results', search] : null,
    async () => {
      let vars = toAdvancedSearchQuery(search);
      vars.organizationId = organizationId;

      let result = await advancedSearchApi(vars);

      result.items = result.items.map(filterInactiveEntities);

      const trigger = search.trigger;
      delete search.trigger;

      track('Search Completed', {
        query: prepForAnalytic(search, query.location),
        total: result.pageInfo.totalItems,
        trigger,
      });

      if (providerPromotion?.subdomain) {
        const updatedResult = result.items.map((item) => {
          const partner = {
            subdomain: providerPromotion.subdomain,
            name: providerPromotion.organizationName,
          };
          const isPartnerOrganization = item.organizations?.find(
            (item) => item?.subdomain === providerPromotion.subdomain,
          );

          return { ...item, partner: isPartnerOrganization ? partner : null };
        });

        return { ...result, items: updatedResult };
      }
      return result;
    },
    { suspense },
  );

  return data;
}

/**
 * Leaves only leading event, so analytics became more relevant,
 * It's a workaround over wrong behaviour when each `search bar` search
 * trigger additional `Search Complete` event caused
 * by map component on change event.
 * @type {(function(): (*))|*}
 */

const track = debounce(
  (event, payload) => {
    mixpanel.track(event, payload);
  },
  1000,
  { leading: true, trailing: false },
);
