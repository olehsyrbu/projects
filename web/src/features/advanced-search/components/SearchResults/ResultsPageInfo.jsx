import PropTypes from 'prop-types';
import cn from 'classnames';
import { Switch } from '@/core/components';
import { useOrganization, OrganizationTypes } from '@/modules/organization';
import { useSearchResults } from '../../hooks';

export function ResultsPageInfo({ query, onSwitchGlobalSearch, localSearch }) {
  const searchResults = useSearchResults(query);
  const { pageInfo } = searchResults || {};
  let organization = useOrganization();
  let inNetwork = !localSearch && organization?.type === OrganizationTypes.Insurance;

  return (
    <div className="flex flex-col-reverse items-stretch justify-between border-light p-3 max-md:border-b md:mb-3 md:mb-6 md:flex-row md:items-center md:px-0">
      <h1 className="font-sans text-base font-bold max-md:text-center md:font-serif md:text-3xl">
        {pageInfo?.totalItems > 0
          ? `${pageInfo?.totalItems}${inNetwork ? ' in-network' : ''} care options`
          : 'No care options found'}
      </h1>

      {onSwitchGlobalSearch && (
        <div className="flex justify-center space-x-2 max-md:mb-4">
          <span className={cn({ 'text-hint': localSearch })}>My community</span>
          <Switch isSelected={localSearch} onChange={onSwitchGlobalSearch} />
          <span className={cn({ 'text-hint': !localSearch })}>All resources</span>
        </div>
      )}
    </div>
  );
}

ResultsPageInfo.propTypes = {
  query: PropTypes.object,
  onSwitchGlobalSearch: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  localSearch: PropTypes.bool,
};
