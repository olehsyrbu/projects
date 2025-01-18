import PropTypes from 'prop-types';
import { Filter24Filled as Filter, Search24Filled as Search } from '@fluentui/react-icons';
import { useScreen } from '@/core/hooks';
import './SearchPreview.css';
import { SEARCH_CATEGORIES } from '../../utils';
import { useProgramSearchFlag } from '@/modules/search/hooks';
import { InlineSelect, Item } from '@/core/components';
import {
  AccessibilityFilter,
  AmenitiesFilter,
  AvailabilityFilter,
  EligibilityFilter,
  IdentityPreferencesProviderFilter,
  MoreFilter,
  PaymentFilter,
  SpecialityFilter,
} from '@/features/advanced-search/components';
import { isEqual } from 'lodash-es';
import { useMemo } from 'react';

export function SearchPreview({ location, values, onClick, burgerClick, onCategoryChange, query }) {
  const isMediumScreen = useScreen('md');
  const hasProgramsEnabled = useProgramSearchFlag();

  const handleBurgerClick = (e) => {
    e.stopPropagation();
    burgerClick();
  };

  const filtersCount = useMemo(() => {
    if (query) {
      const defaultFilter = {
        ...AccessibilityFilter.defaultProps.query,
        ...EligibilityFilter.defaultProps.query,
        ...AvailabilityFilter.defaultProps.query,
        ...IdentityPreferencesProviderFilter.defaultProps.query,
        ...PaymentFilter.defaultProps.query,
        ...MoreFilter.defaultProps.query,
        ...SpecialityFilter.defaultProps.query,
      };

      const filterCount = Object.keys(defaultFilter).reduce((memo, key) => {
        const currentValue = query[key];
        if (!isEqual(defaultFilter[key], currentValue)) {
          memo = Array.isArray(currentValue) ? memo + currentValue.length : memo + 1;
        }
        return memo;
      }, 0);

      return filterCount + AmenitiesFilter.getFilterCount(query);
    }
    return null;
  }, [query]);

  if (!isMediumScreen) {
    return (
      <>
        <div className="SearchPreview max-md:mx-4 max-md:mt-2" onClick={onClick}>
          <div className="field-preview">Refine your search</div>
          <Search />
        </div>
        <div
          className="mt-2 flex justify-center p-2 text-base font-medium text-p-100"
          onClick={handleBurgerClick}
        >
          <Filter className="mr-2" />
          {filtersCount
            ? `${filtersCount} ${filtersCount === 1 ? 'filter' : 'filters'} applied to your search`
            : 'Add filters to your search'}
        </div>
      </>
    );
  }

  return (
    <div className="SearchPreviewContainer flex items-center space-x-6">
      <InlineSelect
        label="Mode"
        caption="Search"
        selectedKey={values.category}
        onSelectionChange={onCategoryChange}
      >
        <Item key={SEARCH_CATEGORIES.PROVIDER}>Providers</Item>
        {hasProgramsEnabled ? <Item key={SEARCH_CATEGORIES.PROGRAM}>Programs</Item> : null}
        {hasProgramsEnabled ? <Item key={SEARCH_CATEGORIES.ALL}>All</Item> : null}
        <Item key={SEARCH_CATEGORIES.BY_NAME}>By name</Item>
      </InlineSelect>

      <div className="SearchPreview" onClick={onClick}>
        {values.category === SEARCH_CATEGORIES.PROVIDER ? (
          <>
            <div className="field-preview">{location}</div>
            <div className="field-preview">
              {values.setting === 'remote' ? 'Remote' : null}
              {values.setting === 'inPerson' ? 'In-person' : null}
              {values.setting === 'both' ? 'Remote or in-person' : null}
            </div>
            <div className="field-preview">
              {values.specialties.length
                ? `${values.specialties.length} specialties`
                : 'All specialties'}
            </div>
          </>
        ) : null}
        {values.category === SEARCH_CATEGORIES.PROGRAM ? (
          <>
            <div className="field-preview">{location}</div>
            <div className="field-preview">
              {values.programTypes?.length ? `${values.programTypes.length} types` : 'All types'}
            </div>
            <div className="field-preview">
              {values.specialties.length
                ? `${values.specialties.length} specialties`
                : 'All specialties'}
            </div>
          </>
        ) : null}
        {values.category === SEARCH_CATEGORIES.ALL ? (
          <>
            <div className="field-preview">{location}</div>
            <div className="field-preview">
              {values.specialties.length
                ? `${values.specialties.length} specialties`
                : 'All specialties'}
            </div>
          </>
        ) : null}
        {values.category === SEARCH_CATEGORIES.BY_NAME ? (
          <>
            <div className="field-preview !max-w-xs">
              {values.query || `Search by therapist ${hasProgramsEnabled ? 'or program name' : ''}`}
            </div>
          </>
        ) : null}

        <Search size={24} />
      </div>
    </div>
  );
}

SearchPreview.propTypes = {
  location: PropTypes.string,
  values: PropTypes.any,
  onClick: PropTypes.func,
  burgerClick: PropTypes.func,
  onCategoryChange: PropTypes.func,
  query: PropTypes.object,
};
