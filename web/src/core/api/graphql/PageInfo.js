import { gql } from 'graphql-request';

export const PageInfoFragment = gql`
  fragment PageInfo on PageInfo {
    page: page
    perPage: per_page
    totalPages: total_pages
    totalItems: total_items
    hasNextPage: has_next_page
    hasPrevPage: has_prev_page
    nextPage: next_page
    prevPage: prev_page
  }
`;
