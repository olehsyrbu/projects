import { useQuery, gql } from '@/core/graphql';

export function useAggregators(search) {
  let filter = getSearchFilter(search);

  let query = useQuery(filter ? aggregatorsQuery : null, { filter, page: 1, limit: 50 });
  let items = query.data?.providersSearch.items ?? [];

  items.sort((itemA, itemB) => itemA.name.localeCompare(itemB.name));

  for (let item of items) {
    item.therapeuticAreas?.sort((areaA, areaB) => {
      let indexA = search.specialties?.includes(areaA.area.code) ? 1 : 0;
      let indexB = search.specialties?.includes(areaB.area.code) ? 1 : 0;
      return indexA === indexB ? areaA.area.name.localeCompare(areaB.area.name) : indexB - indexA;
    });
  }

  return items;
}

function getSearchFilter(search) {
  if (search.category === 'by-name') {
    return { modes: ['AGGREGATOR'], fuzzy_search: search.query };
  }

  let isSearchForProvider = search.category === 'provider' || search.category === 'all';
  let isSearchForRemote = search.setting === 'remote' || search.setting === 'both';

  return isSearchForProvider && isSearchForRemote
    ? {
        modes: ['AGGREGATOR'],
        therapeutic_areas: search.specialties,
        age_groups: search.ageGroups,
        can_prescribe_medication: search.canPrescribeMedication || undefined,
        location: { states: search.region ? [search.region] : [] },
      }
    : null;
}

let aggregatorsQuery = gql`
  query AggregatorsSearch($filter: ProvidersSearchInput, $page: UInt!, $limit: UInt!) {
    providersSearch(filter: $filter, page: $page, limit: $limit) {
      items {
        id
        name: legal_name
        photoUrl: photo_url
        website
        therapies {
          code
        }
        medication: can_prescribe_medication
        therapeuticAreas: therapeutic_areas {
          area: therapeutic_area {
            code
            name
          }
        }
        ages: age_groups {
          code
          name: description
          from: age_start
        }
        paymentOptions: payment_options {
          code
          name
        }
      }
    }
  }
`;
