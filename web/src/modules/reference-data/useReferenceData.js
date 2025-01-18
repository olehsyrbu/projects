import { useImmutableQuery, gql } from '@/core/graphql';

export function useReferenceData(type, filter, sort) {
  let vars = {
    type,
    filter: { active: true, ...filter },
    sort,
  };

  let { data } = useImmutableQuery(
    gql`
      query ReferenceData(
        $type: ReferenceDataEnum!
        $filter: ReferenceDataFilterInput
        $sort: ReferenceDataOrder
      ) {
        referenceDataByType(filter: $filter, sort: $sort, type: $type) {
          ... on ReferenceData {
            id
            code
            name
            category
            description
            order
          }
        }
      }
    `,
    vars,
  );

  return data.referenceDataByType;
}
