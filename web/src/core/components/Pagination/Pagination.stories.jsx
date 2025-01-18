import PaginationControl from './Pagination';
import { useState } from 'react';

export default {
  title: 'Components/Pagination',
  totalItems: 64,
  totalPages: 12,
  pageSize: 5,
  hasPrev: true,
  hasNext: true,
  currentPage: 1,
};

function PaginationTemplate(args) {
  const [currentPage, setPage] = useState(args.currentPage);

  return (
    <PaginationControl
      {...args}
      hasPrev={currentPage !== 1}
      hasNext={args.totalItems !== currentPage}
      currentPage={currentPage}
      onPageChange={(page) => setPage(page)}
    />
  );
}

export let PaginationDefault = PaginationTemplate.bind({});
PaginationDefault.args = {
  totalItems: 64,
  totalPages: 12,
  pageSize: 1,
  hasPrev: false,
  hasNext: true,
  currentPage: 1,
};

export function PaginationStory() {
  return (
    <div className="flex flex-col gap-6">
      <PaginationControl
        {...{
          totalItems: 64,
          totalPages: 12,
          pageSize: 1,
          hasPrev: false,
          hasNext: true,
          currentPage: 1,
        }}
      />

      <PaginationControl
        {...{
          totalItems: 20,
          totalPages: 12,
          pageSize: 1,
          hasPrev: true,
          hasNext: true,
          currentPage: 3,
        }}
      />

      <PaginationControl
        {...{
          totalItems: 20,
          totalPages: 12,
          pageSize: 1,
          hasPrev: true,
          hasNext: true,
          currentPage: 10,
        }}
      />

      <PaginationControl
        {...{
          totalItems: 20,
          totalPages: 12,
          pageSize: 1,
          hasPrev: true,
          hasNext: false,
          currentPage: 20,
        }}
      />

      <PaginationControl
        {...{
          totalItems: 2,
          totalPages: 2,
          pageSize: 1,
          hasPrev: false,
          hasNext: true,
          currentPage: 1,
        }}
      />
    </div>
  );
}

PaginationStory.storyName = 'All Pagination';
