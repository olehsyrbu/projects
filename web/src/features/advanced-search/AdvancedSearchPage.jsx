import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mixpanel from '@/core/mixpanel';
import { ErrorBoundary } from 'react-error-boundary';
import { isEmpty, omit } from 'lodash-es';
import { logger } from '@/core/logger';
import { useScreen } from '@/core/hooks';
import { useProgramSearchFlag, useSearchUrlParams } from '@/modules/search/hooks';
import { UrlProviderProfileQuery } from '@/modules/provider/utils';
import { SearchBar, SearchPreview } from '@/modules/search/components';
import {
  SEARCH_CATEGORIES,
  SEARCH_MODES_PERSON,
  SEARCH_MODES_PROGRAM,
  SEARCH_MODES_ALL,
  toAdvancedSearchParams,
  TYPE_PERSON,
} from '@/modules/search/utils';
import { useOrganization, useOrganizationTheme, OrganizationTypes } from '@/modules/organization';

import {
  advancedSearchQueryDefaultProps,
  advancedSearchQueryProps,
  COUNTRY_ZOOM,
  getSort,
  hasDifferentCoordinates,
  hasLocationChangesWithinMap,
  hasNewLocation,
  personQueryDefaultProps,
  programQueryDefaultProps,
} from './utils';

import {
  FilterPanel,
  MapButton,
  NoResults,
  ResultsPageInfo,
  SearchLayout,
  SearchMap,
  SearchResults,
  SearchResultsPagination,
} from './components';

import { useGeocoding } from './hooks';
import { provideDefaultCoordinates } from '@/core/components/Map';

