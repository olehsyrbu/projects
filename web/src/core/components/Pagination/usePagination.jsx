import { useMemo } from 'react';

export const DOTS = '...';

const range = (start, end) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = (current, total, siblings = 1) => {
  const paginationRange = useMemo(() => {
    // Pages count is determined as siblings + firstPage + lastPage + current + 2*DOTS
    const totalPageNumbers = siblings + 5;

    /**
     * If the number of pages is less than the page numbers we want to show in our
     * paginationComponent, we return the range [1..total]
     */
    if (totalPageNumbers >= total) {
      return range(1, total);
    }

    const leftSiblingIndex = Math.max(current - siblings, 1);
    const rightSiblingIndex = Math.min(current + siblings, total);

    /**
     * We do not want to show dots if there is only one position left
     * after/before the left/right page count as that would lead to a change if our Pagination
     * component size which we do not want
     */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < total - 2;

    const firstPageIndex = 1;
    const lastPageIndex = total;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblings;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, total];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblings;
      let rightRange = range(total - rightItemCount + 1, total);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [current, total, siblings]);

  return paginationRange.map((pageNumber, index) => ({ id: index, label: pageNumber }));
};
