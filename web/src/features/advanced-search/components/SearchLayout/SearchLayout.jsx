import { Suspense } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { DialogTrigger, Button } from 'react-aria-components';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Dismiss24Filled as Dismiss, Info24Filled as Info } from '@fluentui/react-icons';
import { noop } from '@/core/utils';
import { useScreen } from '@/core/hooks';
import MobileDialog from '@/deprecated/components/MobileDialog/MobileDialog';
import Logo from '@/modules/app-shell/Logo';
import Footer from '@/modules/app-shell/Footer';
import Header from '@/modules/app-shell/HeaderWithLogin';
import { useShowReferralListView, ReferralListWidget } from '@/modules/referral-list';
import { useOrganization } from '@/modules/organization';
import { BenefitsModal } from '@/modules/eligibility';
import {
  LoadingSkeletonPagination,
  LoadingSkeletonResults,
  LoadingSkeletonSummary,
} from '../LoadingSkeleton';
import { Aggregators } from '../Aggregators';
import './SearchLayout.css';

export function SearchLayout(props) {
  const {
    query,
    renderSearchPreview,
    renderSearchBar,
    renderResults,
    hasExpandedSearchHeader,
    hasExpandedSearchFilter,
    onToggleSearchFilter,
    onToggleSearchHeader,
    renderFilters,
    renderResultsSummary,
    renderPagination,
    renderMap,
  } = props;

  let referralListEnabled = useShowReferralListView();
  let isMediumScreen = useScreen('md');

  let flags = useFlags();
  let organization = useOrganization();

  let handleOffToggleSearchHeader = () => onToggleSearchHeader(false);

  let isMobile = !isMediumScreen;
  const AdvancedSearchClasses = cn('AdvancedSearch', { expanded: hasExpandedSearchHeader });

  return (
    <section className={AdvancedSearchClasses}>
      <Header>{renderSearchPreview()}</Header>

      {isMobile && (
        <>
          {renderSearchPreview()}
          <MobileDialog
            isOpen={hasExpandedSearchFilter}
            onDismiss={() => onToggleSearchFilter(false)}
          >
            {renderFilters()}
          </MobileDialog>
        </>
      )}

      {isMobile ? (
        <MobileDialog isOpen={hasExpandedSearchHeader} onDismiss={handleOffToggleSearchHeader}>
          <header>
            <button className="close-button" onClick={handleOffToggleSearchHeader}>
              <Dismiss />
            </button>
            <h2>
              <Logo />
            </h2>
          </header>
          <div style={{ margin: '0.75rem 1rem' }}>{renderSearchBar()}</div>
        </MobileDialog>
      ) : (
        <div style={{ position: 'relative' }}>
          <button className="search-bar-overlay" onClick={handleOffToggleSearchHeader} />
          <div className="search-bar-container">{renderSearchBar()}</div>
        </div>
      )}

      <main>
        <div className="search-grid map-search-grid">
          <div className="wrapper">
            <Suspense fallback={<LoadingSkeletonSummary height={isMobile ? '48px' : '70px'} />}>
              {renderResultsSummary()}
            </Suspense>
            {isMediumScreen ? <div className="mb-4 space-y-4">{renderFilters()}</div> : null}
            {flags.eligibility && organization?.subdomain === 'aetna' ? (
              <DialogTrigger>
                <Button className="w-full bg-p-10 px-4 py-2 text-left font-bold text-p-100 hover:bg-p-20 md:mb-4 md:rounded-lg">
                  <Info className="mr-2 text-p-75" />
                  Check your plan benefits
                </Button>
                <BenefitsModal />
              </DialogTrigger>
            ) : null}
            <Suspense fallback={<LoadingSkeletonResults />}>{renderResults()}</Suspense>
            <Suspense fallback={<LoadingSkeletonPagination />}>{renderPagination()}</Suspense>
            {flags.aggregators ? (
              <Suspense fallback={null}>
                <Aggregators query={query} />
              </Suspense>
            ) : null}
            {referralListEnabled ? <ReferralListWidget /> : null}
          </div>
          <div>{renderMap()}</div>
        </div>
        <Footer />
      </main>
    </section>
  );
}

SearchLayout.propTypes = {
  hasExpandedSearchHeader: PropTypes.bool,
  hasExpandedSearchFilter: PropTypes.bool,
  onToggleSearchHeader: PropTypes.func,
  onToggleSearchFilter: PropTypes.func,
  renderSearchPreview: PropTypes.func,
  renderSearchBar: PropTypes.func,
  renderResultsSummary: PropTypes.func,
  renderResults: PropTypes.func,
  renderFilters: PropTypes.func,
  renderPagination: PropTypes.func,
  renderMap: PropTypes.func,
  onPageChange: PropTypes.func,
  query: PropTypes.object,
};

SearchLayout.defaultProps = {
  hasExpandedSearchHeader: false,
  hasExpandedSearchFilter: false,
  onToggleSearchHeader: noop,
  onToggleSearchFilter: noop,
  renderSearchPreview: noop,
  renderSearchBar: noop,
  renderResultsSummary: noop,
  renderResults: noop,
  renderFilters: noop,
  renderMap: noop,
  renderPagination: noop,
};

export default SearchLayout;
