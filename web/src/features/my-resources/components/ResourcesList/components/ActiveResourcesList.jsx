import { useState } from 'react';
import { Dialog } from '@reach/dialog';
import { Dismiss24Filled as Dismiss } from '@fluentui/react-icons';
import { useAuthContext } from '@/modules/auth';
import {
  removeProviderFromOrganization,
  useOrganizationProviders,
} from '@/core/api/ProviderQueries';
import Pagination from '@/core/components/Pagination';
import ActiveResource from './ActiveResource';
import { Select } from '@/core/components/Select';
import { Switch } from '@/core/components/Switch';
import { activeOptions } from './Filter.constants';
import NoResources from './NoResources';
import NoFilteredResources from './NoFilteredResources';

function getQueryParams(filterBy, abcSort, page) {
  let filter = { mode: 'PERSON' };

  if (filterBy?.group === 'Availability') {
    filter.availability = filterBy.value;
  } else if (filterBy?.group === 'Last updated') {
    filter.last_updated = filterBy.value;
  }

  return {
    filter,
    page,
    sort: abcSort ? { legal_first_name: 'ASC' } : { onboarded_at: 'DESC' },
    limit: 8,
  };
}

export function ActiveResourcesList() {
  let { user } = useAuthContext();

  let [providerForRemoval, setProviderForRemoval] = useState(null);

  let [filterBy, setFilterBy] = useState(activeOptions[0]);
  let [abcSort, setAbcSort] = useState(false);
  let [page, setPage] = useState(1);

  let { data, mutate } = useOrganizationProviders(getQueryParams(filterBy, abcSort, page));
  let { items: providers, pageInfo } = data;

  function handlerSaveTeamNote() {
    mutate();
  }

  function cancelProviderRemoval() {
    setProviderForRemoval(null);
  }

  async function removeProvider() {
    let newProviders = providers.filter((provider) => provider.id !== providerForRemoval.id);
    mutate({ ...data, items: newProviders }, false);
    setProviderForRemoval(null);
    await removeProviderFromOrganization(user.organization.id, providerForRemoval.id);
    mutate();
  }

  const handleFiltering = (filter) => {
    setFilterBy(filter);
    setPage(1);
  };

  const handleInvitationsSorting = (isSelected) => {
    setAbcSort(isSelected);
    setPage(1);
  };

  return (
    <>
      <div className="page-content">
        <div className="content-subheader">
          {(providers.length !== 0 || filterBy) && (
            <div className="sorting-panel">
              <Select
                options={activeOptions}
                label="Filter by"
                onChange={handleFiltering}
                value={filterBy}
              />
              <Switch className="flex-none" onChange={handleInvitationsSorting}>
                A-Z
              </Switch>
            </div>
          )}
        </div>
        {providers.length === 0 ? (
          filterBy ? (
            <NoFilteredResources onClearFilters={() => handleFiltering(activeOptions[0])} />
          ) : (
            <NoResources
              title="There are no active resources here"
              message="We suggest to send some invitations for pending resources or add more resources to your network."
            />
          )
        ) : (
          <>
            <div role="list">
              {providers.map((provider) => (
                <ActiveResource
                  key={provider.id}
                  provider={provider}
                  onRemove={() => setProviderForRemoval(provider)}
                  onNotesSave={handlerSaveTeamNote}
                />
              ))}
            </div>
            {pageInfo.totalItems > pageInfo.perPage && (
              <Pagination
                pageSize={pageInfo.perPage}
                totalPages={pageInfo.totalPages}
                hasPrev={pageInfo.hasPrevPage}
                hasNext={pageInfo.hasNextPage}
                currentPage={pageInfo.page}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
      <Dialog
        className="mir-dialog"
        isOpen={Boolean(providerForRemoval)}
        onDismiss={cancelProviderRemoval}
        aria-labelledby="dialogHeader"
      >
        <button
          className="mir-dialog-close-button"
          onClick={cancelProviderRemoval}
          aria-label="Close dialog"
        >
          <Dismiss />
        </button>
        <h1 id="dialogHeader">Remove resource</h1>
        <p>
          Are you sure to remove {providerForRemoval?.legalFirstName}{' '}
          {providerForRemoval?.legalLastName}? You will no longer see this person in your resources.
        </p>
        <button className="mir-button" onClick={removeProvider}>
          Yes
        </button>
        <button className="mir-button primary" onClick={cancelProviderRemoval}>
          Cancel
        </button>
      </Dialog>
    </>
  );
}
