import PropTypes from 'prop-types';
import cn from 'classnames';
import {
  ChevronLeft24Filled as ChevronLeft,
  ChevronRight24Filled as ChevronRight,
} from '@fluentui/react-icons';
import { useMatchMedia } from '@/core/hooks';
import { usePagination, DOTS } from './usePagination';

export default function Pagination(props) {
  const { hasPrev, hasNext, onPageChange, currentPage, totalPages } = props;

  let smallScreen = useMatchMedia('(max-width: 500px)');
  let paginationRange = usePagination(currentPage, totalPages);

  if (
    paginationRange === undefined ||
    currentPage === 0 ||
    (paginationRange && paginationRange?.length < 2)
  ) {
    return null;
  }

  const onNext = () => {
    if (currentPage !== totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const onPrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className={cn('flex', smallScreen ? 'space-x-1' : 'space-x-6')}>
      <button
        aria-label="Previous page"
        disabled={!hasPrev}
        className="text-p-100 disabled:text-p-40"
        onClick={onPrevious}
      >
        <ChevronLeft />
      </button>

      {!smallScreen ? (
        <div className="flex space-x-4 font-medium text-p-100">
          {paginationRange?.map((pageInfo) => {
            let selected = pageInfo.label === currentPage;

            return pageInfo.label === DOTS ? (
              <span key={pageInfo.id} className="inline-flex items-center justify-center size-8">
                ...
              </span>
            ) : (
              <button
                key={pageInfo.id}
                className={cn('size-8', { 'rounded-full bg-p-120 text-white': selected })}
                onClick={() => onPageChange(pageInfo.label)}
              >
                {pageInfo.label}
              </button>
            );
          })}
        </div>
      ) : (
        <span>
          {currentPage} of {totalPages}
        </span>
      )}

      <button
        aria-label="Next page"
        disabled={!hasNext}
        className="text-p-100 disabled:text-p-40"
        onClick={onNext}
      >
        <ChevronRight />
      </button>
    </div>
  );
}

Pagination.propTypes = {
  hasNext: PropTypes.bool,
  hasPrev: PropTypes.bool,
  totalPages: PropTypes.number,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
};
