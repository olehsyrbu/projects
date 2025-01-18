import PropTypes from 'prop-types';
import { useSearchResults } from '@/features/advanced-search/hooks';
import Pagination from '@/core/components/Pagination';

export function SearchResultsPagination({ query, onPageChange }) {
  const searchResults = useSearchResults(query);
  const { pageInfo } = searchResults || {};

  return pageInfo?.totalPages > 1 ? (
    <div className="mb-9 flex justify-center">
      <Pagination
        pageSize={pageInfo.perPage}
        totalPages={pageInfo.totalPages}
        hasPrev={pageInfo.hasPrevPage}
        hasNext={pageInfo.hasNextPage}
        currentPage={query.page}
        onPageChange={onPageChange}
      />
    </div>
  ) : null;
}

SearchResultsPagination.propTypes = {
  query: PropTypes.object.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