export default function AdvancedSearchPage({ initialQuery }) {
  let hasProgramsEnabled = useProgramSearchFlag();
  const navigate = useNavigate();
  const urlParams = useSearchUrlParams();
  const isMediumScreen = useScreen('md');
  const organization = useOrganization();
  const isGlobalSearchAvailable = organization?.type === OrganizationTypes.School;

  const [expanded, setExpanded] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const [query, setQuery] = useState(() => {
    let query = {
      ...initialQuery,
      ...urlParams.query,
      location: urlParams.query.location ?? '',
    };

    if (!hasProgramsEnabled) {
      query.modes = query.modes.filter((m) => m !== 'PROGRAM');
    }

    if (organization?.subdomain) {
      query.organizationId = organization.id;
      query.organizationSubdomain = urlParams.query.organizationTypes?.length
        ? null
        : organization.subdomain;
    }

    return query;
  });

  const [showMapView, setShowMapView] = useState(false);
  const [hoveredProviderId, setHoveredProviderId] = useState(null);
  const [geocodings, setGeo] = useState(null);
  const [centerMap, setCenter] = useState(query.centerMap);
  const [zoom, setZoom] = useState(query.zoomMap);

  const geocodingsReady = query.location ? Boolean(geocodings) : true;
  const geocodingData = useGeocoding(query.location, geocodings, false);

  const isDifferentCoordinates = useMemo(
    () => hasDifferentCoordinates(centerMap, geocodings?.location),
    [centerMap, geocodings?.location],
  );

  const isLocationChangesWithinMap = useMemo(
    () => hasLocationChangesWithinMap(geocodings, zoom, isDifferentCoordinates),
    [geocodings, isDifferentCoordinates, zoom],
  );

  const isNewLocation = useMemo(
    () => hasNewLocation(geocodings?.locationInput, query.location),
    [geocodings?.locationInput, query.location],
  );

  useOrganizationTheme({
    enableFor: [OrganizationTypes.Insurance],
  });

  useEffect(() => {
    if (geocodingData && (isNewLocation || isDifferentCoordinates)) {
      setGeo(geocodingData);
      setCenter(geocodingData.location);
      setZoom(geocodingData.zoom);
    }
  }, [query.location, geocodingData]);

  useEffect(() => {
    mixpanel.track('Search Page Visit', { query: urlParams.query });
  }, []);

  useEffect(() => {
    if (geocodingData?.location && !isMediumScreen) {
      setQuery({
        ...query,
        ...urlParams.query,
        bounds: geocodingData?.bounds || geocodingData?.viewport,
        region: geocodingData?.region,
        locationCoordinates: geocodingData?.location || query.location,
        sort: getSort(query.setting, geocodingData?.location),
      });
    }
  }, [geocodingData]);

  useEffect(() => {
    logger.debug({ message: 'Search Query Changed', query });
    let params = toAdvancedSearchParams(query);

    navigate({ search: `?${params}` }, { replace: true });
    window.scrollTo(0, 0);
  }, [query]);

  function handlerMapChange({ bounds, centerMap, zoom }) {
    const locationCoordinates = geocodingData?.location || query.locationCoordinates;
    const region = geocodingData?.region || query.region;
    const needToAddBoundsInLocation = !(
      isEmpty(query.bounds) &&
      bounds &&
      query.category === SEARCH_CATEGORIES.BY_NAME
    );

    setCenter(centerMap);
    setZoom(zoom);
    setQuery({
      ...query,
      bounds,
      needToAddBoundsInLocation,
      locationCoordinates: !isLocationChangesWithinMap ? locationCoordinates : null,
      region: !isLocationChangesWithinMap ? region : null,
      sort: getSort(query.setting, geocodingData?.location),
      page: 1,
      trigger: 'Map',
    });
  }

  function handlePageChange(page) {
    setQuery({ ...query, page });
  }

  function applyFilters(filters) {
    let location = query.location;

    if (filters.category === SEARCH_CATEGORIES.BY_NAME) {
      setCenter(provideDefaultCoordinates());
      setZoom(COUNTRY_ZOOM);
      location = null;
    }

    let result = {
      ...query,
      ...filters,
      sort: getSort(filters.setting, location),
      page: 1,
    };
    setQuery(result);

    return result;
  }

  function handleFilterApply(filters) {
    const result = applyFilters(filters);
    mixpanel.track('Search Apply Filters', { filters });

    setFiltersExpanded(false);
    setExpanded(false);
    mixpanel.track('Submit Search', {
      changes: filters,
      query: result,
    });
  }

  function handleSelectionChange(context) {
    mixpanel.track('Search Filter Selection Change', {
      filter: {
        section: context.dataKey,
        name: context.name,
        prev: context.prev,
        next: context.next,
        modes: query.modes,
      },
    });
  }

  function handleFilterClear(filters) {
    applyFilters(filters);
    mixpanel.track('Clear Filter', { changes: filters });
  }

  function handleClearAllFilters() {
    setQuery({
      ...initialQuery,
      category: query.category,
      modes: query.modes,
      organizationSubdomain: organization?.subdomain,
      location: query.location,
      bounds: query.bounds,
      isAcceptingNewClients: false,
      hasPsypact: false,
      locationCoordinates: query.locationCoordinates,
      sort: getSort(initialQuery.setting, query.location),
      query: query.query,
    });

    setFiltersExpanded(false);

    // clear url from url query params
    navigate('/search');

    mixpanel.track('Clear All Filters');
  }

  function handleOpenProfile(id, distance = '', mode = TYPE_PERSON, partner, status) {
    const paramsSearch = toAdvancedSearchParams(query);

    const paramsProvider = UrlProviderProfileQuery.create({
      distance,
    }).toString();
    let type = mode === TYPE_PERSON ? 'provider' : 'program';

    window.open(`/${type}/${id}/?${paramsSearch}&${paramsProvider}`);

    mixpanel.track('Search Result Click', {
      status,
      providerSlug: id,
      partner: partner && !organization?.subdomain ? partner : '',
      mode,
    });
  }

  function handleNotesChange() {
    setQuery({ ...query, timestamp: Date.now() });
  }

  function handleToggleMapView() {
    setShowMapView(!showMapView);
  }

  function handleSwitchGlobalSearch(isChecked) {
    setQuery({
      ...query,
      organizationSubdomain: isChecked ? null : organization?.subdomain,
      organizationTypes: isChecked ? { ne: OrganizationTypes.Insurance } : null,
      page: 1,
    });

    mixpanel.track('Switch Global Search', { isChecked });
  }

  function handleChangeModes(modes = []) {
    let newQuery = { ...query, modes };
    let modePerson = modes.includes('PERSON');

    if (modes.length === 1) {
      let propsNeedsToRemove = modePerson ? programQueryDefaultProps : personQueryDefaultProps;

      newQuery = {
        ...initialQuery,
        ...newQuery,
        propsNeedsToRemove,
        paymentMethods: modePerson
          ? query.paymentMethods.filter((c) => c !== 'needbasedaid')
          : query.paymentMethods,
      };
    } else {
      newQuery = {
        ...initialQuery,
        ...omit(newQuery, ['rainbowMember']),
      };
    }
    setQuery(newQuery);
  }

  function renderSearchResults() {
    return (
      <SearchResults
        query={query}
        onChangeNotes={handleNotesChange}
        onOpenProfile={handleOpenProfile}
        onResetFilters={handleClearAllFilters}
        onPageChange={handlePageChange}
        hoveredProviderId={hoveredProviderId}
        onHoverProvider={setHoveredProviderId}
      />
    );
  }

  const searchClasses = showMapView ? 'search-hide-footer' : '';

  const locationPreview = isLocationChangesWithinMap
    ? 'Map area'
    : query.location || 'Add location';

  return (
    <div className={searchClasses}>
      <SearchLayout
        query={query}
        hasExpandedSearchHeader={expanded}
        hasExpandedSearchFilter={filtersExpanded}
        onToggleSearchHeader={setExpanded}
        onToggleSearchFilter={setFiltersExpanded}
        renderSearchPreview={() => (
          <SearchPreview
            location={locationPreview}
            values={query}
            onClick={() => setExpanded(true)}
            burgerClick={() => setFiltersExpanded(true)}
            onChangeModeFilter={handleChangeModes}
            onCategoryChange={(category) => {
              handleFilterApply({
                trigger: 'SearchBar',
                category,
                modes: {
                  [SEARCH_CATEGORIES.PROVIDER]: SEARCH_MODES_PERSON,
                  [SEARCH_CATEGORIES.PROGRAM]: SEARCH_MODES_PROGRAM,
                  [SEARCH_CATEGORIES.ALL]: SEARCH_MODES_ALL,
                  [SEARCH_CATEGORIES.BY_NAME]: SEARCH_MODES_ALL,
                }[category],
              });
            }}
            query={query}
          />
        )}
        renderSearchBar={() => (
          <SearchBar
            programTypes={query.programTypes}
            category={query.category}
            location={query.location}
            setting={query.setting}
            specialties={query.specialties}
            query={query.query}
            onSubmit={(query) =>
              handleFilterApply({
                trigger: 'Search',
                ...query,
              })
            }
            centered
          />
        )}
        renderFilters={() => (
          <FilterPanel
            query={query}
            onDismiss={() => setFiltersExpanded(false)}
            onApply={(filters) =>
              handleFilterApply({
                trigger: 'Filter',
                ...filters,
              })
            }
            onClear={handleFilterClear}
            onChange={handleSelectionChange}
            onClearAll={handleClearAllFilters}
          />
        )}
        renderResultsSummary={() => (
          <ResultsPageInfo
            query={query}
            onSwitchGlobalSearch={isGlobalSearchAvailable && handleSwitchGlobalSearch}
            onChangeModeFilter={handleChangeModes}
            localSearch={Boolean(query.organizationTypes)}
          />
        )}
        renderMap={() =>
          isMediumScreen &&
          geocodingsReady && (
            <SearchMap
              centerMap={centerMap}
              zoom={zoom}
              query={query}
              onMapChange={handlerMapChange}
              onOpenProfile={handleOpenProfile}
              hoveredProviderId={hoveredProviderId}
              onHoverProvider={setHoveredProviderId}
            />
          )
        }
        renderResults={() => (
          <ErrorBoundary
            fallbackRender={({ resetErrorBoundary }) => (
              <NoResults
                onResetFilters={() => {
                  handleClearAllFilters();
                  resetErrorBoundary();
                }}
              />
            )}
          >
            {!isMediumScreen ? (
              <>
                {showMapView ? (
                  <SearchMap
                    centerMap={centerMap}
                    zoom={zoom}
                    query={query}
                    onMapChange={handlerMapChange}
                    onOpenProfile={handleOpenProfile}
                    hoveredProviderId={hoveredProviderId}
                    onHoverProvider={setHoveredProviderId}
                  />
                ) : (
                  renderSearchResults()
                )}
                <MapButton
                  query={query}
                  text={showMapView ? 'Hide Map' : 'Show Map'}
                  handleClick={handleToggleMapView}
                />
              </>
            ) : (
              renderSearchResults()
            )}
          </ErrorBoundary>
        )}
        renderPagination={() =>
          !showMapView ? (
            <SearchResultsPagination query={query} onPageChange={handlePageChange} />
          ) : null
        }
      />
    </div>
  );
}

AdvancedSearchPage.propTypes = {
  initialQuery: advancedSearchQueryProps(),
};

AdvancedSearchPage.defaultProps = {
  initialQuery: advancedSearchQueryDefaultProps(),
};
